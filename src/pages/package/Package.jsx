import { Button, notification } from 'antd'
import React from 'react'
import { useCreatePaymentMutation } from '../../services/paymentAPI'
import { useSelector } from 'react-redux';
import { SketchOutlined } from '@ant-design/icons';

const Package = () => {

    const [createPayment, { data: pay, error, isLoading }] = useCreatePaymentMutation();
    const userId = useSelector(state => state?.user?.user?.id);
    const body = {
        productName: "Blue Pro",
        description: "Mở khóa tất cả các video",
        price: 2000,
        packageId: 1,
        userId: userId,
    };
    const handlePayment = async () => {
        try {


            const payRes = await createPayment(body).unwrap();
            const payMess = payRes?.message;
            const payurl = payRes?.data?.checkoutUrl;
            console.log(payurl);
            if (payurl) {
                window.location.href = payurl;
            }
        } catch (error) {
            console.log(error?.data?.error);
            notification.error({
                message: "Thanh toán thất bại",
                description: error?.data?.error,
                duration: 1.5
            });
        }
    };
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
                            <SketchOutlined style={{ fontSize: '24px' }} className="text-white" />
                        </div>
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Blue Pro - Tháng</h2>
                <p className="text-gray-700 mb-4">Mở khóa tất cả các nội dung, video có trên trang web.</p>

                <div className="text-3xl font-bold text-gray-900 mb-4">
                    50.000 đ/tháng
                    <p className="text-sm text-gray-500">cho một thành viên</p>
                </div>
                <Button onClick={handlePayment} className="w-full bg-[#4096ff] hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors duration-300 mb-6">
                    Nâng cấp ngay !
                </Button>
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
            <div className="w-80 bg-blue-100 rounded-lg p-6 shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <span className="bg-blue-200 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">Dành cho một người</span>
                    <div className="bg-blue-500 p-2 rounded-full">
                        {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg> */}
                        <div className="bg-blue-500 p-1 rounded-full w-[32px] h-[32px] ">
                            <SketchOutlined style={{ fontSize: '24px' }} className="text-white" />
                        </div>
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Blue Pro - Quý</h2>
                <p className="text-gray-700 mb-4">Mở khóa tất cả các nội dung, video có trên trang web.</p>

                <div className="text-3xl font-bold text-gray-900 mb-4">
                    140.000 đ/quý
                    <span className='text-sm text-gray-400'>(3 tháng)</span>
                    <p className="text-sm text-gray-500">cho một thành viên</p>
                </div>
                <Button onClick={handlePayment} className="w-full bg-[#4096ff] hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors duration-300 mb-6">
                    Nâng cấp ngay !
                </Button>
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
            <div className="w-80 bg-blue-100 rounded-lg p-6 shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <span className="bg-blue-200 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">Dành cho một người</span>
                    <div className="bg-blue-500 p-2 rounded-full">
                        {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg> */}
                        <div className="bg-blue-500 p-1 rounded-full w-[32px] h-[32px] ">
                            <SketchOutlined style={{ fontSize: '24px' }} className="text-white" />
                        </div>
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Blue Pro - Năm</h2>
                <p className="text-gray-700 mb-4">Mở khóa tất cả các nội dung, video có trên trang web.</p>

                <div className="text-3xl font-bold text-gray-900 mb-4">
                    500.000 đ/năm
                    <p className="text-sm text-gray-500">cho một thành viên</p>
                </div>
                <Button onClick={handlePayment} className="w-full bg-[#4096ff] hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors duration-300 mb-6">
                    Nâng cấp ngay !
                </Button>
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
    )

}

export default Package