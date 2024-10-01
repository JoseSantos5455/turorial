import React, { useState } from 'react';
import { Layout, Card, Form, Input, Button, DatePicker, Select, Col, Row, Image, Upload, Progress, message } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, HomeOutlined, LockOutlined, ManOutlined, WomanOutlined, SettingOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import './profile.scss'
import { validationPatterns } from '../../utils/utils';
import dayjs from 'dayjs';
import { useUpateUserProfileMutation, useUpdateAvatarMutation } from '../../services/userAPI';
import userIcon from '../../assets/image/graduate.svg'

const { Content } = Layout;
const { Option } = Select;

const Profile = ({ profile, userId }) => {
    const [isUpdate, setIsUpdate] = useState(false)
    const [form] = Form.useForm();
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [avatarFile, setAvatarFile] = useState(null);
    const [newAvatarFile, setNewAvatarFile] = useState(null);
    const [updateAvatar, { isLoading }] = useUpdateAvatarMutation()
    const [updateProfile, { isLoading: IsUpdateProfile }] = useUpateUserProfileMutation();


    const onFinish = async (values) => {
        try {

            const response = await updateProfile(values).unwrap();
            console.log(response)

            // Xử lý khi cập nhật thành công
            // console.log('Update success:', response);
            message.success('Cập nhật hồ sơ thành công!');
        } catch (error) {
            // Bắt lỗi khi cập nhật thất bại
            console.error('Update failed:', error);
            message.error('Cập nhật hồ sơ thất bại, vui lòng thử lại.');
        }
    };
    const props = {
        name: 'file',
        beforeUpload: (file) => {
            const isImage = file.type.startsWith('image/');
            if (!isImage) {
                message.error('Bạn chỉ có thể upload file hình ảnh!');
                return Upload.LIST_IGNORE;
            }
            setAvatarFile(file);
            return false;
        },
        onChange(info) {
            if (info.file.status === 'Đang tải lên') {
                setUploading(true);
                setProgress(Math.round(info.file.percent));
            } else if (info.file.status === 'Hoàn thành') {
                setUploading(false);
            } else if (info.file.status === 'lỗi khi tải ảnh') {
                message.error(`${info.file.name} Tải hỉnh ảnh thất bại.`);
                setUploading(false);
            }
        },
        progress: {
            strokeColor: {
                '0%': '#108ee9',
                '100%': '#87d068',
            },
            strokeWidth: 3,
            format: (percent) => percent && `${parseFloat(percent.toFixed(2))}%`,
        },
    };

    const handleUpload = () => {
        if (!avatarFile) {
            message.error("Bạn hãy chọn hình ảnh trước !");
            return;
        }
        const formData = new FormData();
        formData.append('avatar', avatarFile);

        updateAvatar({ userId, avatar: formData })
            .then((response) => {
                console.log(response)
                if (response.error) {
                    if (response.error.data.message === "Maximum upload size exceeded") {
                        message.error('File vượt quá 10MB!');
                    } else {
                        message.error(response.error.message || 'Đã xảy ra lỗi khi cập nhật.');
                    }
                    return;
                }
                setAvatarFile(null);
                setNewAvatarFile(response.data.data.avatar);
                message.success('Cập nhật ảnh đại diện thành công!');
            })
            .catch(() => {
                message.error('Cập nhật ảnh đại diện thất bại.');
                setAvatarFile(null);
            })
            .finally(() => {
                setUploading(false);
            });
    };

    return (
        <Card className="rounded-lg shadow-lg text-center ">
            <div className='bg-slate-200 py-4 mb-[60px] mt-6 '>

                <h2 className="text-center text-2xl mb-2 pt-3 font-bold">Thông tin cá nhân</h2>
                <p>Quản lý tên hiển thị, tên người dùng, bio và avatar của bạn.</p>

            </div>
            {isUpdate ? (
                <>
                    <div style={{ textAlign: 'center' }} className='flex flex-col justify-center items-center relative'>
                        <Image
                            src={newAvatarFile || profile?.avatar || userIcon}
                            alt="Avatar"
                            width={150}
                            height={150}
                            className='rounded-full mb-7'
                        />
                        <Upload {...props} showUploadList={false}>
                            <Button className='mt-5' icon={<UploadOutlined />} type="primary">
                                {uploading ? 'Đang tải...' : 'Chọn ảnh tải lên'}
                            </Button>
                        </Upload>

                        <Button
                            onClick={handleUpload}
                            type="primary"
                            style={{ marginTop: 16 }}
                            loading={isLoading}
                            disabled={!avatarFile}
                        >
                            {uploading ? 'Đang tải...' : 'Tải ảnh lên'}
                        </Button>
                        <Button
                            onClick={() => setIsUpdate(!isUpdate)}
                            className='absolute top-10 right-2 py-3'
                            type='primary' iconPosition='end'
                            icon={<SettingOutlined />}>
                            Chỉnh sửa thông tin
                        </Button>
                    </div>
                    <Form
                        initialValues={{
                            fullname: profile?.full_name,
                            email: profile?.email,
                            phoneNumber: profile?.phone_number,
                            address: profile?.address,
                            dateOfBirth: profile?.date_of_birth ? dayjs(profile?.date_of_birth) : null,
                            gender: profile?.gender,
                            avatar: profile?.avatar
                        }}
                        name="profile"
                        onFinish={onFinish}
                        layout="vertical"
                    >

                        <Form.Item
                            name="fullname"
                            label="Full Name"
                            rules={[{ required: true, message: 'Bạn đang bỏ trống trường này!' }]}
                        >
                            <Input prefix={<UserOutlined />} placeholder="Full Name" />
                        </Form.Item>
                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[
                                {
                                    required: true,
                                    pattern: validationPatterns.email.pattern,
                                    message: validationPatterns.email.message,
                                },
                            ]}
                        >
                            <Input prefix={<MailOutlined />} readOnly={true} placeholder="Email" />
                        </Form.Item>
                        {/* <Form.Item
                    name="password"
                    label="Password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password prefix={<LockOutlined />} placeholder="Password" />
                </Form.Item> */}
                        <Form.Item
                            name="dateOfBirth"
                            label="Date of Birth"
                            rules={[
                                { required: true, message: "vui lòng nhập vào ngày sinh !" },
                                () => ({
                                    validator(_, value) {
                                        const selectedYear = value && value.year();
                                        const nowYear = new Date().getFullYear();
                                        const yearChecked = nowYear - selectedYear;
                                        if ((selectedYear && nowYear) && yearChecked >= 18 && yearChecked <= 100) {
                                            return Promise.resolve();
                                        } else {
                                            form.resetFields(['dateOfBirth']);
                                            if (yearChecked < 12) {
                                                message.error("Tuổi không được dưới 12!");
                                            }
                                            return Promise.reject(new Error("Vui lòng chọn ngày sinh"));
                                        }
                                    },
                                }),
                            ]}
                        >
                            <DatePicker style={{ width: '100%' }} />
                        </Form.Item>
                        <Form.Item
                            name="phoneNumber"
                            label="Phone Number"
                            rules={[{
                                required: true,
                                pattern: validationPatterns.phoneNumber.pattern,
                                message: validationPatterns.phoneNumber.message,
                            }]}
                        >
                            <Input prefix={<PhoneOutlined />} placeholder="Phone Number" />
                        </Form.Item>
                        <Form.Item
                            name="address"
                            label="Address"
                            rules={[{ required: true, message: 'Vui lòng nhập vào địa chỉ !' }]}
                        >
                            <Input prefix={<HomeOutlined />} placeholder="Address" />
                        </Form.Item>
                        <Form.Item
                            name="gender"
                            label="Gender"
                            rules={[{ required: true, message: 'vui lòng chọn giới tính!' }]}
                        >
                            <Select placeholder="Select Gender">
                                <Option value="male"><ManOutlined /> Nam</Option>
                                <Option value="female"><WomanOutlined /> Nữ</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" loading={IsUpdateProfile} htmlType="submit" className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600">
                                Lưu thay đổi
                            </Button>
                        </Form.Item>
                    </Form>
                </>
            ) : (
                <div className='h-full'>
                    <Row justify={'center'} className='mt-5 flex flex-row items-center relative pb-8'>
                        <Button
                            onClick={() => setIsUpdate(!isUpdate)}
                            className='absolute top-[-40px] right-1 '
                            type='primary' iconPosition='end'
                            icon={<SettingOutlined />}>
                            Chỉnh sửa thông tin
                        </Button>
                        <Col md={8} className='mr-10'>
                            <div className='    bg-gradient-to-r 
                    from-blue-500 to-cyan-400 text-white 
                    font-medium rounded-md py-10 px-6 transition-transform duration-800
                     hover:from-cyan-400 hover:to-blue-500 shadow-md shadow-gray-300 hover:shadow-cyan-200 hover:shadow-lg'>
                                <Image src={newAvatarFile || profile?.avatar || userIcon} width={100} height={100} className='rounded-full shadow-lg shadow-slate-500' />
                                <p className='font-bold text-xl pt-3'>{profile?.full_name}</p>
                                <p className='font-thin text-lg'>{profile?.email}</p>
                            </div>
                        </Col>
                        <Col md={12}>
                            <div className='text-left bg-slate-200 py-6 px-4  rounded-md'>
                                <Row gutter={16}>
                                    <Col span={12} className='flex flex-col gap-2'>
                                        <div>
                                            <p className="text-md font-bold text-gray-600">Họ và Tên:</p>
                                            <p className='text-md text-gray-400'>{profile?.full_name}</p>
                                        </div>
                                        <div>
                                            <p className="text-md font-bold text-gray-600">Email:</p>
                                            <p className='text-md text-gray-400'>{profile?.email}</p>
                                        </div>
                                        <div>
                                            <p className="text-md font-bold text-gray-600">Số điện thoại:</p>
                                            <p className='text-md text-gray-400'>{profile?.phone_number || 'Chưa có số điện thoại'}</p>
                                        </div>
                                        <div>
                                            <p className="text-md font-bold text-gray-600">Địa chỉ:</p>
                                            <p className='text-md text-gray-400'>{profile?.address || 'Chưa có địa chỉ'}</p>
                                        </div>
                                    </Col>
                                    <Col span={12} className='flex flex-col gap-2'>
                                        <div>
                                            <p className="text-md font-bold text-gray-600">Thành phố:</p>
                                            <p className='text-md text-gray-400'>{profile?.city || 'Chưa có thành phố'}</p>
                                        </div>
                                        <div>
                                            <p className="text-md font-bold text-gray-600">Ngày sinh:</p>
                                            <p className='text-md text-gray-400'>{profile?.date_of_birth || 'Chưa có ngày sinh'}</p>
                                        </div>
                                        <div>
                                            <p className="text-md font-bold text-gray-600">Trạng thái:</p>
                                            <p className='text-md text-gray-400'>{profile?.is_active ? 'Kích hoạt' : 'Không kích hoạt'}</p>
                                        </div>
                                    </Col>
                                </Row>
                            </div>


                        </Col>
                    </Row>
                </div>
            )}
        </Card>
    );
};

export default Profile;
