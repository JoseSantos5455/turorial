import React, { useState } from 'react';
import { Button, Form, Input, InputNumber, Upload, Space, message, Checkbox } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import ReactQuill from 'react-quill'; // Import ReactQuill
import 'react-quill/dist/quill.snow.css'; // Import ReactQuill styles
import { useCreateCourseMutation, useUpdateCourseImageMutation } from '../../../services/coursesAPI';
import { useNavigate } from 'react-router-dom';


const CreateCourse = () => {
    const [form] = Form.useForm();
    const [createCourse, { isLoading, isSuccess }] = useCreateCourseMutation();
    const [updateCourseImage, { isLoading: isLoadingUpdate }] = useUpdateCourseImageMutation();
    const navigate = useNavigate();
    const [imgURL, setImageURL] = useState(null)

    const handleSubmit = async (values) => {
        // Set price based on free or paid selection
        values.price = values.price ? 0 : 1;
        values.rating = 0;
        values.image = imgURL;
        try {
            await createCourse(values).unwrap();
            message.success('Khóa học đã được tạo thành công!');
            form.resetFields();
            navigate('/admin/courses', { state: { reload: true } });
        } catch (error) {
            message.error('Đã xảy ra lỗi khi tạo khóa học!');
        }
    };



    const handleUpload = async (file) => {
        try {
            const rs = await updateCourseImage(file)
            setImageURL(rs.error.data)
            message.success("Tải ảnh lên thành công !")
        } catch (error) {
            message.error('Đã xảy ra lỗi khi upload ảnh!');
        }
    }

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
        <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }} >
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
                    isFree: true, // Default to free
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

                {/* Free or Paid */}
                <Form.Item
                    name="price"
                    valuePropName="checked"
                >
                    <Checkbox>Miễn phí</Checkbox>
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

                <Upload
                    className='mb-5'
                    name="image"
                    listType="picture-card"
                    maxCount={1}
                    disabled={isLoadingUpdate}
                    beforeUpload={(file) => {
                        const isValid = file.type === 'image/jpeg' || file.type === 'image/png';
                        if (!isValid) {
                            message.error('Bạn chỉ có thể tải lên tệp JPG/PNG!');
                            return Upload.LIST_IGNORE;
                        }
                        handleUpload(file);
                        return false;
                    }}
                >
                    <div>
                        <PlusOutlined />
                        <div style={{ marginTop: 8 }}>Tải Lên</div>
                    </div>
                </Upload>


                {/* URL Video Giới Thiệu */}
                <Form.Item
                    label="URL Video Giới Thiệu"
                    name="introductionVideoUrl"
                    rules={[{ required: true, message: 'Vui lòng nhập URL video giới thiệu!' }]}
                >
                    <Input placeholder="Nhập URL video" />
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
                                {fields.map(({ key, name, fieldKey, ...restField }, index) => (
                                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'stt']}
                                            fieldKey={[fieldKey, 'stt']}
                                            initialValue={index + 1}
                                        >
                                            <InputNumber min={1} disabled />
                                        </Form.Item>
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
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Button type="primary"
                            htmlType='submit'
                            disabled={isLoadingUpdate}
                            loading={isLoading}
                            className="bg-gradient-to-r w-[50%] from-blue-500 to-cyan-400 text-white font-medium rounded-full py-5 px-6 transition-transform duration-800 hover:from-cyan-400 hover:to-blue-500 hover:scale-105 hover:shadow-cyan-200 hover:shadow-lg">
                            Tạo khóa học
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </div>
    );
};

export default CreateCourse;
