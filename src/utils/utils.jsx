import React from 'react';
import videoIcon from '../assets/image/video-duration.svg';
import inFoIcon from '../assets/image/document.svg';
import quizIcon from '../assets/image/web-test.svg';
import { Image } from 'antd';

export const VietnameseProvinces = [
    "An Giang",
    "Bà Rịa - Vũng Tàu",
    "Bắc Giang",
    "Bắc Kạn",
    "Bạc Liêu",
    "Bắc Ninh",
    "Bến Tre",
    "Bình Định",
    "Bình Dương",
    "Bình Phước",
    "Bình Thuận",
    "Cà Mau",
    "Cao Bằng",
    "Đắk Lắk",
    "Đắk Nông",
    "Điện Biên",
    "Đồng Nai",
    "Đồng Tháp",
    "Gia Lai",
    "Hà Giang",
    "Hà Nam",
    "Hà Tĩnh",
    "Hải Dương",
    "Hậu Giang",
    "Hòa Bình",
    "Hưng Yên",
    "Khánh Hòa",
    "Kiên Giang",
    "Kon Tum",
    "Lai Châu",
    "Lâm Đồng",
    "Lạng Sơn",
    "Lào Cai",
    "Long An",
    "Nam Định",
    "Nghệ An",
    "Ninh Bình",
    "Ninh Thuận",
    "Phú Thọ",
    "Quảng Bình",
    "Quảng Nam",
    "Quảng Ngãi",
    "Quảng Ninh",
    "Quảng Trị",
    "Sóc Trăng",
    "Sơn La",
    "Tây Ninh",
    "Thái Bình",
    "Thái Nguyên",
    "Thanh Hóa",
    "Thừa Thiên Huế",
    "Tiền Giang",
    "Trà Vinh",
    "Tuyên Quang",
    "Vĩnh Long",
    "Vĩnh Phúc",
    "Yên Bái",
    "Phú Yên",
    "Cần Thơ",
    "Đà Nẵng",
    "Hải Phòng",
    "Hà Nội",
    "TP Hồ Chí Minh"
];
export const validationPatterns = {
    name: {
        pattern: /^[^\d\s][\p{L}'\s-]{4,49}$/u,
        message: 'Tên tài khoản phải là ký tự và từ 5 - 50 ký tự!',
    },
    phoneNumber: {
        pattern: /^(0|\+84)[1-9]\d{8}$/,
        message: 'Số điện thoại phải bắt đầu bằng 0, 10 chữ số và không có chữ cái!',
    },
    email: {
        pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
        message: 'Email không đúng định dạng!',
    },
    number: {
        pattern: /^[1-9]\d{3}^$/,
        message: 'Số nhỏ nhất là 1 và chỉ có chữ số!',
    },
    password: {
        pattern: /^(?=^.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/,
        message: "Mật khẩu phải có ít nhất 1 chữ cái viết hoa, 6 ký tự, ít nhất 1 số!"
    }
};

export const handleDisplayTypeVideo = {
    "video": React.createElement(Image, { preview: false, width: 12, src: videoIcon }),
    "information": React.createElement(Image, { preview: false, width: 12, src: inFoIcon }),
    "quiz": React.createElement(Image, { preview: false, width: 12, src: quizIcon })
}

export const handleDisplayTime = (time) => {
    if (time < 60) {
        return <span> 0: {time} </span>;
    } else {
        const hours = Math.floor(time / 60);
        const minutes = time % 60;
        return <span>{hours}:{minutes > 10 ? `${minutes}` : `0${minutes}` }</span>;
    }
}

export const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });