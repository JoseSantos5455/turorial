import React from 'react';
import { useGetInfoDetailQuery, useSavingNewProgressMutation } from '../../services/coursesAPI';
import { Layout, Skeleton, Button } from 'antd';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../slices/auth.slice';

const InforLesson = ({ currentInfo, chapterId }) => {
    const user = useSelector(selectCurrentUser)
    const { data: infoDetail, isLoading: isInfoLoading, error: infoError } = useGetInfoDetailQuery(currentInfo.infoId);
    const [saveLearningProgress] = useSavingNewProgressMutation({ userId: user?.id, chapterId });

    // const handleView = async () => {
    //     const newProgress = progress.map((item) => {
    //         if (item.infoId === currentInfo.infoId) {
    //             return {
    //                 ...item,
    //                 viewed: true,
    //             };
    //         }
    //         return item;
    //     });

    //     try {


    //         await saveLearningProgress(newProgress);
    //         console.log("Progress saved successfully!");
    //     } catch (error) {
    //         console.error("Error saving progress:", error);
    //     }
    // };

    if (isInfoLoading) {
        return <Skeleton />;
    }
    return (
        <Layout className='rounded-lg drop-shadow-xl'>
            <h1 className='text-center font-bold text-3xl my-10'>{currentInfo.infoTitle}</h1>
            <div
                className='p-6 '
                dangerouslySetInnerHTML={{ __html: infoDetail.content }}
            />
            <Button onClick={handleView}>Đã đọc hết</Button>
        </Layout>
    );
};

export default InforLesson;
