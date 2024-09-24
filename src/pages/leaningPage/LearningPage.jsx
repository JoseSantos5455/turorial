import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import ReactPlayer from 'react-player';
import checkIcon from './../../assets/image/check.svg'
import activeIcon from './../../assets/image/active.svg'
import takenote from './../../assets/image/note.svg'
import { useGetCourseDetailQuery, useGetLearningProgressQuery, useSavingNewProgressMutation } from '../../services/coursesAPI';
import { Breadcrumb, Image, message, Skeleton, Collapse, ConfigProvider } from 'antd';
import { CaretRightOutlined, LeftOutlined } from '@ant-design/icons';
import './learning.scss'
import { throttle } from 'lodash';
import QuestionDisplay from './Quizz';
import { handleDisplayTime, handleDisplayTypeVideo } from '../../utils/utils';
import TakeNote from './TakeNote';
import InforLesson from './InforLesson';



const LearningPage = () => {
    const { courseId } = useParams();
    const [currentVideo, setCurrentVideo] = useState(null);
    const [currentQuiz, setCurrentQuiz] = useState(null);
    const [playing, setPlaying] = useState(false);
    const [playedSeconds, setPlayedSeconds] = useState(0);
    const playerRef = useRef(null);
    const [progress, setProgress] = useState([]);
    const { data: courseDetail, isLoading: isCourseLoading, error: courseError } = useGetCourseDetailQuery(courseId);
    const { data: progressData, isLoading: isProgressLoading, error: progressError } = useGetLearningProgressQuery({ courseId, userId: "user_001" });
    const [saveLearningProgress] = useSavingNewProgressMutation();
    const progressSavedRef = useRef(false);
    const [currentInfo, setCurrentInfo] = useState(null);
    const [takeNote, setTakeNote] = useState(false);
    useEffect(() => {
        if (progressData?.progress) {
            setProgress(progressData.progress);
        }
    }, [progressData]);



    // update tiến độ
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





    const updateChapterProgress = useCallback((currentVideoId, newPlayedSeconds, isCompleted) => {
        const chapterProgress = progress.find(chapter =>
            chapter.videos && chapter.videos.some(video => video.videoId === currentVideoId)
        );

        if (chapterProgress) {
            const newProgress = progress.map(chapter =>
                chapter.chapterId === chapterProgress.chapterId
                    ? {
                        ...chapter,
                        videos: chapter.videos.map(video =>
                            video.videoId === currentVideoId
                                ? { ...video, watchedDuration: newPlayedSeconds, isCompleted: isCompleted || video.duration <= newPlayedSeconds }
                                : video
                        ),
                        isChapterCompleted: chapter.videos.every(video => video.isCompleted) &&
                            chapter.quizz.every(quiz => quiz.isCompleted) &&
                            chapter.information.every(info => info.isViewed)
                    }
                    : chapter
            );

            updateProgress(newProgress);
        }
    }, [progress, updateProgress]);





    const handleProgress = useCallback(throttle((state) => {
        setPlayedSeconds(state.playedSeconds);

        if (Math.floor(state.playedSeconds) % 20 === 0 && currentVideo) {
            updateChapterProgress(currentVideo.videoId, state.playedSeconds, false);
        }
    }, 20000), [currentVideo, updateChapterProgress]);






    useEffect(() => {
        if (currentVideo && playedSeconds / currentVideo.duration > 0.8) {
            updateChapterProgress(currentVideo.videoId, playedSeconds, true);
            progressSavedRef.current = true;
        }

        // Reset lại ref khi video thay đổi
        return () => {
            progressSavedRef.current = false;
        };
    }, [playedSeconds, currentVideo, updateChapterProgress]);





    // Đặt video hiện tại

    const handleSetVideo = useCallback((lesson, index) => {
        const chapterProgress = progress.find(chapter =>
            chapter.videos.some(v => v.videoId === lesson.videoId)
        );
        const watchedDuration = chapterProgress?.videos.find(v => v.videoId === lesson.videoId)?.watchedDuration || 0;

        if (lesson.type === 'video') {
            setCurrentVideo(lesson);
            setCurrentQuiz(null); // Reset bài kiểm tra hiện tại
            setPlayedSeconds(watchedDuration);
            setPlaying(true);
            playerRef.current?.seekTo(watchedDuration, 'seconds');
        } else if (lesson.type === 'quiz') {
            setCurrentQuiz(lesson);
            setCurrentVideo(null); // Reset video hiện tại
            setPlaying(false);
        } else if (lesson.type === 'information') {
            setCurrentInfo(lesson);
            setCurrentVideo(null); // Reset video hiện tại
            setCurrentQuiz(null); // Reset bài kiểm tra hiện tại
            setPlaying(false);
        }
    }, [progress]);





    const handlePlayerReady = () => {
        if (playerRef.current) {
            const chapterProgress = progress.find(chapter => chapter.videos.some(v => v.videoId === currentVideo.videoId));
            const watchedDuration = chapterProgress?.videos.find(v => v.videoId === currentVideo.videoId)?.watchedDuration || 0;
            playerRef.current.seekTo(watchedDuration, 'seconds');
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
                    const flatVideos = courseDetail.videoContent.flatMap(chapter =>
                        chapter.lessons.filter(item => item.type === 'video') // Filter for videos only
                    );
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
                    const completedVideosInFirstChapter = firstChapter.lessons.filter(lesson =>
                        lesson.type === 'video' &&
                        progress.some(chapter => chapter.chapterId === firstChapter.chapterId && chapter.videos.some(v => v.videoId === lesson.videoId && v.isCompleted))
                    );

                    if (completedVideosInFirstChapter.length > 0) {
                        const lastCompletedVideoInFirstChapter = completedVideosInFirstChapter[completedVideosInFirstChapter.length - 1];
                        const flatVideos = firstChapter.lessons.filter(lesson => lesson.type === 'video');
                        const lastVideoIndex = flatVideos.findIndex(video => video.videoId === lastCompletedVideoInFirstChapter.videoId) + 1;

                        // Set video tiếp theo là video hoàn thành cuối cùng + 1
                        if (lastVideoIndex < flatVideos.length) {
                            nextVideo = flatVideos[lastVideoIndex];
                        }
                    }
                }

                // Nếu không có video tiếp theo, chọn video đầu tiên của chương đầu tiên
                if (!nextVideo) {
                    const firstVideo = courseDetail.videoContent[0].lessons.find(lesson => lesson.type === 'video');
                    nextVideo = firstVideo;
                }

                // Cập nhật video hiện tại và trạng thái trình phát
                setCurrentVideo(nextVideo);
                setPlayedSeconds(0);
                setPlaying(true);
            } else if (courseDetail) {
                // Nếu không có tiến độ, chọn video đầu tiên của khóa học
                const firstVideo = courseDetail.videoContent.flatMap(chapter => chapter.lessons).find(lesson => lesson.type === 'video');
                setCurrentVideo(firstVideo);
                setPlayedSeconds(0);
                setPlaying(true);
            }
        }
        if (progress && courseDetail) {
            findNextVideo();
        }
    }, [courseDetail]);


    const handleSettakeNote = () => {
        setTakeNote(false)
    }

    if (isCourseLoading || isProgressLoading) {
        return <Skeleton active />; // Or any custom loader
    }



    if (courseError) return <div>Error: {courseError.message}</div>;
    if (progressError) return <div>Error: {progressError.message}</div>;
    //   if (isSavingProgress) return <div>Saving progress...</div>;
    //   if (saveError) return <div>Error saving progress: {saveError.message}</div>;





    return (
        <div className={`grid gap-4 px-6 ${takeNote ? "grid-cols-8" : "grid-cols-3"}`}>
            {/* Bên trái: Video Player hoặc Bài kiểm tra */}
            <div className={` relative ${takeNote ? "col-span-5" : "col-span-2"}`}>
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
                            onProgress={handleProgress}
                            width="100%"
                            height="60vh"
                        />
                        <button
                            onClick={() => setTakeNote(!takeNote)}
                            className='flex items-center absolute top-12 right-10 bg-slate-100 px-3 py-2 rounded-xl shadow-lg hover:shadow-lg hover:shadow-cyan-300'>
                            <Image width={30} preview={false} className='mr-3' src={takenote} />
                            <span className='ml-4 font-bold'>+ Take note </span>
                        </button>
                    </>
                ) : currentQuiz ? (
                    <QuestionDisplay quizz={currentQuiz} />
                ) : currentInfo ? (
                    <InforLesson currentInfo={currentInfo} />
                ) : (
                    <div>Chọn một video hoặc bài kiểm tra để xem</div>
                )}

                {/* Thông tin bổ sung */}
                {/* <div className="mt-6 bg-gray-100 p-4 rounded">
                    <h3 className="font-bold text-xl">Thông tin thêm</h3>
                    <p>{courseDetail?.moreInfomation}</p>

        
                    <div className="mt-4">
                        <h4 className="font-bold">Tài liệu hỗ trợ</h4>
                        {courseDetail?.supportingMaterials.map((material, index) => (
                            <a key={index} href={material.file} className="block text-blue-500">
                                {material.type}
                            </a>
                        ))}
                    </div>
                </div> */}
            </div>

            {/* Bên phải: Danh sách Chương và Video */}
            {takeNote ? (
                <div className="col-span-3 mt-16 h-full">
                    <TakeNote
                        video={currentVideo}
                        setTakeNote={handleSettakeNote}
                    />
                </div>
            ) : (
                <div className={`mt-16 ${takeNote ? "col-span-3" : "col-span-1"}`}>
                    <p className='font-bold text-xl mb-6'>Nội dung khóa học</p>
                    {courseDetail?.videoContent.map((chapter, chapterIndex) => {
                        const chapterId = chapter.chapterId;
                        const currentChapterProgress = progress.find((ch) => ch.chapterId === chapterId);

                        // Kiểm tra trạng thái hoàn thành của chương hiện tại
                        const isCurrentChapterCompleted = currentChapterProgress?.isChapterCompleted;

                        // Kiểm tra xem có phải là chương hiện tại
                        const isCurrentChapter = chapterIndex === progress.findIndex(ch => ch.chapterId === chapterId);

                        // Kiểm tra chương trước đã hoàn thành
                        const isPreviousChapterCompleted = chapterIndex === 0 || progress[chapterIndex - 1]?.isChapterCompleted;

                        // Điều kiện cho phép mở chương
                        const isLessonEnabled = (chapterIndex === 0) || (isPreviousChapterCompleted && !isCurrentChapterCompleted);

                        return (
                            <div key={chapterIndex} className="mb-2">
                                <ConfigProvider
                                    theme={{
                                        components: {
                                            Collapse: {},
                                        },
                                    }}
                                >
                                    <Collapse
                                        expandIcon={({ isActive }) => <CaretRightOutlined style={{ color: 'white' }} rotate={isActive ? 90 : 0} />}
                                    >
                                        <Collapse.Panel
                                            header={
                                                <div style={{ display: 'flex', alignItems: 'center' }}>

                                                    <p style={{ color: 'white', fontWeight: 'bold', fontSize: '16px' }}>

                                                        {`Chương ${chapterIndex + 1}: ${chapter.chapterName}`}

                                                        {chapter.lessons.some(lesson =>

                                                            (lesson.videoId === currentVideo?.videoId && currentVideo?.type === 'video') ||
                                                            (lesson.quizId === currentQuiz?.quizId && currentQuiz?.type === 'quiz') ||
                                                            (lesson.infoId === currentInfo?.infoId && currentInfo?.type === 'information')

                                                        ) && (

                                                                <Image preview={false} width={15} src={activeIcon} alt="Current" className="inline ml-5 mb-1 animated-icon" />

                                                            )}

                                                    </p>

                                                </div>
                                            }
                                            key={chapterIndex}
                                        >
                                            <ul>
                                                {chapter.lessons.map((lesson, index) => {
                                                    const isLessonCompleted =
                                                        lesson.type === 'video'
                                                            ? currentChapterProgress?.videos.find(video => video.videoId === lesson.videoId)?.isCompleted
                                                            : lesson.type === 'quiz'
                                                                ? currentChapterProgress?.quizz.find(quiz => quiz.quizId === lesson.quizId)?.isCompleted
                                                                : lesson.type === 'information'
                                                                    ? currentChapterProgress?.information.find(info => info.infoId === lesson.infoId)?.isViewed
                                                                    : false;


                                                    const isCurrentLesson =

                                                        (lesson.videoId === currentVideo?.videoId && currentVideo?.type === 'video') ||
                                                        (lesson.quizId === currentQuiz?.quizId && currentQuiz?.type === 'quiz') ||
                                                        (lesson.infoId === currentInfo?.infoId && currentInfo?.type === 'information');

                                                    const lessonClass = isLessonEnabled ? 'text-black' : 'text-gray-400'; // Màu đen cho bài học hiện tại, xám cho bài học không được mở
                                                    const fontWeightClass = isCurrentLesson ? 'font-bold' : '';
                                                    return (
                                                        <li key={lesson.videoId || lesson.quizId || lesson.infoId} className="mt-2 ml-3">
                                                            <button
                                                                disabled={!isLessonEnabled}
                                                                onClick={() => handleSetVideo(lesson, index)}
                                                                className={`text-left w-full ${lessonClass} ${fontWeightClass}`}
                                                            >
                                                                <div className="text-[15px] justify-between flex">
                                                                    <div className='flex  items-center  gap-2'>
                                                                        <p className='mt-[3px]'>{handleDisplayTypeVideo[lesson.type]} </p>
                                                                        <p>{`Bài ${chapterIndex * chapter.lessons.length + index + 1} ${lesson.videoName || lesson.quizName || lesson.infoTitle}`}</p>
                                                                        {isLessonCompleted && (
                                                                            <Image
                                                                                preview={false}
                                                                                width={15}
                                                                                src={checkIcon}
                                                                                alt="Completed"
                                                                                className="block ml-2 "
                                                                            />
                                                                        )}
                                                                    </div>
                                                                    <p>{lesson.duration ? handleDisplayTime(lesson.duration) : ''}</p>
                                                                </div>

                                                            </button>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        </Collapse.Panel>
                                    </Collapse>
                                </ConfigProvider>
                            </div>
                        );
                    })}

                </div>
            )}
        </div>

    );
};

export default LearningPage;
