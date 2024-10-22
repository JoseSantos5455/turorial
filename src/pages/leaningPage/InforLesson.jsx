import React from 'react';
import { useGetInfoDetailsQuery, useSavingNewProgressMutation } from '../../services/coursesAPI';
import { Layout, Skeleton, Button } from 'antd';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../slices/auth.slice';

const InforLesson = ({ currentInfo, chapterId, data }) => {
    const user = useSelector(selectCurrentUser);

    // Fetch info details using the provided query
    const { data: infoDetail, isLoading: isInfoLoading, error: infoError } = useGetInfoDetailsQuery(currentInfo.infoId);
    console.log(infoDetail)
    // Initialize the mutation hook for saving progress
    const [saveLearningProgress] = useSavingNewProgressMutation();
    console.log(data)
    const handleView = async () => {
        const chapter = data[0];

        const updatedInfoProgresses = chapter.infoProgresses.map((info) => {
            if (info.infoId === currentInfo.infoId) {
                return {
                    ...info,
                    viewed: true,
                };
            }
            return info;
        });

        const newProgress = {
            ...chapter,
            infoProgresses: updatedInfoProgresses,
            videoProgresses: chapter.videoProgresses,
            quizProgresses: chapter.quizProgresses,
        };

        try {
            await saveLearningProgress({
                userId: user?.id,
                chapterId: chapterId,
                body: newProgress,
            });

            console.log("Progress saved successfully!");
        } catch (error) {
            console.error("Error saving progress:", error);
        }
    };


    if (isInfoLoading) {
        return <Skeleton />;
    }

    return (
        <Layout className='rounded-lg drop-shadow-xl'>
            <h1 className='text-center font-bold text-3xl my-10'>{currentInfo.infoTitle}</h1>
            <div
                className='p-6 '
                dangerouslySetInnerHTML={{ __html: infoDetail?.data?.content }}
            />
            {/* <Button onClick={handleView}>Đã đọc hết</Button> */}
            <div className="text-center pb-5">
                <button
                    onClick={handleView}
                    className=" w-60 justify-center mt-6 bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-medium rounded-full py-3 px-14 transition-transform duration-800 hover:from-cyan-400 hover:to-blue-500 hover:scale-105 hover:shadow-cyan-200 hover:shadow-lg"
                >
                    {'Đã đọc hết'}
                </button>
            </div>
        </Layout>
    );
};

export default InforLesson;
