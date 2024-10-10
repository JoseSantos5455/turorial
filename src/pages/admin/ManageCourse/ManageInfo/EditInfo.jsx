import React, { useEffect } from 'react';
import { Form, Input, Button, message, Spin } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import { useEditInfoMutation, useGetInfoDetailsQuery } from '../../../../services/coursesAPI';

const EditInfo = ({ lessonId, refetch, handleCloseEditModal }) => {
    const [form] = Form.useForm();
    const { data: infoDetail, isLoading: loadingInfo } = useGetInfoDetailsQuery(lessonId);
    const [editInfo, { isLoading: updating }] = useEditInfoMutation();

    useEffect(() => {
        if (infoDetail) {
            form.setFieldsValue({
                infoTitle: infoDetail.data.infoTitle,
                content: infoDetail.data.content,
            });
        }
    }, [infoDetail, form]);

    const onFinish = async (values) => {
        const valueWithStt = { ...values, stt: infoDetail.data.stt };
        try {
            await editInfo({ body: valueWithStt, infoId: lessonId }).unwrap();
            message.success('Chỉnh sửa thông tin thành công!');
            handleCloseEditModal();
            refetch();
        } catch (error) {
            message.error('Chỉnh sửa thông tin thất bại, vui lòng kiểm tra lại!');
        }
    };


    if (loadingInfo) {
        return (
            <div>
                <Spin tip="Loading" size="large">
                    Đợi một xíu nha
                </Spin>
            </div>
        );
    }

    return (
        <Form form={form} layout="vertical" onFinish={onFinish} initialValues={infoDetail}>
            <Form.Item
                name="infoTitle"
                label="Tiêu đề thông tin"
                // rules={[{ required: true, message: 'Vui lòng nhập tiêu đề thông tin!' }]}
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
                        maxHeight: '180px',
                        backgroundColor: 'white',
                        border: '1px solid #d1d1d1',
                    }}
                    theme="snow"
                    placeholder="Nhập nội dung"
                    onChange={(content) => form.setFieldsValue({ content })}
                />
            </Form.Item>

            <Form.Item>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button
                        icon={<PlusOutlined />}
                        size="large"
                        type="primary"
                        htmlType="submit"
                        loading={updating}
                    >
                        Lưu chỉnh sửa
                    </Button>
                </div>
            </Form.Item>
        </Form>
    );
};

export default EditInfo;
