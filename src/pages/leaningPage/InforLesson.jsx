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
                newBody: newProgress,
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
            {/* Add a button to trigger the handleView function */}
            <Button onClick={handleView}>Đã đọc hết</Button>
        </Layout>
    );
};

export default InforLesson;
