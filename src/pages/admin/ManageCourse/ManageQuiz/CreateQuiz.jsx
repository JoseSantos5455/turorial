import React from 'react';
import { Form, Input, Button, Space, Select, InputNumber, Card, Empty, message } from 'antd';
import { DeleteFilled, DeleteOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useCreateCourseQuizMutation } from '../../../../services/coursesAPI';


const { Option } = Select;

const CreateQuiz = ({ lessonId, refetch, handleCloseModal, stt }) => {
    const [form] = Form.useForm();
    const [createQuizs, { isLoading }] = useCreateCourseQuizMutation();

    const indexToAlpha = (index) => String.fromCharCode(97 + index);

    const onFinish = async (values) => {
        const valuesToSubmit = { ...values, stt: stt, lesson_id: lessonId };
        try {
            const rs = createQuizs(valuesToSubmit);
            console.log(rs)
            message.success('Tạo quiz thành công!');
            handleCloseModal();
            form.resetFields();
            refetch();
        } catch (error) {
            message.error('Tạo quiz thất bại. Vui lòng thử lại.');
        }
    };

    return (
        <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false}>
            {/* Tên quiz */}
            <Form.Item
                name="title"
                label="Tiêu đề Quiz"
                rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="expiration-time"
                label="Thời gian (phút)"
                rules={[{ required: true, message: 'Vui lòng nhập thời gian!' }]}
            >
                <InputNumber />
            </Form.Item>

            {/* Danh sách câu hỏi */}
            <Form.List name="questions" initialValue={[{}]}>
                {(fields, { add, remove }) => (
                    <>
                        {fields.length === 0 ? (
                            <Empty description="Chưa có câu hỏi" />
                        ) : (
                            <Card>
                                {fields.map(({ key, name, fieldKey, ...restField }) => (

                                    <div key={key} className='flex flex-col'>
                                        {/* Câu hỏi */}
                                        <Form.Item

                                            {...restField}
                                            name={[name, 'text']}
                                            fieldKey={[fieldKey, 'text']}
                                            label={<p className='bg-blue-600 px-4 text-white rounded-lg py-1'>Câu hỏi số {name + 1}</p>}
                                            rules={[{ required: true, message: 'Vui lòng nhập nội dung câu hỏi!' }]}
                                        >
                                            <Input placeholder="Nhập câu hỏi" size='large' className='w-[50%] mt-4' />
                                        </Form.Item>

                                        {/* Đáp án */}
                                        <Form.List name={[name, 'answers']}>
                                            {(answerFields, { add: addAnswer, remove: removeAnswer }) => (
                                                <>
                                                    {answerFields.map(({ key: answerKey, name: answerName, fieldKey: answerFieldKey, ...restAnswerField }, index) => (
                                                        <Space key={answerKey} style={{ display: 'flex', flexDirection: 'row', marginBottom: 8, flexWrap: 'wrap', width: '100%' }} align="baseline">
                                                            <Form.Item
                                                                {...restAnswerField}
                                                                name={[answerName]}
                                                                fieldKey={[answerFieldKey]}
                                                                label={`Đáp án ${indexToAlpha(index).toUpperCase()}`}
                                                                rules={[{ required: true, message: 'Vui lòng nhập đáp án!' }]}
                                                                style={{ flex: '1 1 45%', marginRight: '5%' }}
                                                            >
                                                                <Input placeholder="Nhập đáp án" />
                                                            </Form.Item>
                                                            <div> <button className='bg-red-500 py-2 px-2 rounded-lg transform hover:scale-105' onClick={() => removeAnswer(answerName)}> <DeleteFilled style={{ color: 'white', fontSize: '17px' }} /></button></div>
                                                        </Space>
                                                    ))}
                                                    <Form.Item>
                                                        <Button type="dashed" onClick={() => addAnswer()} block icon={<PlusOutlined />}>
                                                            Thêm đáp án
                                                        </Button>
                                                    </Form.Item>
                                                </>
                                            )}
                                        </Form.List>

                                        {/* Chọn đáp án đúng */}
                                        <Form.Item
                                            shouldUpdate={(prevValues, currentValues) =>
                                                prevValues?.questions?.[name]?.answers !== currentValues?.questions?.[name]?.answers
                                            }
                                        >
                                            {() => {
                                                const answers = form.getFieldValue(['questions', name, 'answers']) || [];
                                                return (
                                                    <Form.Item
                                                        className='w-[30%]'
                                                        name={[name, 'correctAnswer']}
                                                        label="Chọn đáp án đúng"
                                                        rules={[{ required: true, message: 'Vui lòng chọn đáp án đúng!' }]}
                                                    >
                                                        <Select placeholder="Chọn đáp án đúng">
                                                            {answers.map((_, index) => (
                                                                <Option key={index} value={indexToAlpha(index)}>
                                                                    Đáp án {indexToAlpha(index).toUpperCase()}
                                                                </Option>
                                                            ))}
                                                        </Select>
                                                    </Form.Item>
                                                );
                                            }}
                                        </Form.Item>
                                        <div className='flex justify-start mb-10'>
                                            <button onClick={() => remove(name)} className='w-[20%] bg-red-600 hover:bg-red-500 hover:shadow-lg py-1 rounded-lg text-white transform hover:scale-105 transition-transform' type='button'>
                                                Xóa câu hỏi <DeleteOutlined className='pl-1' />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </Card>
                        )}
                        <Form.Item>
                            <Button type="dashed" className='mt-5' onClick={() => add()} block icon={<PlusOutlined />}>
                                Thêm câu hỏi
                            </Button>
                        </Form.Item>

                    </>
                )}
            </Form.List>

            <Form.Item
        shouldUpdate={(prevValues, currentValues) => prevValues.questions !== currentValues.questions}
        rules={[{ validator: (_, value) => (value && value.length > 0 ? Promise.resolve() : Promise.reject('Phải có ít nhất một câu hỏi!')) }]} // Validation rule
    >
        {() => (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Button type="primary" htmlType="submit" loading={isLoading}>
                    Tạo Kiểm tra
                </Button>
            </div>
        )}
    </Form.Item>
        </Form>
    );
};

export default CreateQuiz;
