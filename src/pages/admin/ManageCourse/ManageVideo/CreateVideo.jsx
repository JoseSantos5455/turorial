import React, { useState } from 'react';
import { Form, Input, Button, InputNumber, Space, message } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import { useCreateCourseVideoMutation } from '../../../../services/coursesAPI';


const CreateVideo = ({ stt, lessonId, refetch, handleCloseModal }) => {

    const [form] = Form.useForm();
    const [createVideo, { isLoading }] = useCreateCourseVideoMutation();

    // Add a state to store video duration
    const [videoDuration, setVideoDuration] = useState(null);

    const fetchVideoDuration = async (videoUrl) => {
        const videoId = videoUrl.split('v=')[1];
        const apiKey = 'AIzaSyBDb42Mqm7ZbRyzq6iUVUMJV7fo1qhoYK4';
        const url = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=contentDetails&key=${apiKey}`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            console.log(data)
            if (data.items && data.items.length > 0) {
                const duration = data.items[0].contentDetails.duration;
                const durationInMinutes = convertDurationToMinutes(duration);
                setVideoDuration(durationInMinutes);
                form.setFieldsValue({ duration: durationInMinutes });
            } else {
                console.error('No video data found');
            }
        } catch (error) {
            console.error('Failed to fetch video duration:', error);
        }
    };
    const handleDisplayTime = (time) => {
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor((time % 3600) / 60);
        const seconds = time % 60;

        return (
            <span>
                {hours > 0 && `${hours} giờ `}
                {minutes > 0 && `${minutes} phút `}
                {seconds > 0 && `${seconds} giây`}
            </span>
        );
    }
    const convertDurationToMinutes = (duration) => {
        const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
        const hours = (parseInt(match[1]) || 0);
        const minutes = (parseInt(match[2]) || 0);
        const seconds = (parseInt(match[3]) || 0);
        return hours * 3600 + minutes * 60 + seconds;
    };

    const onFinish = async (values) => {

        const valuesToSubmit = {
            ...values,
            stt: stt,
            moreInformation: values.moreInformation || ""
        };

        try {
            await createVideo({ body: valuesToSubmit, lessonId: lessonId }).unwrap();
            message.success('Tạo bài học thành công !')
            handleCloseModal();
            form.resetFields();
            refetch();
        } catch (error) {

            message.error('Tạo bài học thất bại vui lòng kiểm tra lại !')

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
                <Input onBlur={(e) => fetchVideoDuration(e.target.value)} />
            </Form.Item>
            <Form.Item
                name="duration"
                label="Thời gian"
                rules={[{ required: true, message: 'Vui lòng nhập thời gian!' }]}
            >
                <span className='ml-2 bg-slate-100 p-2 rounded-sm'>{handleDisplayTime(videoDuration)}</span>
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
                    <Button icon={<PlusOutlined />} size='large' type="primary" htmlType="submit" loading={isLoading}>
                        Tạo bài học
                    </Button>
                </div>
            </Form.Item>
        </Form>
    );
}

export default CreateVideo;
