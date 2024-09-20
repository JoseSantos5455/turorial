import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import ReactPlayer from 'react-player';
import checkIcon from './../../assets/image/check.svg'
import activeIcon from './../../assets/image/active.svg'
import { useGetCourseDetailQuery, useGetLearningProgressQuery, useSavingNewProgressMutation } from '../../services/coursesAPI';
import { Breadcrumb, Image, message, Skeleton, Collapse, ConfigProvider } from 'antd';
import { CaretRightOutlined, LeftOutlined } from '@ant-design/icons';
import './learning.scss'
const LearningPage = () => {
    const { courseId } = useParams();
    const [currentVideo, setCurrentVideo] = useState(null);
    const [playing, setPlaying] = useState(false);
    const [playedSeconds, setPlayedSeconds] = useState(0);
    const [unlockedLessons, setUnlockedLessons] = useState([0]);
    const playerRef = useRef(null);
    const [progress, setProgress] = useState([]);
    const { data: courseDetail, isLoading: isCourseLoading, error: courseError } = useGetCourseDetailQuery(courseId);
    const { data: progressData, isLoading: isProgressLoading, error: progressError } = useGetLearningProgressQuery({ courseId, userId: "user_001" });
    const [saveLearningProgress] = useSavingNewProgressMutation();

    useEffect(() => {
        if (progressData?.progress) {
            setProgress(progressData.progress);
        }
    }, [progressData]);

    // update tiến đ
    const updateProgress = useCallback(async (newProgress) => {
        try {
            await saveLearningProgress({
                userId: progressData.userId,
                courseId: progressData.courseId,
                progress: newProgress,
                dateUpdated: new Date().toISOString(),
            });
            setProgress(newProgress);
        } catch (error) {
            console.error('Error saving progress', error);
        }
    }, [progressData, saveLearningProgress]);

    // Quản lý sự kiện khi xem video
    const handleProgress = useCallback((state) => {
        setPlayedSeconds(state.playedSeconds);

        if (Math.floor(state.playedSeconds) % 20 === 0 && currentVideo) {
            const chapterProgress = progress.find(chapter =>
                chapter.videos.some(video => video.videoId === currentVideo.videoId)
            );

            if (chapterProgress) {
                const newProgress = progress.map(chapter =>
                    chapter.chapterId === chapterProgress.chapterId
                        ? {
                            ...chapter,
                            videos: chapter.videos.map(video =>
                                video.videoId === currentVideo.videoId
                                    ? { ...video, watchedDuration: state.playedSeconds }
                                    : video
                            )
                        }
                        : chapter
                );
                updateProgress(newProgress);
            }
        }
    }, [currentVideo, progress, updateProgress]);

    // Xử lý việc cấm tua nhanh
    // const handleSeek = (seconds) => {
    //     console.log(seconds)
    //     if (playerRef.current) {
    //         // Chỉ cho phép tua đến thời gian đã phát
    //         playerRef.current.seekTo(Math.min(seconds, playedSeconds));
    //     } else {
    //         console.error("Player reference is not set.");
    //     }
    // };


    // Khi xem xong 80% thời lượng video, mở khóa bài tiếp theo
    useEffect(() => {
        if (currentVideo && playedSeconds / currentVideo.duration > 0.8) {
            const chapterProgress = progress.find(chapter => chapter.videos.some(video => video.videoId === currentVideo.videoId));
            // Kiểm tra nếu video hiện tại là video cuối cùng của chương
            const isLastVideoInChapter = chapterProgress.videos[chapterProgress.videos.length - 1].videoId === currentVideo.videoId;


            const newProgress = progress.map(chapter => {
                if (chapter.chapterId === chapterProgress.chapterId) {
                    return {
                        ...chapter,
                        videos: chapter.videos.map(video =>
                            video.videoId === currentVideo.videoId
                                ? { ...video, watchedDuration: playedSeconds, isCompleted: true }
                                : video
                        ),
                        isChapterCompleted: isLastVideoInChapter // Đánh dấu chương hoàn thành
                    };
                }
                return chapter;
            });

            updateProgress(newProgress)
        }

    }, [playedSeconds, currentVideo, courseDetail, unlockedLessons, progress]);

    // Đặt video hiện tại

    const handleSetVideo = useCallback((video, index) => {
        const chapterProgress = progress.find(chapter =>
            chapter.videos.some(v => v.videoId === video.videoId)
        );
        const watchedDuration = chapterProgress?.videos.find(v => v.videoId === video.videoId)?.watchedDuration || 0;
        setCurrentVideo(video);
        setPlayedSeconds(watchedDuration);
        setPlaying(true);
        playerRef.current?.seekTo(watchedDuration, 'seconds');
    }, [progress]);


    const handlePlayerReady = () => {
        if (playerRef.current) {
            const chapterProgress = progress.find(chapter => chapter.videos.some(v => v.videoId === currentVideo.videoId));
            const watchedDuration = chapterProgress?.videos.find(v => v.videoId === currentVideo.videoId)?.watchedDuration || 0; // Lấy watchedDuration
            playerRef.current.seekTo(watchedDuration, 'seconds'); // Đặt video để phát từ watchedDuration
        }
    };

    useEffect(() => {
        const findNextVideo = () => {
            if (progress.length > 0 && courseDetail) {
                // Tìm chương đã hoàn thành cuối cùng
                const completedChapters = progress.filter(chapter => chapter.isChapterCompleted);
                const lastCompletedChapter = completedChapters[completedChapters.length - 1]; // Chương hoàn thành cuối cùng

                let nextVideo = null;

                if (lastCompletedChapter) {
                    // Tìm video cuối cùng trong chương hoàn thành gần nhất
                    const lastCompletedVideo = lastCompletedChapter.videos[lastCompletedChapter.videos.length - 1];
                    const flatVideos = courseDetail.videoContent.flatMap(chapter => chapter.videos);
                    const lastVideoIndex = flatVideos.findIndex(video => video.videoId === lastCompletedVideo.videoId);

                    // Tìm video tiếp theo
                    const nextVideoIndex = lastVideoIndex + 1;
                    if (nextVideoIndex < flatVideos.length) {
                        nextVideo = flatVideos[nextVideoIndex];
                    }
                }

                // Nếu không có video tiếp theo, chọn video đầu tiên
                if (!nextVideo) {
                    const firstChapter = courseDetail.videoContent[0];
                    const completedVideosInFirstChapter = firstChapter.videos.filter(video =>
                        progress.some(chapter => chapter.chapterId === firstChapter.chapterId && chapter.videos.some(v => v.videoId === video.videoId && v.isCompleted))
                    );

                    if (completedVideosInFirstChapter.length > 0) {
                        const lastCompletedVideoInFirstChapter = completedVideosInFirstChapter[completedVideosInFirstChapter.length - 1];
                        const flatVideos = firstChapter.videos;
                        const lastVideoIndex = flatVideos.findIndex(video => video.videoId === lastCompletedVideoInFirstChapter.videoId) + 1;

                        // Set video tiếp theo là video hoàn thành cuối cùng + 1
                        if (lastVideoIndex < flatVideos.length) {
                            nextVideo = flatVideos[lastVideoIndex];
                        }
                    }
                }

                // Nếu không có video tiếp theo, chọn video đầu tiên của chương đầu tiên
                if (!nextVideo) {
                    const firstVideo = courseDetail.videoContent[0].videos[0];
                    nextVideo = firstVideo;
                }

                // Cập nhật video hiện tại và trạng thái trình phát
                setCurrentVideo(nextVideo);
                setPlayedSeconds(0);
                setPlaying(true);
            } else if (courseDetail) {
                // Nếu không có tiến độ, chọn video đầu tiên của khóa học
                const firstVideo = courseDetail.videoContent.flatMap(chapter => chapter.videos)[0];
                setCurrentVideo(firstVideo);
                setPlayedSeconds(0);
                setPlaying(true);
            }
        }
        if (progress && courseDetail) { // Chỉ gọi hàm tìm video khi dữ liệu đã sẵn sàng
            findNextVideo();
        }
    },  [ courseDetail]); 

    if (isCourseLoading || isProgressLoading) {
        return <Skeleton active />; // Or any custom loader
    }

    if (courseError) return <div>Error: {courseError.message}</div>;
    if (progressError) return <div>Error: {progressError.message}</div>;
    //   if (isSavingProgress) return <div>Saving progress...</div>;
    //   if (saveError) return <div>Error saving progress: {saveError.message}</div>;

    return (
        <div className="grid grid-cols-3 gap-4 px-6">
            {/* Bên trái: Video Player */}
            <div className="col-span-2">
                <Breadcrumb
                    className='mt-[-10px] py-3 mb-5'
                >
                    <Breadcrumb.Item><Link to={'/'}><LeftOutlined /> Home</Link></Breadcrumb.Item>
                    <Breadcrumb.Item className='text-cyan-500'>{courseDetail?.name}</Breadcrumb.Item>

                </Breadcrumb>
                {currentVideo ? (
                    <>


                        <p className="font-bold text-3xl mb-7">{currentVideo.videoName}</p> {/* Display video name */}
                        <ReactPlayer
                            onReady={handlePlayerReady}
                            ref={playerRef}
                            url={currentVideo.lessonVideo}
                            playing={playing}
                            controls={true}
                            onProgress={handleProgress} // Sử dụng onProgress để xử lý việc tua
                            width="100%"
                            height="60vh"
                        />
                    </>
                ) : (
                    <div>Chọn một video để xem</div>
                )}

                {/* Thông tin bổ sung */}
                <div className="mt-6 bg-gray-100 p-4 rounded">
                    <h3 className="font-bold text-xl">Thông tin thêm</h3>
                    <p>{courseDetail?.moreInfomation}</p>

                    {/* Tài liệu hỗ trợ */}
                    <div className="mt-4">
                        <h4 className="font-bold">Tài liệu hỗ trợ</h4>
                        {courseDetail?.supportingMaterials.map((material, index) => (
                            <a key={index} href={material.file} className="block text-blue-500">
                                {material.type}
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bên phải: Danh sách Chương và Video */}
            <div className="col-span-1 mt-16">
                <p className='font-bold text-xl mb-6'>Nội dung khóa học</p>
                {courseDetail?.videoContent.map((chapter, chapterIndex) => (
                    <div key={chapterIndex} className="mb-2">
                        <ConfigProvider
                            theme={{
                                components: {
                                    Collapse: {

                                    },
                                },
                            }}
                        >
                            <Collapse
                                expandIcon={({ isActive }) => <CaretRightOutlined style={{ color: 'white' }} rotate={isActive ? 90 : 0} />}
                            >
                                <Collapse.Panel
                                    header={
                                        <div style={{ display: 'flex', alignItems: 'center' }}> {/* Added a div to center align */}
                                            <p style={{ color: 'white', fontWeight: 'bold', fontSize: '16px' }}>
                                                {`Chương ${chapterIndex + 1}: ${chapter.chapterName}`}
                                                {chapter.videos.some(video => video.videoId === currentVideo?.videoId) && (
                                                    <Image preview={false} width={15} src={activeIcon} alt="Current" className="inline ml-5 mb-1 animated-icon" />
                                                )}
                                            </p>
                                        </div>
                                    }
                                    key={chapterIndex}
                                >
                                    <ul>
                                        {chapter.videos.map((video, index) => {
                                            const totalVideos = courseDetail?.videoContent.flatMap(chapter => chapter.videos).length;
                                            const currentChapterProgress = progress.find(p => p.chapterId === chapter.chapterId);
                                            const previousChapterProgress = chapterIndex > 0 ? progress.find(p => p.chapterId === courseDetail.videoContent[chapterIndex - 1].chapterId) : null;
                                            const isPreviousVideoCompleted = index === 0
                                                ? previousChapterProgress?.videos.every(v => v.isCompleted)
                                                : currentChapterProgress?.videos[index - 1]?.isCompleted;

                                            return (
                                                <li key={video.videoId} className={`mt-2 ml-3 ${currentChapterProgress?.videos[index]?.isCompleted ? 'text-black' : 'text-gray-400'}`}>
                                                    <button
                                                        disabled={!isPreviousVideoCompleted && !currentChapterProgress?.videos[index]?.isCompleted}
                                                        onClick={() => handleSetVideo(video, index)}
                                                        className="text-left w-full"
                                                    >
                                                        <span className={`${isPreviousVideoCompleted || currentChapterProgress?.videos[index]?.isCompleted ? 'text-black' : ''} text-[15px]`}>
                                                            {`Bài ${chapterIndex * chapter.videos.length + index + 1} ${video.videoName}`}
                                                        </span>
                                                        {currentChapterProgress?.videos[index]?.isCompleted && (
                                                            <Image preview={false} width={15} src={checkIcon} alt="Completed" className="inline ml-2" />
                                                        )}
                                                    </button>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </Collapse.Panel>
                            </Collapse>
                        </ConfigProvider>

                    </div>
                ))}

            </div>
        </div>
    );
};

export default LearningPage;
