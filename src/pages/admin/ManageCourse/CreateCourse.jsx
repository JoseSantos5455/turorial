import React from 'react';
import { Button, Form, Input, InputNumber, Upload, Space, message } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import ReactQuill from 'react-quill'; // Import ReactQuill
import 'react-quill/dist/quill.snow.css'; // Import ReactQuill styles
import { useCreateCourseMutation } from '../../../services/coursesAPI';
import { useNavigate } from 'react-router-dom';


const CreateCourse = () => {
    const [form] = Form.useForm();
    const [createCourse, { isLoading, isSuccess }] = useCreateCourseMutation();
    const navigate = useNavigate();
    const handleSubmit = async (values) => {
        // gắn tạm thời chờ API 
        values.image = 'https://service.keyframe.vn/uploads/filecloud/2018/April/25/72-559201524659628-1524659628.jpg';

        try {
            await createCourse(values).unwrap();
            message.success('Khóa học đã được tạo thành công!');
            form.resetFields();
            navigate('/admin/videos', { state: { reload: true } });
        } catch (error) {
            message.error('Đã xảy ra lỗi khi tạo khóa học!');
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
        <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }} >
            {/* <h1>Tạo Khóa Học</h1> */}
            <Form
            
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{
                    courseName: '',
                    moreInformation: '',
                    description: '',
                    image: '',
                    introductionVideoUrl: '',
                    totalDuration: 0,
                    totalChapter: 0,
                    totalVideos: 0,
                    price: 0,
                    rating: 0,
                }}
            >
                {/* Tên Khóa Học */}
                <Form.Item
                    label="Tên Khóa Học"
                    name="courseName"
                    rules={[{ required: true, message: 'Vui lòng nhập tên khóa học!' }]}
                >
                    <Input placeholder="Nhập tên khóa học" />
                </Form.Item>

                {/* Thông Tin Thêm */}
                <Form.Item
                    label="Thông Tin Thêm"
                    name="moreInformation"
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

                {/* Mô Tả */}
                <Form.Item
                    label="Mô Tả"
                    name="description"
                    rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
                >
                    <Input.TextArea rows={4} placeholder="Mô tả khóa học" />
                </Form.Item>

                {/* Tải Ảnh Lên */}
                <Form.Item
                    label="Ảnh Khóa Học"
                    name="image"
                    valuePropName="file"
                >
                    <Upload
                        name="image"
                        listType="picture-card"
                        maxCount={1}
                        beforeUpload={(file) => {
                            const isValid = file.type === 'image/jpeg' || file.type === 'image/png';
                            if (!isValid) {
                                message.error('Bạn chỉ có thể tải lên tệp JPG/PNG!');
                            }
                            return isValid ? false : Upload.LIST_IGNORE;
                        }}
                    >
                        <div>
                            <PlusOutlined />
                            <div style={{ marginTop: 8 }}>Tải Lên</div>
                        </div>
                    </Upload>
                </Form.Item>

                {/* URL Video Giới Thiệu */}
                <Form.Item
                    label="URL Video Giới Thiệu"
                    name="introductionVideoUrl"
                    rules={[{ required: true, message: 'Vui lòng nhập URL video giới thiệu!' }]}
                >
                    <Input placeholder="Nhập URL video" />
                </Form.Item>

                {/* Tổng Thời Gian */}
                <Form.Item
                    label="Tổng Thời Gian (giờ)"
                    name="totalDuration"
                    rules={[{ required: true, message: 'Vui lòng nhập tổng thời gian!' }]}
                >
                    <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>

                {/* Tổng Chương */}
                <Form.Item
                    label="Tổng Chương"
                    name="totalChapter"
                    rules={[{ required: true, message: 'Vui lòng nhập tổng số chương!' }]}
                >
                    <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>

                {/* Tổng Video */}
                <Form.Item
                    label="Tổng Video"
                    name="totalVideos"
                    rules={[{ required: true, message: 'Vui lòng nhập tổng số video!' }]}
                >
                    <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>

                {/* Giá */}
                <Form.Item
                    label="Giá (VND)"
                    name="price"
                    rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}
                >
                    <InputNumber min={0} style={{ width: '100%' }} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
                </Form.Item>

                {/* Đánh Giá */}
                <Form.Item
                    label="Đánh Giá"
                    name="rating"
                    rules={[{ required: true, message: 'Vui lòng nhập đánh giá!' }]}
                >
                    <InputNumber min={0} max={5} step={0.1} style={{ width: '100%' }} />
                </Form.Item>

                {/* Những gì bạn sẽ học */}
                <Form.Item label="Những gì bạn sẽ học">
                    <Form.List name="whatYouWillLearn">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, fieldKey, ...restField }) => (
                                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                        <Form.Item
                                            {...restField}
                                            name={[name]}
                                            fieldKey={[fieldKey]}
                                            rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}
                                        >
                                            <Input placeholder="Nhập nội dung" />
                                        </Form.Item>
                                        <MinusCircleOutlined onClick={() => remove(name)} />
                                    </Space>
                                ))}
                                <Form.Item>
                                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                        Thêm
                                    </Button>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>
                </Form.Item>

                {/* Yêu cầu để vượt qua */}
                <Form.Item label="Yêu cầu để vượt qua">
                    <Form.List name="requireToPass">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, fieldKey, ...restField }) => (
                                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                        <Form.Item
                                            {...restField}
                                            name={[name]}
                                            fieldKey={[fieldKey]}
                                            rules={[{ required: true, message: 'Vui lòng nhập yêu cầu!' }]}
                                        >
                                            <Input placeholder="Nhập yêu cầu" />
                                        </Form.Item>
                                        <MinusCircleOutlined onClick={() => remove(name)} />
                                    </Space>
                                ))}
                                <Form.Item>
                                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                        Thêm
                                    </Button>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>
                </Form.Item>

                {/* Chương */}
                <Form.Item label="Chương">
                    <Form.List name="chapters">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, fieldKey, ...restField }) => (
                                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'chapterName']}
                                            fieldKey={[fieldKey, 'chapterName']}
                                            rules={[{ required: true, message: 'Vui lòng nhập tên chương!' }]}
                                        >
                                            <Input placeholder="Nhập tên chương" />
                                        </Form.Item>
                                        <MinusCircleOutlined onClick={() => remove(name)} />
                                    </Space>
                                ))}
                                <Form.Item>
                                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                        Thêm Chương
                                    </Button>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>
                </Form.Item>

                {/* Nút Gửi */}
                <Form.Item>
                    <Button type="primary"
                        htmlType='submit'
                        className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-medium rounded-full py-5 px-6 transition-transform duration-800 hover:from-cyan-400 hover:to-blue-500 hover:scale-105 hover:shadow-cyan-200 hover:shadow-lg">
                        Tạo khóa học
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default CreateCourse;
