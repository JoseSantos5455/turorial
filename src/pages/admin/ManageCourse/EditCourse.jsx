import React, { useEffect } from 'react';
import { Button, Form, Input, InputNumber, Upload, Space, message } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useEditCourseMutation, useGetCourseDetailQuery } from '../../../services/coursesAPI';

const EditCourse = ({ courseId, refetch, handleCloseModal }) => {
    const [form] = Form.useForm();

    // Fetch the course details
    const { data: course, isLoading: courseLoading, error: courseError } = useGetCourseDetailQuery({ courseId });
    const [updateCourse, { isLoading: updateLoading }] = useEditCourseMutation();

    useEffect(() => {
        if (course) {
            // Populate the form with existing course details
            form.setFieldsValue({
                courseName: course.data.courseName,
                moreInformation: course.data.moreInformation,
                description: course.data.description,
                image: course.data.image,
                introductionVideoUrl: course.data.introductionVideo,
                whatYouWillLearn: course.data.whatYouWillLearn || [],
                requireToPass: course.data.requireToPass || [],
                chapters: course.data.chapters || []
            });
        }
    }, [course, form]);

    const handleSubmit = async (values) => {
        values.rating = course.data.rating
        try {
            await updateCourse({ courseId: courseId, body: values }).unwrap();
            message.success('Khóa học đã được cập nhật thành công!');
            handleCloseModal();
            refetch();
        } catch (error) {
            message.error('Đã xảy ra lỗi khi cập nhật khóa học!');
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

    if (courseLoading) return <p>Loading...</p>;
    if (courseError) return <p>Error loading course data</p>;

    return (
        <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }} >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                <Form.Item
                    label="Tên Khóa Học"
                    name="courseName"
                    rules={[{ required: true, message: 'Vui lòng nhập tên khóa học!' }]}
                >
                    <Input placeholder="Nhập tên khóa học" />
                </Form.Item>

                <Form.Item
                    label="Thông Tin Thêm"
                    name="moreInformation"
                >
                    <ReactQuill
                        modules={modules}
                        formats={formats}
                        theme="snow"
                        style={{

                            backgroundColor: 'white',
                            border: '1px solid #d1d1d1',
                        }}
                        placeholder="Thông tin thêm về khóa học"
                        onChange={(content) => form.setFieldsValue({ moreInformation: content })}
                    />
                </Form.Item>

                <Form.Item
                    label="Mô Tả"
                    name="description"
                    rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
                >
                    <Input.TextArea rows={4} placeholder="Mô tả khóa học" />
                </Form.Item>

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

                <Form.Item
                    label="URL Video Giới Thiệu"
                    name="introductionVideoUrl"
                    rules={[{ required: true, message: 'Vui lòng nhập URL video giới thiệu!' }]}
                >
                    <Input placeholder="Nhập URL video" />
                </Form.Item>


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
                                    <Button type="dashed" onClick={() => add({ stt: fields.length + 1 })} block icon={<PlusOutlined />}>
                                        Thêm Chương
                                    </Button>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>
                </Form.Item>

                <Form.Item>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Button type="primary"
                            htmlType='submit'
                            loading={updateLoading}
                            className="bg-gradient-to-r w-[50%] from-blue-500 to-cyan-400 text-white font-medium rounded-full py-5 px-6 transition-transform duration-800 hover:from-cyan-400 hover:to-blue-500 hover:scale-105 hover:shadow-cyan-200 hover:shadow-lg">
                            Cập nhật khóa học
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </div>
    );
};

export default EditCourse;
