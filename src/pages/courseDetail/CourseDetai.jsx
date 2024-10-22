import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEnrollCourseMutation, useGetCourseDetailForGuestQuery, useGetCourseDetailQuery } from '../../services/coursesAPI';
import { Tree, Layout, Button, ConfigProvider, Image, Modal, Spin, Skeleton, message } from 'antd';
import CheckMark from './../../assets/image/check.svg'
import { CaretDownFilled, CaretDownOutlined, CaretLeftOutlined, CaretRightOutlined, CaretUpOutlined, PlusOutlined } from '@ant-design/icons';
import videoIcon from '../../assets/image/video-duration.svg';
import inFoIcon from '../../assets/image/document.svg';
import quizIcon from '../../assets/image/web-test.svg';
import playIcon from '../../assets/image/play-button.svg';
import clockIcon from '../../assets/image/clock.svg';
import levelIcon from '../../assets/image/level.svg';
import location from '../../assets/image/location.svg';
import all from '../../assets/image/all.svg';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../slices/auth.slice';
import './../leaningPage/takenote.scss'
import { useDispatch } from 'react-redux';
import { showLoginModal } from '../../slices/modal.slice';
const { Content, Sider } = Layout;

const CourseDetai = () => {
    const user = useSelector(selectCurrentUser);
    const { tutorialId } = useParams();
    const { data: courseDetail, error, isLoading, refetch } = useGetCourseDetailQuery({ courseId: tutorialId });
    const { data: courseDetailForGuest, error: dataGuestError, isLoading: loadingGuest, refetch: refectGuest } = useGetCourseDetailForGuestQuery({ courseId: tutorialId });
    const [enrollCourse, { isLoading: isLoadingEnroll }] = useEnrollCourseMutation();
    const [isExpland, setIsExpland] = useState(false);
    const [expandedKeys, setExpandedKeys] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [videoSrc, setVideoSrc] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch()

    const courseData = user ? courseDetail : courseDetailForGuest;

    useEffect(() => {
        if (courseData) {
            setVideoSrc(getEmbedUrl(courseData.data.introductionVideo));
        }
    }, [courseData]);

    const getEmbedUrl = (url) => {
        const videoId = url.split('v=')[1];
        return `https://www.youtube.com/embed/${videoId}`;


    };


    const handleDisplayTypeVideo = {
        "video": <Image preview={false} width={15} src={videoIcon} />,
        "info": <Image preview={false} width={15} src={inFoIcon} />,
        "quiz": <Image preview={false} width={15} src={quizIcon} />
    }

    const toggleExpand = () => {
        if (isExpland) {
            setExpandedKeys([]);
        } else {
            setExpandedKeys(treeData.map(item => item.key));
        }
        setIsExpland(prev => !prev);
    };

    const onExpand = (expandedKeysValue) => {
        setExpandedKeys(expandedKeysValue);
    };

    const handleDisplayTime = (time) => {
        if (time < 60) {
            return <span>{time} phút</span>;
        } else {
            const hours = Math.floor(time / 60);
            const minutes = time % 60;
            return <span>({hours}:{minutes > 10 ? `${minutes}` : '0' + minutes})</span>;
        }
    }

    const handleEnroll = async () => {
        if (!user) {
            dispatch(showLoginModal());
            message.error("Bạn cần đăng nhập để tham gia khóa học!");
            return;
        }
        try {
            const rs = await enrollCourse({ courseId: tutorialId, userId: user?.id });
            console.log(rs);

            if (rs?.error?.data?.status === "UNPAID") {
                message.error("Bạn cần nâng cấp thành viên để tham gia khóa học!");
                navigate("/combo");
            } else if (rs?.data?.status === "SUCCESS") {
                message.success("Tham gia khóa học thành công!");
                refetch();
            } else if (rs?.error?.data?.status === "ALREADY_ENROLLED") {
                message.success("Bạn đã tham gia khóa học này rồi!");
                refetch();
            }
        } catch (error) {
            message.error("Tham gia khóa học thất bại!");
        }
    }

    if (isLoading || loadingGuest) return (
        <div>
            <Skeleton active />
        </div>
    );

    if (!courseData) return <div>No course details available.</div>;

    const totalCourseLessons = courseData.data.totalLessons;
    const totalCourseDuration = courseData.data.totalDuration;
    const totalChapters = courseData.data.chapters.length;

    const getSortedLessons = (data) => {
        const sortedLessons = [];

        data.chapters.forEach(chapter => {
            chapter.lesson.forEach(lesson => {
                const items = [
                    ...lesson.videos.map(video => ({ type: 'video', ...video })),
                    ...lesson.infos.map(info => ({ type: 'info', ...info })),
                    ...lesson.quizs.map(quiz => ({ type: 'quiz', ...quiz }))
                ];


                items.sort((a, b) => (a.stt || Infinity) - (b.stt || Infinity));


                sortedLessons.push({
                    chapterName: chapter.chapterName,
                    items
                });
            });
        });

        return sortedLessons;
    };

    const sortedLessons = getSortedLessons(courseData.data);

    const treeData = courseData.data.chapters.map((chapter, index) => {
        const chapterIndex = index + 1;
        const lessons = chapter.lesson;

        return {
            title: (
                <p className='text-[16px]  mb-2 px-3 font-semibold' >
                    Chương {chapterIndex}: {chapter.chapterName}
                </p>
            ),
            key: `chapter_${chapterIndex}`,
            children: sortedLessons.filter(item => item.chapterName === chapter.chapterName).flatMap(item => item.items.map((lesson, lessonIndex) => {
                return {
                    title: (
                        <div className='text-black mb-1 flex items-center w-full'>
                            <span className='px-2'>{handleDisplayTypeVideo[lesson.type]}</span>
                            <span className='font-semibold'>Bài {lessonIndex + 1}</span>:
                            <p className='mr-4 ml-1 flex justify-between min-w-[600px]'>  {lesson.videoName || lesson.infoTitle || lesson.title}
                                <div className='text-left'>
                                    <p >
                                        {lesson.type === "video" ? <span>Video {handleDisplayTime(lesson.duration)}</span> :
                                            lesson.type === "quiz" ? 'Kiểm tra' :
                                                lesson.type === "info" ? 'Bài học' : null}
                                    </p>
                                </div>
                            </p>
                        </div>
                    ),
                    key: `lesson_${chapterIndex}_${lessonIndex + 1}`,
                };
            })),
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
                <p className='font-bold text-[42px] pb-5 bg-custom-gradient bg-clip-text text-transparent' style={{ textShadow: '8px 8px 8px rgba(0, 0, 0, 0.2)' }}>{courseData.data.courseName}</p>
                <p className='text-[15px]'>{courseData.data.description}</p>
                <p className='font-bold text-xl mt-4 py-2'>Bạn sẽ học được gì ?</p>
                <div className='grid grid-cols-2 mt-3 gap-4'>
                    {courseData.data.whatYouWillLearn?.map((item, index) => (
                        <p key={index} className='col-span-1 flex items-center gap-2'><Image preview={false} width={15} src={CheckMark} /> {item} </p>
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
                        className='bg-[#f5f5f5] px-6 py-2 pt-3 w-full'
                        showIcon
                        showLine
                        ex
                        treeData={treeData}
                        expandedKeys={expandedKeys}
                        onExpand={onExpand}
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
                    {courseData.data.requireToPass?.map((item, index) => (
                        <p key={index} className='col-span-1 flex items-center gap-2'><Image preview={false} width={15} src={CheckMark} /> {item}</p>
                    ))}
                </div>
                <p className='font-bold text-xl mt-4 py-2'>Thông tin bổ sung </p>
                <div dangerouslySetInnerHTML={{ __html: courseData.data.moreInformation }} className='olCustome ml-7 mt-2'>

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
                        src={courseData.data.image}
                        controls
                        style={{ width: '100%', marginBottom: '20px', filter: 'brightness(0.8)' }}
                    >
                    </Image>
                    <p className='absolute top-20 right-0 left-0 flex justify-center'><Image width={80} preview={false} src={playIcon} /></p>
                    <p className='absolute bottom-10 text-white font-medium right-0 left-0 flex justify-center'> Ấn để xem giới thiệu</p>
                </div>
                <Modal
                    title="Video giới thiệu kh��a học"
                    width={'60%'}
                    open={isModalVisible}
                    onCancel={handleCancel}
                    footer={null}
                >
                    <p className='font-bold text-2xl pb-4'>{courseData.data.courseName}</p>
                    <iframe id="video-iframe" width="100%" height="500px" src={videoSrc} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                </Modal>
                <div className='flex flex-col justify-center items-center'>
                    <p className={`text-center font-bold text-xl ${courseData.isPaidCourse ? "text-orange-600" : "text-green-700"}`}>
                        {courseData.isPaidCourse ? courseData.price.toLocaleString('vi-VN') + "đ" : "Miễn Phí"}
                    </p>
                    <Button
                        type="primary"
                        size='large'
                        onClick={courseData?.data.enroll == false ? handleEnroll : () => navigate(`/learning/${tutorialId}`)}
                        className='bg-gradient-to-r
                    w-[60%] mt-5
                    from-blue-500 to-cyan-400 text-white 
                    font-medium rounded-full py-3 px-6 transition-transform duration-800
                     hover:from-cyan-400 hover:to-blue-500 hover:scale-105 hover:shadow-cyan-200 hover:shadow-lg'
                    >
                        {user?.packageStatus != 'ACTIVE' ? "Mua ngay" : courseData?.data.enroll == false ? "Tham gia khóa học" : "Học ngay"}
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
