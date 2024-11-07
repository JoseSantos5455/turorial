import { Button, Image, notification } from 'antd'
import React from 'react'
import { useCreatePaymentMutation } from '../../services/paymentAPI'
import { useSelector } from 'react-redux';
import { SketchOutlined } from '@ant-design/icons';
import crown from "../../assets/image/crown.png"


const Package = () => {
    const [createPayment, { data: pay, error, isLoading }] = useCreatePaymentMutation();
    const userId = useSelector(state => state?.user?.user?.id);
    console.log(userId);

    const handlePayment = async (productName, description, price, packageId) => {
        const body = {
            productName,
            description,
            price,
            packageId,
            userId: userId,
        };

        try {
            const payRes = await createPayment(body).unwrap();
            const payurl = payRes?.data?.checkoutUrl;
            console.log(payurl);
            if (payurl) {
                window.location.href = payurl;
            }
        } catch (error) {
            console.log(error?.data?.error);
            notification.error({
                message: "Thanh toán thất bại",
                description: "Bạn cần đăng nhập để thanh toán",
                duration: 1.5
            });
        }
    };

    return (
        <div className="flex justify-center space-x-10 mt-14">
            {/* Monthly Plan */}
            <div className="w-80 bg-blue-100 rounded-lg p-6 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Blue Pro - Tháng</h2>
                <div className="text-3xl font-bold text-green-600 mb-4">
                    18.000 đ/tháng
                </div>
                <button
                    onClick={() => handlePayment("Blue Pro - Tháng", "Mở khóa tất cả các video", 18000, 1)}
                    className="w-full bg-[#a8caff] hover:bg-[#4096ff] text-white font-bold py-3 rounded-lg transition-colors duration-300 mb-6"
                >
                    Nâng cấp ngay!
                </button>
            </div>

            {/* Quarterly Plan */}
            <div className="w-80 bg-orange-100 rounded-lg p-6 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Blue Pro - Quý</h2>
                <div className="text-3xl font-bold text-green-600 mb-4">
                    50.000 đ/quý
                </div>
                <button
                    onClick={() => handlePayment("Blue Pro - Quý", "Mở khóa tất cả các video", 50000, 2)}
                    className="w-full bg-[#fbc27a] hover:bg-[#f9992a] text-white font-bold py-3 rounded-lg transition-colors duration-300 mb-6"
                >
                    Nâng cấp ngay!
                </button>
            </div>

            {/* Yearly Plan */}
            <div className="w-80 bg-red-100 rounded-lg p-6 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Blue Pro - Năm</h2>
                <div className="text-3xl font-bold text-green-600 mb-4">
                    200.000 đ/năm
                </div>
                <button
                    onClick={() => handlePayment("Blue Pro - Năm", "Mở khóa tất cả các video", 200000, 3)}
                    className="w-full bg-[#f28b82] hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-colors duration-300 mb-6"
                >
                    Nâng cấp ngay!
                </button>
            </div>
        </div>
    );
};

export default Package;
