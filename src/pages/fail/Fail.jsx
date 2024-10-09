import React from 'react'
import { Link } from 'react-router-dom';

const Fail = () => {
    return (
        <div className="min-h-screen bg-red-50 flex items-center justify-center">
            <div className="bg-white p-10 rounded-lg shadow-lg text-center">
                {/* Icon X */}
                <div className="flex items-center justify-center mb-4">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-16 w-16 text-red-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </div>

                {/* Title */}
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                    Thanh toán thất bại!
                </h1>

                {/* Description */}
                <p className="text-gray-600 mb-6">
                    Rất tiếc, đã có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.
                </p>

                {/* Button - Back to Homepage */}
                <Link
                    to="/"
                    className="bg-red-500 text-white px-6 py-3 rounded-lg text-lg hover:bg-red-700 transition duration-300"
                >
                    Quay lại trang chủ
                </Link>
            </div>
        </div>
    );
}

export default Fail