
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import ReactPlayer from 'react-player';
import checkIcon from './../../assets/image/check.svg'
import activeIcon from './../../assets/image/active.svg'
import takenote from './../../assets/image/note.svg'
import { useGetCourseDetailQuery, useGetLearningProgressQuery, useSavingNewProgressMutation } from '../../services/coursesAPI';
// import { useGetCourseDetailTestQuery, useGetLearningProgressTestQuery, useSavingNewProgressTestMutation } from '../../services/coursesAPI';
import { Breadcrumb, Image, message, Skeleton, Collapse, ConfigProvider } from 'antd';
import { CaretRightOutlined, LeftOutlined } from '@ant-design/icons';
import './learning.scss'
import { throttle } from 'lodash';
import QuestionDisplay from './Quizz';
import { handleDisplayTime, handleDisplayTypeVideo } from '../../utils/utils';
import TakeNote from './TakeNote';
import InforLesson from './InforLesson';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../slices/auth.slice';





const LearningPage = () => {
    const { courseId } = useParams();
    const [currentVideo, setCurrentVideo] = useState(null);
    const [currentQuiz, setCurrentQuiz] = useState(null);
    const [playing, setPlaying] = useState(false);
    const [playedSeconds, setPlayedSeconds] = useState(0);
    const playerRef = useRef(null);
    const [progress, setProgress] = useState([]);
    const progressSavedRef = useRef(false);
    const [currentInfo, setCurrentInfo] = useState(null);
    const [takeNote, setTakeNote] = useState(false);
    const [chapterId, setChapterId] = useState(null);
    const [isQuizStart, setIsQuizStart] = useState(false);
    const user = useSelector(selectCurrentUser)
    const userId = user?.id;
    const { data: courseDetail, isLoading: isCourseLoading, error: courseError, refetch: refetchDetail } = useGetCourseDetailQuery({ courseId: courseId });
    const { data: progressData, isLoading: isProgressLoading, error: progressError, refetch: refetchProgress } = useGetLearningProgressQuery({ courseId, userId });
    const [saveLearningProgress] = useSavingNewProgressMutation();

    // console.log(courseDetail)
    // console.log(progressData)


    useEffect(() => {
        if (progressData) {
            setProgress(progressData);
            console.log(progress)
        }
    }, [progressData]);

    // update tiến độ
    const updateProgress = useCallback(async (newProgress) => {
        console.log(newProgress)
        try {
            await saveLearningProgress({
                userId: userId,
                chapterId: courseId,
                body: newProgress,
                dateUpdated: new Date().toISOString(),
            }).unwrap();

            refetchProgress();

        } catch (error) {
            console.error('Error saving progress', error);
        }
    }, [ saveLearningProgress]);





    const updateChapterProgress = useCallback(async (currentVideoId, newPlayedSeconds, isCompleted) => {
        const chapterProgress = progress.find(chapter =>
            chapter.videoProgresses && chapter.videoProgresses.some(video => video.videoId === currentVideoId)
        );

        if (chapterProgress) {
            const updatedChapter = {
                ...chapterProgress,
                videoProgresses: chapterProgress.videoProgresses.map(video => {
                    const isVideoCompleted = video.completed;
                    return video.videoId === currentVideoId
                        ? { ...video, watchedDuration: newPlayedSeconds, completed: isCompleted || video.duration <= newPlayedSeconds && !isVideoCompleted }
                        : video;
                }),
                chapterCompleted: chapterProgress.videoProgresses.every(video => video.completed) &&
                    chapterProgress.quizProgresses.every(quiz => quiz.completed) &&
                    chapterProgress.infoProgresses.every(info => info.viewed)
            };

            await updateProgress(updatedChapter);
        }
    }, [progress, updateProgress]);



    // 20s luu tien do

    const lastUpdateTimeRef = useRef(0);

    const handleProgress = useCallback((state) => {
        const currentTime = state.playedSeconds;
        const currentTimeStamp = Date.now();
        // Check if 20 seconds have passed since the last update
        if (currentTimeStamp - lastUpdateTimeRef.current > 20000) {
            setPlayedSeconds(currentTime);

            if (currentVideo) {
                console.log("da goi lai ")
                updateChapterProgress(currentVideo.videoId, currentTime, false);
            }

            // Update the last update time
            lastUpdateTimeRef.current = currentTimeStamp;
        }
    }, [currentVideo, updateChapterProgress]);




    // >80% tien do cua video thi bai hoc da dc hoc 

    useEffect(() => {
        if (currentVideo && playedSeconds / currentVideo.duration >= 0.8) {
            updateChapterProgress(currentVideo.videoId, playedSeconds, true);
            progressSavedRef.current = true;
        }

        // Reset lại ref khi video thay đổi
        return () => {
            progressSavedRef.current = false;
        };
    }, [playedSeconds, currentVideo, updateChapterProgress]);


    const handlePanelClick = (chapterIndex) => {
        setChapterId(chapterIndex);
    };

    const filterProgressDataByChapterId = (progressData, chapterId) => {
        return progressData?.filter(progress => progress.chapterId === chapterId);
    };
    const dataChapter = filterProgressDataByChapterId(progressData, chapterId);



    // Đặt video hiện tại

    const handleSetVideo = useCallback((lesson, index, chapter) => {
        // Kiểm tra xem progress có phải là một mảng hay không
        if (!Array.isArray(progress)) {
            console.error("Progress is not an array", progress);
            return;
        }

        let watchedDuration = 0;


        if (lesson.type === 'video') {
            const chapterProgress = progress.find(chapter =>
                chapter.videoProgresses.some(v => v.videoId === lesson.videoId)
            );
            watchedDuration = chapterProgress?.videoProgresses.find(v => v.videoId === lesson.videoId)?.watchedDuration || 0;
            setCurrentVideo(lesson);
            setCurrentQuiz(null);
            setCurrentInfo(null);
            setPlayedSeconds(watchedDuration);
            playerRef.current.seekTo(watchedDuration, 'seconds');

        } else if (lesson.type === 'quiz') {
            handlePanelClick(chapter?.id)
            setCurrentQuiz(lesson);
            setCurrentInfo(null);
            setCurrentVideo(null);
            setCurrentInfo(null);

        } else if (lesson.type === 'info') {
            handlePanelClick(chapter?.id)
            setCurrentInfo(lesson);
            setCurrentVideo(null);
            setCurrentQuiz(null);
        }

    }, [progress]);


    const handlePlayerReady = () => {
        if (!Array.isArray(progress)) {
            console.error("Progress is not an array", progress);
            return;
        }

        if (playerRef.current && currentVideo) {
            const chapterProgress = progress.find(chapter =>
                chapter.videoProgresses.some(v => v.videoId === currentVideo.videoId)
            );
            const watchedDuration = chapterProgress?.videoProgresses.find(v => v.videoId === currentVideo.videoId)?.watchedDuration || 0;
            playerRef.current.seekTo(watchedDuration, 'seconds');
        }
    };



    useEffect(() => {
        const findNextLesson = () => {
            if (progress.length > 0 && courseDetail) {
                // Find the last completed chapter
                const completedChapters = progress.filter(chapter => chapter.chapterCompleted);
                const lastCompletedChapter = completedChapters[completedChapters.length - 1];

                let nextLesson = null;

                console.log(lastCompletedChapter)
                if (lastCompletedChapter) {
                    // Flatten and sort all lessons by 'stt'
                    const flatLessons = courseDetail?.data?.chapters?.flatMap(chapter =>
                        chapter.lesson.flatMap(lesson => [
                            ...lesson.videos.map(video => ({ ...video, type: 'video' })),
                            ...lesson.quizs.map(quiz => ({ ...quiz, type: 'quiz' })),
                            ...lesson.infos.map(info => ({ ...info, type: 'info' }))
                        ])
                    ).sort((a, b) => a.stt - b.stt);

                    // Find the last completed lesson
                    const lastCompletedLesson = flatLessons.find(lesson => {
                        if (lesson.type === 'video') {
                            return lastCompletedChapter.videoProgresses.some(video => video.videoId === lesson.videoId && video.completed);
                        } else if (lesson.type === 'quiz') {
                            return lastCompletedChapter.quizProgresses.some(quiz => quiz.quizId === lesson.id && quiz.completed);
                        } else if (lesson.type === 'info') {
                            return lastCompletedChapter.infoProgresses.some(info => info.infoId === lesson.infoId && info.viewed);
                        }
                        return false;
                    });

                    const lastLessonIndex = flatLessons.findIndex(lesson => lesson === lastCompletedLesson);

                    // Find the next lesson
                    const nextLessonIndex = lastLessonIndex + 1;
                    if (nextLessonIndex < flatLessons.length) {
                        nextLesson = flatLessons[nextLessonIndex];
                    }
                }

                // If no next lesson, select the first lesson
                if (!nextLesson) {
                    const firstChapter = courseDetail?.data?.chapters[0];
                    const flatLessons = firstChapter.lesson.flatMap(lesson => [
                        ...lesson.videos.map(video => ({ ...video, type: 'video' })),
                        ...lesson.quizs.map(quiz => ({ ...quiz, type: 'quiz' })),
                        ...lesson.infos.map(info => ({ ...info, type: 'info' }))
                    ]).sort((a, b) => a.stt - b.stt);
                    nextLesson = flatLessons[0];
                }

                // Update the current lesson and player state
                if (nextLesson.type === 'video') {
                    setCurrentVideo(nextLesson);
                    setCurrentQuiz(null);
                    setCurrentInfo(null);
                    setPlaying(true);
                } else if (nextLesson.type === 'quiz') {
                    setCurrentQuiz(nextLesson);
                    setCurrentVideo(null);
                    setCurrentInfo(null);
                    setPlaying(false);
                } else if (nextLesson.type === 'info') {
                    setCurrentInfo(nextLesson);
                    setCurrentVideo(null);
                    setCurrentQuiz(null);
                    setPlaying(false);
                }
            } else if (courseDetail) {
                // If no progress, select the first lesson of the course
                const firstLesson = courseDetail?.data.chapters?.flatMap(chapter =>
                    chapter.lesson.flatMap(lesson => [
                        ...lesson.videos.map(video => ({ ...video, type: 'video' })),
                        ...lesson.quizs.map(quiz => ({ ...quiz, type: 'quiz' })),
                        ...lesson.infos.map(info => ({ ...info, type: 'info' }))
                    ])
                ).sort((a, b) => a.stt - b.stt)[0];

                if (firstLesson.type === 'video') {
                    setCurrentVideo(firstLesson);
                    setCurrentQuiz(null);
                    setCurrentInfo(null);
                    setPlayedSeconds(0);
                    setPlaying(true);
                } else if (firstLesson.type === 'quiz') {
                    setCurrentQuiz(firstLesson);
                    setCurrentVideo(null);
                    setCurrentInfo(null);
                    setPlaying(false);
                } else if (firstLesson.type === 'info') {
                    setCurrentInfo(firstLesson);
                    setCurrentVideo(null);
                    setCurrentQuiz(null);

                }
            }
        };

        if (progress && courseDetail) {
            findNextLesson();
        }
    }, [courseDetail, progress]);


    const handleSettakeNote = () => {
        setTakeNote(false)
    }




    if (isCourseLoading || isProgressLoading) {
        return <Skeleton active />;
    }
    if (!progress || !courseDetail) {
        return <div className='h-[100vh]'>
            <Skeleton active style={{ height: '100vh' }} />
        </div>;
    }
    if (courseError) return <div>Error: {courseError.message}</div>;
    if (progressError) return <div>Error: {progressError.message}</div>;






    return (
        <div className={`grid gap-4 px-6 ${takeNote ? "grid-cols-8" : "grid-cols-3"}`}>
            {/* Bên trái: Video Player hoặc Bài kiểm tra */}
            <div className={` relative ${takeNote ? "col-span-5" : isQuizStart ? "col-span-3" : "col-span-2"}`}>
                <Breadcrumb
                    className='mt-[-10px] py-3 mb-5'
                >
                    <Breadcrumb.Item><Link to={'/'}><LeftOutlined /> Trang chủ</Link></Breadcrumb.Item>
                    <Breadcrumb.Item className='text-cyan-500'>{courseDetail?.data.courseName}</Breadcrumb.Item>

                </Breadcrumb>
                {currentVideo ? (
                    <>
                        <p className="font-bold text-3xl mb-7">{currentVideo.videoName}</p> {/* Display video name */}
                        <ReactPlayer
                            onReady={handlePlayerReady}
                            ref={playerRef}
                            url={currentVideo.lessonVideo}
                            controls={true}
                            onProgress={handleProgress}
                            width="100%"
                            height="60vh"
                        />
                        <button
                            onClick={() => setTakeNote(!takeNote)}
                            className='flex items-center absolute top-12 right-10 bg-slate-100 px-3 py-2 rounded-xl shadow-lg hover:shadow-lg hover:shadow-cyan-300'>
                            <Image width={30} preview={false} className='mr-3' src={takenote} />
                            <span className='ml-4 font-bold'>+ Thêm ghi chú </span>
                        </button>
                    </>
                ) : currentQuiz ? (
                    <QuestionDisplay data={dataChapter} chapterId={chapterId} quizz={currentQuiz} setIsQuizStart={setIsQuizStart} refetchProgress={refetchProgress}/>
                ) : currentInfo ? (
                    <InforLesson data={dataChapter} chapterId={chapterId} currentInfo={currentInfo} refetchProgress={refetchProgress}/>
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
                        userId={user.id}
                    />
                </div>
            ) : (
                !isQuizStart ? (
                    <div className={`mt-16 ${takeNote ? "col-span-3" : isQuizStart ? "col-span-0" : "col-span-1"}`}>
                        <p className='font-bold text-xl mb-6'>Nội dung khóa học</p>
                        {courseDetail?.data?.chapters.map((chapter, chapterIndex) => {
                            const chapterId = chapter?.id;
                            const currentChapterProgress = Array.isArray(progress) ? progress.find((ch) => ch.chapterId === chapterId) : null;

                            // Flatten and sort lessons by 'stt'
                            const sortedLessons = [
                                ...chapter.lesson?.flatMap(lesson => lesson.videos.map(video => ({ ...video, type: 'video', lessonId: lesson.lessonId }))),
                                ...chapter.lesson?.flatMap(lesson => lesson.quizs.map(quiz => ({ ...quiz, type: 'quiz', lessonId: lesson.lessonId }))),
                                ...chapter.lesson?.flatMap(lesson => lesson.infos.map(info => ({ ...info, type: 'info', lessonId: lesson.lessonId })))
                            ].sort((a, b) => a.stt - b.stt);

                            // Kiểm tra trạng thái hoàn thành của chương hiện tại
                            const isCurrentChapterCompleted = currentChapterProgress?.chapterCompleted;

                            // Kiểm tra xem có phải là chương hiện tại
                            // const isCurrentChapter = chapterIndex === progress.findIndex(ch => ch.chapterId === chapterId);

                            // Kiểm tra chương trước đã hoàn thành
                            const isPreviousChapterCompleted = chapterIndex === 0 || progress[chapterIndex - 1]?.chapterCompleted;   // loi o day 

                            // Điều kiện cho phép m chương
                            const isLessonEnabled = (chapterIndex === 0) || (isPreviousChapterCompleted && !isCurrentChapterCompleted); // loi o day 

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
                                                            {`Chương ${chapter.stt}: ${chapter.chapterName}`}

                                                            {chapter.lesson.some(lesson =>

                                                                (lesson.videoId === currentVideo?.videoId && currentVideo?.type === 'video') ||
                                                                (lesson.quizId === currentQuiz?.quizId && currentQuiz?.type === 'quiz') ||
                                                                (lesson.infoId === currentInfo?.infoId && currentInfo?.type === 'info')

                                                            ) && (

                                                                    <Image preview={false} width={15} src={activeIcon} alt="Current" className="inline ml-5 mb-1 animated-icon" />

                                                                )}

                                                        </p>
                                                    </div>
                                                }
                                                key={chapterIndex}
                                            >
                                                <ul>
                                                    {sortedLessons.map((lesson, index) => {
                                                        const isLessonCompleted =
                                                            lesson.type === 'video'
                                                                ? currentChapterProgress?.videoProgresses.find(video => video.videoId === lesson.videoId)?.completed
                                                                : lesson.type === 'quiz'
                                                                    ? currentChapterProgress?.quizProgresses.find(quiz => quiz.quizId === lesson.id)?.completed
                                                                    : lesson.type === 'info'
                                                                        ? currentChapterProgress?.infoProgresses.find(info => info.infoId === lesson.infoId)?.viewed
                                                                        : false;

                                                        const isCurrentLesson =
                                                            (lesson.type === 'video' && lesson.videoId === currentVideo?.videoId) ||
                                                            (lesson.type === 'quiz' && lesson.id === currentQuiz?.quizId) ||
                                                            (lesson.type === 'info' && lesson.infoId === currentInfo?.infoId);

                                                        const lessonClass = isLessonEnabled ? 'text-black' : 'text-gray-400';
                                                        const fontWeightClass = isCurrentLesson ? 'font-bold' : '';

                                                        return (
                                                            <li key={`${lesson.type}-${lesson.lessonId}`} className="mt-2 ml-3">
                                                                <button
                                                                    disabled={!isLessonEnabled}
                                                                    onClick={() => handleSetVideo(lesson, index, chapter)}
                                                                    className={`text-left w-full ${lessonClass} ${fontWeightClass}`}
                                                                >
                                                                    <div className="text-[15px] justify-between flex">
                                                                        <div className='flex items-center gap-2'>
                                                                            <p className='mt-[3px]'>
                                                                                {handleDisplayTypeVideo[lesson.type]}
                                                                            </p>
                                                                            <p>
                                                                                {`Bài ${chapterIndex * chapter.lesson.length + index + 1} ${lesson.type === 'video' ? lesson.videoName :
                                                                                    lesson.type === 'quiz' ? lesson.title :
                                                                                        lesson.type === 'info' ? lesson.infoTitle : ''
                                                                                    }`}
                                                                            </p>
                                                                            {isLessonCompleted && (
                                                                                
                                                                                <Image
                                                                                    preview={false}
                                                                                    width={15}
                                                                                    src={checkIcon}
                                                                                    alt="Completed"
                                                                                    className="block ml-2"
                                                                                />
                                                                            )}
                                                                        </div>
                                                                        <p>
                                                                            {lesson.type === 'video' ? handleDisplayTime(lesson.duration) : ''}
                                                                        </p>
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
                ) : null
            )}
        </div>

    );
};

export default LearningPage;

