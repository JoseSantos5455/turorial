import React from 'react';
import { Form, Input, Button, InputNumber, Space, message } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import { useCreateCourseInfoMutation } from '../../../../services/coursesAPI';


const CreateVideo = ({ stt, lessonId, refetch, handleCloseModal }) => {
    const [form] = Form.useForm();
    const [createInfo, { isLoading }] = useCreateCourseInfoMutation();

    const onFinish = async (values) => {
        const valuesToSubmit = { ...values, stt: stt };
        try {
            await createInfo({ body: valuesToSubmit, lessonId: lessonId }).unwrap();
            message.success('Tạo bài học thành công!');
            handleCloseModal();
            form.resetFields();
            refetch();
        } catch (error) {
            message.error('Tạo bài học thất bại, vui lòng kiểm tra lại!');
        }
    };

    return (
        <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item
                name="infoTitle"
                label="Tiêu đề thông tin"
                rules={[{ required: true, message: 'Vui lòng nhập tiêu đề thông tin!' }]}
            >
                <Input placeholder="Nhập tiêu đề thông tin" />
            </Form.Item>
            <Form.Item
                name="content"
                label="Nội dung"
                rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}
            >
                <ReactQuill
                    style={{
                        minHeight: '180px',
                        maxHeight: 'auto',
                        backgroundColor: 'white',
                        border: '1px solid #d1d1d1',
                        overflowY: 'auto'
                    }}
                    theme="snow"
                    placeholder="Nhập nội dung"
                    onChange={(content) => form.setFieldsValue({ content })}
                />
            </Form.Item>

            <Form.Item>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button icon={<PlusOutlined />} size="large" type="primary" htmlType="submit" loading={isLoading}>
                        Tạo bài học
                    </Button>
                </div>
            </Form.Item>
        </Form>
    );
};

export default CreateVideo;
