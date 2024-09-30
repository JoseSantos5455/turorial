import React, { useCallback, useState } from 'react';
import { Form, Input, Button, message, notification } from 'antd';
import { validationPatterns } from '../../utils/utils';
import { useChangePasswordMutation } from '../../services/userAPI';
import { useDispatch, useSelector } from 'react-redux';
import { logOut, selectCurrentUser } from '../../slices/auth.slice';
import { navigate } from '../../utils/navigate';

const ChangePassword = () => {
    const [form] = Form.useForm();
    const [changePass] = useChangePasswordMutation();
    const userId = useSelector(selectCurrentUser)
    const dispatch = useDispatch()

    const handleLogout = useCallback(() => {
        dispatch(logOut());
    }, [dispatch]);


    const handleSubmit = async (values) => {
        try {
            const rs = await changePass({
                old_password: values.oldPassword,
                new_password: values.newPassword,
                confirm_password: values.confirmPassword,
                userId: userId.id
            }).unwrap(); 
            message.success('Đổi mật khẩu thành công vui lòng đăng nhập lại !');
            handleLogout();
            form.resetFields();

        } catch (error) {
            message.error('Đổi mật khẩu thất bại!');
            console.error('Lỗi:', error);
        }
    };

    return (
        <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded-md text-center ">
            <h2 className="text-xl font-bold mb-8 py-4 bg-[#f0f5ff] w-full rounded-md">Đổi Mật Khẩu</h2>
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                <Form.Item

                    label="Mật khẩu cũ"
                    name="oldPassword"
                    rules={[{ required: true, message: 'Vui Đổi mật khẩu mật khẩu cũ!' }]}
                >
                    <Input.Password size='large' />
                </Form.Item>

                <Form.Item
                    label="Mật khẩu mới"
                    name="newPassword"
                    rules={[
                        {
                            required: true,
                            pattern: validationPatterns.password.pattern,
                            message: validationPatterns.password.message

                        }
                    ]}
                >
                    <Input.Password size='large' />
                </Form.Item>

                <Form.Item
                    label="Nhập lại mật khẩu mới"
                    name="confirmPassword"
                    rules={[
                        { required: true, message: 'Nhập lại mật khẩu để xác nhận!' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('newPassword') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Mật khẩu mới không khớp!'));
                            },
                        }),
                    ]}
                >
                    <Input.Password size='large' />
                </Form.Item>

                <Form.Item >
                    <Button
                        size='large'
                        className="
                        mt-6 w-[40%]
                    bg-gradient-to-r 
                    from-blue-500 to-cyan-400 text-white 
                    font-medium rounded-full py-2 px-6 transition-transform duration-800
                     hover:from-cyan-400 hover:to-blue-500 hover:scale-105 hover:shadow-cyan-200 hover:shadow-lg"
                        type="primary"
                      htmlType='submit'

                    >
                        Đổi mật khẩu
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default ChangePassword;
