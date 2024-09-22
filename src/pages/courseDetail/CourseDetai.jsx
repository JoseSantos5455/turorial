import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetCourseDetailQuery } from '../../services/coursesAPI';
import { Tree, Layout, Button, ConfigProvider, Image, Modal, Spin, Skeleton } from 'antd';
import CheckMark from './../../assets/image/check-mark.svg'
import { CaretDownFilled, CaretDownOutlined, CaretLeftOutlined, CaretRightOutlined, CaretUpOutlined, PlusOutlined } from '@ant-design/icons';
import videoIcon from '../../assets/image/video-duration.svg';
import inFoIcon from '../../assets/image/document.svg';
import quizIcon from '../../assets/image/web-test.svg';
import playIcon from '../../assets/image/play-button.svg';
import clockIcon from '../../assets/image/clock.svg';
import levelIcon from '../../assets/image/level.svg';
import location from '../../assets/image/location.svg';
import all from '../../assets/image/all.svg';
const { Content, Sider } = Layout;

const CourseDetai = () => {
    const { tutorialId } = useParams();
    const { data: courseDetail, error, isLoading } = useGetCourseDetailQuery(tutorialId);
    const [isExpland, setIsExpland] = useState(false);
    const [expandedKeys, setExpandedKeys] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [videoSrc, setVideoSrc] = useState('');

    useEffect(() => {
        if (courseDetail) {
            setVideoSrc(courseDetail.introductionVideo);
        }
    }, [courseDetail]);

    const handleDisplayTypeVideo = {
        "video": <Image preview={false} width={15} src={videoIcon} />,
        "infomation": <Image preview={false} width={15} src={inFoIcon} />,
        "quiz": <Image preview={false} width={15} src={quizIcon} />
    }

    const toggleExpand = () => {
        if (isExpland) {
            setExpandedKeys([]);
        } else {
            setExpandedKeys(treeData.map(item => item.key)); // Expand all
        }
        setIsExpland(prev => !prev); // Toggle expand state
    };

    const onExpand = (expandedKeysValue) => {
        setExpandedKeys(expandedKeysValue); // Update expanded keys for individual chapter expansion
    };

    const handleDisplayTime = (time) => {
        if (time < 60) {
            return <span>{time} phút</span>;
        } else {
            const hours = Math.floor(time / 60);
            const minutes = time % 60;
            return <span>{hours} giờ {minutes > 0 ? `${minutes} phút` : ''}</span>;
        }
    }

    if (isLoading) return (
        <div>
            <Skeleton active />
        </div>
    );

    if (error) return <div>Error loading course details.</div>;

    if (!courseDetail || !courseDetail.videoContent) return <div>No course details available.</div>;

    const totalCourseLessons = courseDetail.videoContent.reduce((acc, chapter) => acc + chapter.lessons.length, 0);
    const totalCourseDuration = courseDetail.videoContent.reduce((acc, chapter) => acc + chapter.lessons.reduce((acc, lesson) => acc + (lesson.duration || 0), 0), 0);
    const totalChapters = courseDetail.videoContent.length;
    const treeData = courseDetail.videoContent.map((chapter, index) => {
        const chapterIndex = index + 1;
        const lessons = chapter.lessons;
        const totalLessons = lessons.length;
        const totalDuration = lessons.reduce((acc, lesson) => acc + (lesson.duration || 0), 0);

        return {
            title: (
                <p className='text-[16px]  px-3 font-semibold' >
                    Chương {chapterIndex}: {chapter.chapterName}
                </p>
            ),
            key: `chapter_${chapterIndex}`,
            children: lessons.map((lesson, lessonIndex) => {
                const lessonNumber = totalCourseLessons - (totalCourseLessons - (chapterIndex - 1) * totalLessons - lessonIndex) + 1;
                return {
                    title: (
                        <span className='text-black flex items-center'>
                            <span className='px-2'>{handleDisplayTypeVideo[lesson.type]}</span>
                            <span className='font-semibold'>Bài {lessonNumber}</span>:
                            <p className='mr-4'>  {lesson.videoName || lesson.quizName}</p>
                            ({lesson.duration ? handleDisplayTime(lesson.duration) : 'Quiz'})
                        </span>
                    ),
                    key: `lesson_${chapterIndex}_${lessonNumber}`,
                };
            }),
        };
    });

    const showModal = () => {
        setIsModalVisible(true);
        document.getElementById('video-iframe').src = videoSrc;
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        document.getElementById('video-iframe').src = '';
    };

    return (
        <Layout className='min-h-screen relative bg-white'>
            <div style={{ padding: '20px', width: '65%' }}>
                <p className='font-bold text-4xl pb-5'>{courseDetail.name}</p>
                <p>{courseDetail.description}</p>
                <p className='font-bold text-xl mt-4 py-2'>Bạn sẽ học được gì ?</p>
                <div className='grid grid-cols-2 mt-3 gap-4'>
                    {courseDetail.whatYouWillLearn.map((item, index) => (
                        <p key={index} className='col-span-1 flex'><Image preview={false} width={20} src={CheckMark} /> {item}</p>
                    ))}
                </div>
                <p className='font-bold text-xl mt-4 py-2'>Nội dung khóa học</p>
                <p className='flex justify-between mt-2 mb-4'>
                    <p>
                        <span className='font-semibold'>{totalChapters}
                        </span> chương
                        <span className='px-2'>•</span>
                        <span className='font-semibold'>{totalCourseLessons}</span> bài học
                        <span className='px-2'>•</span>thời lượng
                        <span className='font-semibold'> {handleDisplayTime(totalCourseDuration)}</span>
                    </p>
                    <button
                        className='font-bold text-[#4096ff] hover:shadow-lg border-[1px] border-white transition-all rounded-lg hover:border hover:border-[#4096ff] px-2 py-1'
                        onClick={toggleExpand}
                    >
                        {isExpland ? 'Thu gọn tất cả' : 'Mở rộng tất cả'}
                    </button>
                </p>
                <ConfigProvider
                    theme={{
                        components: {
                            Tree: {
                                nodeSelectedBg: 'none',
                            },
                        },
                    }}
                >
                    <Tree
                        className='bg-[#f5f5f5] px-6 py-2 pt-3'
                        showIcon
                        showLine
                        ex
                        treeData={treeData}
                        expandedKeys={expandedKeys} // Use state for expanded keys
                        onExpand={onExpand} // Handle individual expansion
                        switcherIcon={({ expanded }) => (
                            <span className={`text-[#6b96ff] transition duration-200`}>
                                {expanded ? <CaretDownOutlined style={{ fontSize: '25px', marginRight: '8px' }} /> :
                                    <CaretDownFilled style={{ fontSize: '25px', marginRight: '8px' }} />}
                            </span>
                        )}
                    />

                </ConfigProvider>
                <p className='font-bold text-xl mt-4 py-2'>Yêu cầu</p>
                <div className='grid grid-cols-1 mt-3 gap-4'>
                    {courseDetail.requirements.map((item, index) => (
                        <p key={index} className='col-span-1 flex'><Image preview={false} width={20} src={CheckMark} /> {item}</p>
                    ))}
                </div>
                <p className='font-bold text-xl mt-4 py-2'>Thông tin bổ sung </p>
                <div>
                    {courseDetail.moreInformation}
                </div>
            </div>
            <Sider
                width={400}
                theme="light"
                style={{ position: 'fixed', right: '5%', top: '20%' }}
                className='h-full'
            >
                <div className='relative w-full flex justify-center cursor-pointer' onClick={showModal}>
                    <Image
                        className='rounded-3xl'
                        preview={false}
                        src={courseDetail.image}
                        controls
                        style={{ width: '100%', marginBottom: '20px', filter: 'brightness(0.8)' }}
                    >
                    </Image>
                    <p className='absolute top-20 right-0 left-0 flex justify-center'><Image width={80} preview={false} src={playIcon} /></p>
                    <p className='absolute bottom-10 text-white font-medium right-0 left-0 flex justify-center'> Ấn để xem giới thiệu</p>
                </div>
                <Modal
                    title="Video giới thiệu khóa học"
                    width={'60%'}
                    open={isModalVisible}
                    onCancel={handleCancel}
                    footer={null}
                >
                    <p className='font-bold text-2xl pb-4'>{courseDetail.name}</p>
                    <iframe id="video-iframe" width="100%" height="500px" src={videoSrc} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                </Modal>
                <div className='flex flex-col justify-center items-center'>
                    <p className={`text-center font-bold text-xl ${courseDetail.isPaidCourse ? "text-orange-600" : "text-green-700"}`}>
                        {courseDetail.isPaidCourse ? courseDetail.price.toLocaleString('vi-VN') + "đ" : "Miễn Phí"}
                    </p>
                    <Button
                        type="primary"
                        size='large'
                        className='bg-gradient-to-r
                    w-[60%] mt-5
                    from-blue-500 to-cyan-400 text-white 
                    font-medium rounded-full py-3 px-6 transition-transform duration-800
                     hover:from-cyan-400 hover:to-blue-500 hover:scale-105 hover:shadow-cyan-200 hover:shadow-lg'
                    >
                        {courseDetail.isPaidCourse ? "Mua ngay" : "Đăng ký học"}
                    </Button>
                    <div>
                        <p className='text-sm text-gray-700 mt-4 flex gap-3'><Image preview={false} width={20} src={levelIcon} />Trình độ cơ bản</p>
                        <p className='text-sm text-gray-700 mt-4 flex gap-3'><Image preview={false} width={20} src={all} />Tổng số<span className='font-bold mx-[-7px]'>{totalCourseLessons}</span>bài học</p>
                        <p className='text-sm text-gray-700 mt-4 flex gap-3'><Image preview={false} width={20} src={clockIcon} />Thời lượng <span className='font-bold mx-[-7px]'>{handleDisplayTime(totalCourseDuration)}</span></p>
                        <p className='text-sm text-gray-700 mt-4 flex gap-3'><Image preview={false} width={20} src={location} />Học mọi lúc mọi nơi</p>

                    </div>
                </div>
            </Sider>
        </Layout>
    );
}

export default CourseDetai;
