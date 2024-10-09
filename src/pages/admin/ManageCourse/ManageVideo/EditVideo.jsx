import React, { useEffect } from 'react';
import { Form, Input, Button, InputNumber, Space, message, Spin } from 'antd';
import { EditFilled, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useEditVideoMutation, useGetVideoDetailsQuery, } from '../../../../services/coursesAPI';

const EditVideo = ({ lessonId, refetch, handleCloseEditModal }) => {

    const [form] = Form.useForm();
    const { data: videoData, isLoading: isloadingData } = useGetVideoDetailsQuery(lessonId);
    const [updateVideo, { isLoading }] = useEditVideoMutation();


    useEffect(() => {
        if (videoData) {
            form.setFieldsValue({
                videoName: videoData.data.videoName,
                lessonVideo: videoData.data.lessonVideo,
                duration: videoData.data.duration,
                moreInformation: videoData.data.moreInformation || '',
                supportingMaterials: videoData.data.supportingMaterials || [],
            });
        }
    }, [videoData, form]);

    const onFinish = async (values) => {
        const valueWithStt = { ...values, stt: videoData.data.stt };
        try {
            await updateVideo({ videoId: lessonId, body: valueWithStt }).unwrap();
            message.success('Cập nhật video thành công!');
            handleCloseEditModal();
            refetch();
        } catch (error) {
            console.error(error);
            message.error('Cập nhật video thất bại, vui lòng kiểm tra lại!');
        }
    };

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link', 'image', 'video'],
            [{ 'color': [] }, { 'background': [] }]
        ],
    };

    const formats = [
        'header', 'bold', 'italic', 'underline', 'strike', 'list', 'link', 'image', 'video', 'color', 'background'
    ];

    if (isloadingData) {
        return (
            <div>
                <Spin tip="Loading" size="large">
                    Đợi một xíu nha
                </Spin>
            </div>
        );
    }

    return (
        <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item
                name="videoName"
                label="Tên Video"
                rules={[{ required: true, message: 'Vui lòng nhập tên video!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="lessonVideo"
                label="Liên kết Video"
                rules={[{ required: true, message: 'Vui lòng nhập liên kết video!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="duration"
                label="Thời gian (phút)"
                rules={[{ required: true, message: 'Vui lòng nhập thời gian!' }]}
            >
                <InputNumber min={0} />
            </Form.Item>

            <Form.Item
                name="moreInformation"
                label="Thông tin thêm"
            >
                <ReactQuill
                    modules={modules}
                    formats={formats}
                    style={{
                        maxHeight: '180px',
                        backgroundColor: 'white',
                        border: '1px solid #d1d1d1',
                    }}
                    theme="snow"
                    placeholder="Thông tin thêm về khóa học"
                    onChange={(content) => form.setFieldsValue({ moreInformation: content })}
                />
            </Form.Item>

            <Form.List name="supportingMaterials">
                {(fields, { add, remove }) => (
                    <>
                        {fields.map(({ key, name, fieldKey, ...restField }) => (
                            <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                <Form.Item
                                    {...restField}
                                    name={[name]}
                                    fieldKey={[fieldKey]}
                                    rules={[{ required: true, message: 'Vui lòng nhập tài liệu hỗ trợ!' }]}
                                >
                                    <Input placeholder="Nhập tài liệu hỗ trợ" />
                                </Form.Item>
                                <MinusCircleOutlined onClick={() => remove(name)} />
                            </Space>
                        ))}
                        <Form.Item>
                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                Thêm tài liệu hỗ trợ
                            </Button>
                        </Form.Item>
                    </>
                )}
            </Form.List>

            <Form.Item>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button icon={<EditFilled />} size='large' type="primary" htmlType="submit" loading={isLoading}>
                        Cập nhật bài học
                    </Button>
                </div>
            </Form.Item>
        </Form>
    );
};

export default EditVideo;
