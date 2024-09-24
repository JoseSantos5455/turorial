import React from 'react';
import { useGetQuizzDetailQuery } from '../../services/coursesAPI';
import { Card, Radio, Spin, Alert, Row, Col, Form, Button, ConfigProvider, Skeleton } from 'antd';

const QuestionDisplay = ({ quizz }) => {
    const { data: QuizzDetail, isLoading: isQuizzLoading, error: quizzError } = useGetQuizzDetailQuery(quizz.quizId);
    const [form] = Form.useForm(); 

    const onFinish = (values) => {
        console.log('Received values of form: ', values); // Xử lý giá trị form tại đây, thay thế console.log bằng hàm gửi API
    };

    if (isQuizzLoading) return <Skeleton />;
    if (quizzError) return <Alert message="Error" description="Error loading quiz details" type="error" showIcon />;

    return (
        
            <Card title={`Quiz: ${quizz.quizName}`} className="question-display">
                <Form form={form} onFinish={onFinish}>
                    {QuizzDetail.questions.map((question) => (
                        <Card type="inner" title={question.questionText} key={question.questionId} className="mt-4">
                            <Form.Item
                                name={`question_${question.questionId}`}
                                rules={[{ required: true, message: 'Please select an option!' }]} // Rule to make the field required
                            >
                                <Radio.Group>
                                    <Row gutter={[16, 16]}>
                                        {question.options.map((option, index) => (
                                            <Col span={12} key={option.optionId}>
                                                <Radio value={option.optionId}>
                                                    {option.optionText}
                                                </Radio>
                                            </Col>
                                        ))}
                                    </Row>
                                </Radio.Group>
                            </Form.Item>
                        </Card>
                    ))}
                    <Form.Item>
                        <button
                            type='submit'
                            className="
                        mt-6
                        bg-gradient-to-r 
                        from-blue-500 to-cyan-400 text-white 
                        font-medium rounded-full py-2 px-6 transition-transform duration-800
                         hover:from-cyan-400 hover:to-blue-500 hover:scale-105 hover:shadow-cyan-200 hover:shadow-lg"
                        >
                            Submit Answers
                        </button>
                    </Form.Item>
                </Form>
            </Card>

    );
};

export default QuestionDisplay;