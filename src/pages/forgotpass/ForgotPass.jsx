import React, { useState, useEffect } from 'react';
import Logo from '../../assets/image/logo.png';
import { Form, Image, Input, Button, Alert } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { UserOutlined } from '@ant-design/icons';

const ForgotPass = () => {
    const [form] = useForm();
    const [error, setError] = useState('');
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [countdown, setCountdown] = useState(0);
    const [timerActive, setTimerActive] = useState(false);
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [isCodeInput, setIsCodeInput] = useState(true);

    // Hàm gửi mã
    const handleSendCode = () => {
        const email = form.getFieldValue('email');
        if (email) {
            console.log('Sending code to:', email);
            setIsCodeSent(true);
            setTimerActive(true);
            setCountdown(120);
        } else {
            setError('Vui lòng nhập email hoặc số điện thoại');
        }
    };


    const handleInputChange = () => {
        const email = form.getFieldValue('email');
        setIsButtonDisabled(!email);
    };

    const handleInputCode = () => {
        const code = form.getFieldValue('verificationCode');
        setIsCodeInput(!code);
    };

    useEffect(() => {
        let timer;
        if (timerActive && countdown > 0) {
            timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        } else if (countdown === 0) {
            setTimerActive(false);
        }
        return () => clearTimeout(timer);
    }, [countdown, timerActive]);

    return (
        <div className="h-[100%] flex flex-col mt-4 py-10 items-center">
            {/* header */}
            <div className="flex flex-col text-center mb-7 items-center justify-center w-[80%] ">
                <Image
                    width={50}
                    height={40}
                    preview={false}
                    src={Logo}
                />
                <p className="text-3xl font-Bold p-5">Đăng nhập vào Blue</p>
                <p className="text-sm text-neutral-500">
                    Nhập email hoặc username của bạn và chúng tôi sẽ gửi cho bạn mã khôi phục mật khẩu.
                </p>
            </div>

            <Form
                form={form}
                onFinish={handleSendCode}
                className='w-[70%]'
                layout="vertical"
            >
                {error && (
                    <>
                        <Alert message={error} type="error" showIcon />
                        <br />
                    </>
                )}
                <Form.Item
                    label={<span>Email hoặc số điện thoại</span>}
                    style={{ marginBottom: '1.5rem' }}
                    name="email"
                    rules={[{ required: true, message: "Trường này không được để trống" }]}
                >
                    <Input
                        placeholder="    Email hoặc số điện thoại"
                        size="large"
                        className="form-input py-2"
                        prefix={<UserOutlined />}
                        onChange={handleInputChange}
                    />
                </Form.Item>

                {/* Nút Gửi mã + Input nhập mã */}

                <Form.Item
                    className='w-[80%]'
                    name="verificationCode"
                    style={{ marginBottom: '0.5rem' }}
                    rules={[{ required: true, message: "Vui lòng nhập mã xác nhận" }]}
                >
                    <div className='flex'>
                        <Input.OTP
                            disabled={!isCodeSent}
                            placeholder="Nhập mã xác nhận"
                            size="large"
                            className="form-input relative"
                            onChange={handleInputCode}
                        >
                        </Input.OTP>
                        <Button
                            type="primary"
                            onClick={handleSendCode}
                            disabled={isButtonDisabled || timerActive}
                            className="w-[30%] h-10 absolute right-[-90px] top-[-2px]"
                        >
                            {timerActive ? `${countdown} giây` : 'Gửi mã'} {/* Hiển thị thời gian đếm ngược */}
                        </Button>
                    </div>
                </Form.Item>
                <Form.Item>
                    <Button
                        type="primary"
                        onClick={handleInputCode}
                        disabled={isCodeInput}
                        size="large"
                        className="
                        mt-5
                        w-full
                        bg-gradient-to-r 
                        from-blue-500 to-cyan-400 text-white 
                        font-medium rounded-full py-2 px-6 transition-transform duration-800
                         hover:from-cyan-400 hover:to-blue-500 hover:scale-105 hover:shadow-cyan-200 hover:shadow-lg"
                    >
                        Đặt lại mật khẩu
                    </Button>
                </Form.Item>



            </Form>
        </div>
    );
};

export default ForgotPass;
