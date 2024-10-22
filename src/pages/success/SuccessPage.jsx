import React from 'react'
import { Link } from 'react-router-dom';
import { logOut } from "../../slices/auth.slice";
import { useDispatch } from 'react-redux';
import { notification } from 'antd';

const Success = () => {
    const dispatch = useDispatch();
    const successNotification = () => {
        notification.success({
            message: 'Logout successfully',
            description: 'See you again!',
            duration: 1.5
        });
        dispatch(logOut());
    }
    return (
        <div className="min-h-screen bg-blue-50 flex items-center justify-center">
            <div className="bg-white p-10 rounded-lg shadow-lg text-center">
                {/* Icon Check */}
                <div className="flex items-center justify-center mb-4">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-16 w-16 text-green-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                </div>

                {/* Title */}
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                    Thanh toán thành công!
                </h1>

                {/* Description */}
                <p className="text-gray-600 mb-6">
                    Cảm ơn bạn đã hoàn thành thanh toán. Gói dịch vụ đã được kích hoạt.
                </p>

                {/* Button - Back to Homepage */}
                <Link
                    to="/"
                    onClick={() => successNotification()}

                    className="bg-blue-500 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-700 transition duration-300"
                >
                    Quay lại trang chủ
                </Link>
            </div>
        </div>
    );
}

export default Success