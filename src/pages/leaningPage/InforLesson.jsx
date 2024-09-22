import React from 'react'
import { useGetInfoDetailQuery } from '../../services/coursesAPI';
import { Layout, Skeleton } from 'antd';

const InforLesson = ({ currentInfo }) => {
    const { data: infoDetail, isLoading: isInfoLoading, error: infoError } = useGetInfoDetailQuery(currentInfo.infoId);

    console.log(infoDetail)
    if (isInfoLoading) {
        return <Skeleton />
    }
    return (
        <Layout className='rounded-lg drop-shadow-xl'>
            <h1 className='text-center font-bold text-3xl my-10'>{currentInfo.infoTitle}</h1>
            <div
                className='p-6 '
                dangerouslySetInnerHTML={{ __html: infoDetail.content }}
            />
        </Layout>
    )
}

export default InforLesson