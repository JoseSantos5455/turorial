import React, { useState, useEffect, useRef } from 'react';
import { useGetQuizDetailsQuery, useCheckAnswerMutation } from '../../services/coursesAPI';
import { Card, Radio, Alert, Row, Col, Form, Button, Skeleton, message, Modal, Tag, ConfigProvider } from 'antd';
import { DeleteFilled, FlagFilled, FlagOutlined, SnippetsOutlined } from '@ant-design/icons';

const QuestionDisplay = ({ quizz }) => {
    const { data: QuizzDetail, isLoading: isQuizzLoading, error: quizzError } = useGetQuizDetailsQuery(1);
    const [checkAnswer, { data: scoreData, isLoading: isCheckLoading }] = useCheckAnswerMutation();
    const [form] = Form.useForm();
    const [score, setScore] = useState(null);
    const [timeLeft, setTimeLeft] = useState(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [quizStarted, setQuizStarted] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [markedQuestions, setMarkedQuestions] = useState([]); // Danh sách câu hỏi được đánh dấu
    const [flagQuestions, setFlagQuestions] = useState([]); // Danh sách câu hỏi được đánh dấu
    const [selectedQuestions, setSelectedQuestions] = useState({}); // Trạng thái câu hỏi đã chọn
    const optionMap = ["a", "b", "c", "d"];
    let timer;
    const timerRef = useRef(null);

    useEffect(() => {
        if (quizStarted && QuizzDetail?.expiration_time) {
            const expirationTimeInMinutes = QuizzDetail.expiration_time;
            const expirationTimeInSeconds = expirationTimeInMinutes * 60;
            setTimeLeft(expirationTimeInSeconds);

            timerRef.current = setInterval(() => {
                setTimeLeft(prevTime => {
                    if (prevTime <= 1) {
                        clearInterval(timerRef.current);
                        setIsSubmitted(true);
                        form.submit();
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);
        } else {
            clearInterval(timerRef.current);
        }

        return () => clearInterval(timerRef.current);
    }, [quizStarted, QuizzDetail, form]);

    const handleRetryQuiz = () => {
        setScore(null);
        setIsSubmitted(false);
        setElapsedTime(0);
        setQuizStarted(false);
        form.resetFields();
        setTimeLeft(null);
        setMarkedQuestions([]);
        setSelectedQuestions({});
        setFlagQuestions([])
        clearInterval(timerRef.current);
    };

    const onFinish = async (values) => {
        if (isSubmitted) return;

        Modal.confirm({
            title: 'Xác nhận nộp bài',
            content: 'Bạn có chắc chắn muốn nộp bài?',
            okText: 'Có',
            okType: 'danger',
            cancelText: 'Không',
            onOk: async () => {
                setIsSubmitted(true);
                clearInterval(timerRef.current);

                const formattedAnswers = Object.keys(values).reduce((acc, key) => {
                    const questionId = key.split('_')[1];
                    const selectedOptionIndex = values[key];
                    acc[questionId] = optionMap[selectedOptionIndex];
                    return acc;
                }, {});

                const body = {
                    "answers": formattedAnswers,
                    "quiz-id": 1
                };

                try {
                    const result = await checkAnswer(body).unwrap();
                    setScore(result.score);
                    if (!result.pass) {
                        message.error(`Bạn đã đạt được ${result.score} điểm! Bạn không vượt qua!`);
                    } else {
                        message.success(`Bạn đã đạt được ${result.score} điểm! Bạn đã vượt qua!`);
                    }
                } catch (error) {
                    message.error('Đã xảy ra lỗi khi kiểm tra câu trả lời!');
                }

                const totalTimeUsed = (QuizzDetail?.expiration_time * 60) - timeLeft;
                setElapsedTime(totalTimeUsed);
            },
        });
    };

    const clearAnswer = (questionId) => {
        form.resetFields([`question_${questionId}`]);
        setSelectedQuestions(prev => ({ ...prev, [questionId]: false }));
    };

    const handleMarkQuestion = (questionId) => {
        setMarkedQuestions(prev =>
            prev.includes(questionId) ? prev.filter(id => id !== questionId) : [...prev, questionId]
        );
    };

    const handleClearFlagQuestion = (questionId) => {
        setFlagQuestions(prev => ({ ...prev, [questionId]: false }));
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    if (isQuizzLoading) return <Skeleton />;
    if (quizzError) return <Alert message="Error" description="Error loading quiz details" type="error" showIcon />;

    return (
        <Card title={`Quiz: ${quizz.quizName}`} className="question-display">
            <div className="flex justify-between items-center sticky top-20 bg-white z-10 shadow-md py-2">
                <div className="ml-5">
                    <p>Số lượng câu hỏi:<span className='font-bold'> {QuizzDetail?.questions?.length}</span></p>
                    <p>Điều kiện vượt qua:<span className='font-bold'> trên 80% điểm</span></p>
                    {score && <p>Điểm của bạn: <span className='text-red-500 font-bold text-lg'>{score}</span></p>}
                </div>
                {!isSubmitted && (
                    <p className={`px-4 py-2 rounded-lg font-bold ${quizStarted ? 'text-red-500' : 'text-black'}`}>
                        Thời gian: {timeLeft !== null ? formatTime(timeLeft) : formatTime(QuizzDetail?.expiration_time * 60)}
                    </p>
                )}
            </div>



            {
                quizStarted && (
                    <Form form={form} onFinish={onFinish}>
                        {QuizzDetail.questions.map((question, index) => (
                            <Card type="inner" title={<p>Câu {index + 1}: {question.text}</p>} key={question.id} className="mt-4 w-full">
                                <Form.Item className="w-full" name={`question_${question.id}`}>
                                    <Radio.Group onChange={() => setSelectedQuestions(prev => ({ ...prev, [question.id]: true }))}>
                                        <Row className="gap-6" justify={'space-between'} gutter={[16, 16]}>
                                            {question?.answers?.map((option, index) => (
                                                <Col span={12} key={index}>
                                                    <Radio value={index}>
                                                        {option}
                                                    </Radio>
                                                </Col>
                                            ))}
                                        </Row>
                                    </Radio.Group>
                                </Form.Item>
                                <div className='flex justify-between w-full'>
                                    {selectedQuestions[question.id] ?
                                        <Button type="primary" className='mr-4' icon={<DeleteFilled />} onClick={() => clearAnswer(question.id)}>Xóa câu trả lời</Button>
                                        :
                                        <p></p>
                                    }
                                    {!flagQuestions[question.id] ?
                                        <Button type="link" style={{ color: 'black' }} icon={<FlagFilled style={{ color: 'gray', fontSize: '20px' }} />} onClick={() => setFlagQuestions(prev => ({ ...prev, [question.id]: true }))}></Button>
                                        :
                                        <Button type="link" style={{ color: 'black' }} icon={<FlagFilled style={{ color: 'red', fontSize: '20px' }} />} onClick={() => handleClearFlagQuestion(question.id)}></Button>
                                    }
                                </div>
                            </Card>
                        ))}
                        {!isSubmitted && (
                            <>
                                {/* Hiển thị danh sách câu hỏi */}
                                <div className="mt-4">
                                    <ConfigProvider
                                        theme={{
                                            components: {
                                                Card: {
                                                    headerBg: '#c5e7ff'
                                                },
                                            },
                                        }}
                                    >
                                        <Card
                                            title={<div>Danh sách câu hỏi</div>}
                                            bordered
                                            dataSource={QuizzDetail?.questions}
                                            className='w-full'
                                        >
                                            <div className='flex gap-5 w-full flex-wrap'>
                                                {QuizzDetail.questions.map((question, index) => (
                                                    <div
                                                        className={`w-fit  ${selectedQuestions[question.id] ? 'bg-cyan-400' : 'bg-gray-200'} shadow-md rounded-md flex flex-col items-center`}
                                                    >
                                                        <p className={`${selectedQuestions[question.id] ? "text-white" : ""} text-white bg-cyan-700 px-2 text-[13px]`}>Câu {index + 1}</p>
                                                        <hr />
                                                        <div className={`  flex flex-col text-sm py-1`}>
                                                            {!flagQuestions[question.id] ? <FlagFilled style={{ color: 'white', opacity: '0' }} /> : <FlagFilled style={{ color: 'red' }} />}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                        </Card>
                                    </ConfigProvider>


                                </div>
                                <Form.Item className='w-full flex justify-center'>
                                    <button
                                        type="submit"
                                        className=" mt-6 bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-medium rounded-full py-3 px-14 transition-transform duration-800 hover:from-cyan-400 hover:to-blue-500 hover:scale-105 hover:shadow-cyan-200 hover:shadow-lg"
                                        disabled={isCheckLoading || timeLeft <= 0}
                                    >
                                        {isCheckLoading ? 'Đang nộp bài...' : 'Nộp bài'}
                                    </button>
                                </Form.Item>
                            </>
                        )}
                    </Form>
                )
            }

            {
                !quizStarted && (
                    <Button
                        type="primary"
                        onClick={() => setQuizStarted(true)}
                        className="mb-4 mt-9"
                        icon={<SnippetsOutlined />}
                    >
                        Bắt đầu làm bài
                    </Button>
                )
            }

            {
                score !== null && (
                    <>
                        <Alert
                            message={`Điểm của bạn: ${score}`}
                            description={`Thời gian bạn đã làm: ${formatTime(elapsedTime)}`}
                            type={scoreData?.pass ? 'success' : 'warning'}
                            showIcon
                            className="mt-4"
                        />
                        <Button type="primary" onClick={handleRetryQuiz} className="mt-4">
                            Làm bài lại
                        </Button>
                    </>
                )
            }
        </Card >
    );
};

export default QuestionDisplay;
