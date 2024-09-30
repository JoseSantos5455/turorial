import React from 'react'
import { useParams } from "react-router-dom";
import { Spin, Tag } from 'antd';
import { useGetUserDetailQuery } from '../../../../services/userAPI';
import { CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
const Detail = () => {
    const params = useParams();
    const { data, isLoading } = useGetUserDetailQuery(params.userId);
    return (
        <div className="w-full p-5 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-center w-30 font-semibold text-xl">User Details</h2>
                <div className="w-30">
                    {data?.is_active === true && (
                        <Tag icon={<CheckCircleOutlined />} color="success">
                            Hoạt động
                        </Tag>
                    )}
                    {data?.is_active === false && (
                        <Tag icon={<ExclamationCircleOutlined />} color="warning">
                            Bị khóa
                        </Tag>
                    )}
                </div>
                <button
                    className="w-30 text-blue-600 text-xl p-3 bg-white border-none cursor-pointer"
                    type="reset"
                    onClick={() => {
                        window.history.back();
                    }}
                >
                    <CloseCircleOutlined />
                </button>
            </div>

            <div className="flex flex-wrap">
                <div className="w-full md:w-1/2 mb-3">
                    <label className="font-bold block mb-2">Fullname</label>
                    <p className="border border-gray-300 p-3 rounded-md mr-3">{data?.full_name}</p>
                </div>

                <div className="w-full md:w-1/2 mb-3">
                    <label className="font-bold block mb-2">Email</label>
                    <p className="border border-gray-300 p-3 rounded-md mr-3">{data?.email}</p>
                </div>
                <div className="w-full md:w-1/2 mb-3">
                    <label className="font-bold block mb-2">Phone</label>
                    <p className="border border-gray-300 p-3 rounded-md mr-3">{data?.phone_number}</p>
                </div>
                <div className="w-full md:w-1/2 mb-3">
                    <label className="font-bold block mb-2">Date of Birth</label>
                    <p className="border border-gray-300 p-3 rounded-md mr-3">
                        {data?.date_of_birth != null && dayjs(data.date_of_birth).format('DD/MM/YYYY')}
                    </p>
                </div>
                <div className="w-full md:w-1/2 mb-3">
                    <label className="font-bold block mb-2">Address</label>
                    <p className="border border-gray-300 p-3 rounded-md mr-3">{data?.address}</p>
                </div>

            </div>
        </div>

    )
}

export default Detail