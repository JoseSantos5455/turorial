import { Button, Form, Input, message } from 'antd';
import React from 'react'
import { useCreateChapterMutation } from '../../../../services/coursesAPI';

const CreateChapter = ({ courseId, refetch, handleCloseModal }) => {
    const [form] = Form.useForm();
    const [createChapter, { isLoading }] = useCreateChapterMutation();

    const onFinish = async (values) => {

        try {
            await createChapter({ courseId, body: values }).unwrap();
            message.success('Tạo chương thành công!');
            form.resetFields();
            refetch();
            handleCloseModal();
        } catch (error) {
            message.error('Tạo chương thất bại, vui lòng kiểm tra lại!');
        }
    };


    return (
        <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item
                name="chapterName"
                label="Tên Chương"
                rules={[{ required: true, message: 'Vui lòng nhập tên chương!' }]}
            >
                <Input placeholder="Nhập tên chương" />
            </Form.Item>

            <Form.Item>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button size="large" type="primary" htmlType="submit" loading={isLoading}>
                        Tạo chương
                    </Button>
                </div>
            </Form.Item>
        </Form>
    );
}

export default CreateChapter