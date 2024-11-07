import { Button, Image, notification } from 'antd'
import React, { useEffect } from 'react'
import { useCreatePaymentMutation } from '../../services/paymentAPI'
import { useSelector } from 'react-redux';
import { SketchOutlined } from '@ant-design/icons';
import crown from "../../assets/image/crown.png"


const Package = () => {
    const [createPayment, { data: pay, error, isLoading }] = useCreatePaymentMutation();
    const userId = useSelector(state => state?.user?.user?.id);
    const userPackage = useSelector(state => state?.user?.user?.packageStatus);
    console.log(userPackage);
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

    if (userPackage === "ACTIVE") {
        return (
            <div className="text-center mt-20 p-8 bg-green-100 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-green-700 mb-4">Bạn đã mua gói thành công!</h2>
                <p className="text-lg text-gray-700">
                    Sau ngày gia hạn, hệ thống sẽ tự động thông báo việc mua gói tiếp tục.
                </p>
            </div>
        );
    }


    return (
        <div className="flex justify-center space-x-10 mt-14">
            {/* Monthly Plan */}
            <div className="w-80 bg-blue-100 rounded-lg p-6 shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <span className="bg-blue-200 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">Dành cho một người</span>
                    <div className="bg-blue-500 p-2 rounded-full">
                        {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg> */}
                        <div className="bg-blue-500 p-1 rounded-full w-[32px] h-[32px] ">
                            <Image preview={false} src={crown}></Image>
                        </div>
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Blue Pro - Tháng</h2>
                <p className="text-red-600 mb-4">Mở khóa tất cả các nội dung, video có trên trang web.</p>

                <div className="text-3xl font-bold text-green-600 mb-4">
                    18.000 đ/tháng
                    <p className="text-sm text-gray-500">cho một thành viên</p>
                </div>
                <button
                    onClick={() => handlePayment("Mở khóa tất cả các video", "Blue Pro - Tháng", 18000, 1)}
                    className="w-full bg-[#a8caff] hover:bg-[#4096ff] text-white font-bold py-3 rounded-lg transition-colors duration-300 mb-6"
                >
                    Nâng cấp ngay !
                </button>
                <div className="text-gray-800">
                    <p className="font-bold mb-2">Mọi thứ trong bản Miễn phí, cộng thêm:</p>
                    <ul className="list-disc list-inside space-y-2">
                        <li>Cập nhật video/ nội dung mới nhất</li>
                        <li>Xem được toàn bộ video trên trang web</li>
                        <li>Làm quiz để ôn lại kiến thức</li>
                        <li>Xem thông tin để hiểu thêm về bài học</li>
                    </ul>
                </div>
            </div>
            {/* Quarterly Plan */}
            <div className="w-80 bg-orange-100 rounded-lg p-6 shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <span className="bg-orange-200 text-orange-700 text-xs font-semibold px-3 py-1 rounded-full">Dành cho một người</span>
                    <div className="bg-[#f7842c] p-2 rounded-full">
                        <div className="bg-[#f7842c] p-1 rounded-full w-[32px] h-[32px]">
                            <SketchOutlined style={{ fontSize: '24px' }} className="text-white" />
                        </div>
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Blue Pro - Quý</h2>
                <p className="text-red-600 font-bold text-base text-shadow-sm mb-4">
                    Tiết kiệm 8% so với mua gói theo tháng
                </p>

                <div className="text-3xl font-bold text-green-600 mb-4">
                    50.000 đ/quý
                    <span className='text-sm text-gray-400'>(3 tháng)</span>
                    <p className="text-sm text-gray-500">cho một thành viên</p>
                </div>
                <button
                    type="text"
                    onClick={() => handlePayment("Mở khóa tất cả các video", "Blue Pro - Quý", 50000, 2)}
                    className="w-full bg-[#fbc27a] hover:bg-[#f9992a] text-white font-bold py-3 rounded-lg transition-colors duration-300 mb-6"
                >
                    Nâng cấp ngay !
                </button>

                <div className="text-gray-800">
                    <p className="font-bold mb-2">Mọi thứ trong bản Miễn phí, cộng thêm:</p>
                    <ul className="list-disc list-inside space-y-2">
                        <li>Cập nhật video/ nội dung mới nhất</li>
                        <li>Xem được toàn bộ video trên trang web</li>
                        <li>Làm quiz để ôn lại kiến thức</li>
                        <li>Xem thông tin để hiểu thêm về bài học</li>
                    </ul>
                </div>
            </div>


            {/* Yearly Plan */}
            <div className="w-80 bg-red-100 rounded-lg p-6 shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <span className="bg-red-200 text-red-700 text-xs font-semibold px-3 py-1 rounded-full">Dành cho một người</span>
                    <div className="bg-red-500 p-2 rounded-full">
                        <div className="bg-red-500 p-1 rounded-full w-[32px] h-[32px]">
                            <Image preview={false} src={crown}></Image>
                        </div>
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Blue Pro - Năm</h2>
                <p className="text-red-600 font-bold text-base text-shadow-sm mb-4">
                    Tiết kiệm 17% so với mua gói theo tháng
                </p>
                <div className="text-3xl font-bold text-green-600 mb-4">
                    180.000 đ/năm
                    <p className="text-sm text-gray-500">cho một thành viên</p>
                </div>
                <button
                    onClick={() => handlePayment("Mở khóa tất cả các video", "Blue Pro - Năm", 180000, 3)}
                    className="w-full bg-[#f28b82] hover:bg-red-600 text-white font-bold py-3 rounded-lg transition-colors duration-300 mb-6">
                    Nâng cấp ngay !
                </button>
                <div className="text-gray-800">
                    <p className="font-bold mb-2">Mọi thứ trong bản Miễn phí, cộng thêm:</p>
                    <ul className="list-disc list-inside space-y-2">
                        <li>Cập nhật video/ nội dung mới nhất</li>
                        <li>Xem được toàn bộ video trên trang web</li>
                        <li>Làm quiz để ôn lại kiến thức</li>
                        <li>Xem thông tin để hiểu thêm về bài học</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Package;
