import { Button, Form, Input, message, Skeleton } from 'antd';
import React, { useEffect } from 'react';
import { useEditChapterMutation, useGetChapterDetailsQuery } from '../../../../services/coursesAPI';

const EditChapter = ({ chapterId, refetch, handleCloseModal }) => {
  const [form] = Form.useForm();
  const { data: chapterData, isLoading: loadingChapter } = useGetChapterDetailsQuery(chapterId);

  const [editChapter, { isLoading }] = useEditChapterMutation();

  // Set initial values with existing chapter data for editing
  useEffect(() => {
    if (chapterData) {
      form.setFieldsValue({
        chapterName: chapterData.data.chapterName,
      });
    }
  }, [chapterData, form]);

  const onFinish = async (values) => {
  
    try {
      // Editing the existing chapter
      values.stt= chapterData.data.stt
      await editChapter({ chapterId: chapterId, body: values }).unwrap();
      message.success('Chỉnh sửa chương thành công!');
      form.resetFields();
      refetch();
      handleCloseModal();
    } catch (error) {
      message.error('Chỉnh sửa chương thất bại, vui lòng kiểm tra lại!');
    }
  };

  if (loadingChapter) {
    return (
      <div className='flex'>
        <Skeleton />
      </div>
    )
  }

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
          <Button
            size="large"
            type="primary"
            htmlType="submit"
            loading={isLoading}
          >
            Chỉnh sửa chương 
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
};

export default EditChapter;
