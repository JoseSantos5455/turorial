import { Button, notification } from 'antd'
import React from 'react'
import { useCreatePaymentMutation } from '../../services/paymentAPI'
import { useSelector } from 'react-redux';

const Package = () => {

    const [createPayment, { data: pay, error, isLoading }] = useCreatePaymentMutation();
    const userId = useSelector(state => state?.user?.user?.id);
    const body = {
        productName: "Blue Pro",
        description: "Mở kháo tất cả các video",
        price: 2000,
        packageId: 1,
        userId: userId,
    };
    const handlePayment = async () => {
        try {


            const payRes = await createPayment(body).unwrap();
            const payMess = payRes?.message;
            const payurl = payRes?.data?.checkoutUrl;
            if (payurl) {
                window.location.href = payurl;
            }
        } catch (error) {
            console.log(error?.data?.message);
            notification.error({
                message: "Thanh toán thất bại",
                description: error?.data?.message,
                duration: 1.5
            });
        }
    };
    return (
        <div class="max-w-sm mx-auto bg-blue-100 rounded-lg p-6 shadow-lg mt-14" >
            {/* Header */}
            <div class="flex justify-between items-center mb-4">
                <span class="bg-blue-200 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">Dành cho một người</span>
                <div class="bg-blue-500 p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
            </div>
            {/* Title */}
            <h2 class="text-2xl font-bold text-gray-900 mb-2">Blue Pro</h2>
            <p class="text-gray-700 mb-4">Mở khóa tất cả các nội dung, video có trên trang web.</p>

            {/* Price */}
            <div class="text-3xl font-bold text-gray-900 mb-4">
                180.000 <span class="text-xl font-normal">đ</span>
                <p class="text-sm text-gray-500">/tháng cho một thành viên</p>
            </div>

            {/* CTA Button */}
            <Button onClick={handlePayment} className="w-full bg-[#4096ff] hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors duration-300 mb-6">
                Nâng cấp ngay !
            </Button>

            {/* Features  */}
            <div class="text-gray-800">
                <p class="font-bold mb-2">Mọi thứ trong bản Miễn phí, cộng thêm:</p>
                <ul class="list-disc list-inside space-y-2">
                    <li>Cập nhật video/ nội dung mới nhất</li>
                    <li>Xem được toàn bộ video trên trang web</li>
                    <li>Làm quiz để ôn lại kiến thức</li>
                    <li>Xem thông tin dể hiểu thêm về bài học</li>
                </ul>
            </div>
        </div>

    )
}

export default Package