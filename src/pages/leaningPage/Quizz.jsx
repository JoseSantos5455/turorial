import React, { useState, useEffect, useRef } from 'react';
import { useGetQuizDetailsQuery, useCheckAnswerMutation } from '../../services/coursesAPI';
import { Card, Radio, Alert, Row, Col, Form, Button, Skeleton, message, Modal, Tag, ConfigProvider } from 'antd';
import { DeleteFilled, FlagFilled, FlagOutlined, SnippetsOutlined } from '@ant-design/icons';

const QuestionDisplay = ({ quizz, setIsQuizStart }) => {
    console.log(quizz)
    const { data: QuizzDetail, isLoading: isQuizzLoading, error: quizzError } = useGetQuizDetailsQuery(quizz?.id);
    const [checkAnswer, { data: scoreData, isLoading: isCheckLoading }] = useCheckAnswerMutation();
    const [form] = Form.useForm();
    const [score, setScore] = useState(null);
    const [timeLeft, setTimeLeft] = useState(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [quizStarted, setQuizStarted] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [markedQuestions, setMarkedQuestions] = useState([]);
    const [flagQuestions, setFlagQuestions] = useState([]);
    const [selectedQuestions, setSelectedQuestions] = useState({});
    const optionMap = ["a", "b", "c", "d"];
    let timer;
    const timerRef = useRef(null);
    const questionRefs = useRef({});

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

    const handleStartQuiz = () => {
        setQuizStarted(true)
        setIsQuizStart(true)
    }

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

    const handleSubmit = async (values) => {
        setIsQuizStart(false)
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
            "quiz-id": quizz.id
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
    }

    const onFinish = async (values) => {
        if (isSubmitted) return;

        Modal.confirm({
            title: 'Xác nhận nộp bài',
            content: (
                <>
                    {QuizzDetail?.questions?.length - Object.keys(selectedQuestions).length > 0 && (
                        <p>Vẫn còn <span className='font-bold text-red-600'>{QuizzDetail?.questions?.length - Object.keys(selectedQuestions).length}</span> câu hỏi chưa trả lời</p>
                    )}
                    Bạn có chắc chắn muốn nộp bài?
                </>
            ),
            okText: 'Có',
            okType: 'danger',
            cancelText: 'Không',
            onOk: async () => {
                handleSubmit(values)
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

    const scrollToQuestion = (questionId) => {
        questionRefs.current[questionId]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    if (isQuizzLoading) return <Skeleton />;
    if (quizzError) return <Alert message="Error" description="Error loading quiz details" type="error" showIcon />;

    return (
        <Card title={`Quiz: ${quizz.title}`} className="question-display">
            <div className="flex justify-between items-center sticky top-20 bg-white z-10 shadow-md py-2">
                <div className="ml-5">
                    <p>Số lượng câu hỏi:<span className='font-bold'> {QuizzDetail?.questions?.length}</span></p>
                    <p>Điều kiện vượt qua:<span className='font-bold'> ít nhất 80 điểm</span></p>
                    {score ? <p className='mt-2'>Điểm của bạn: <span className={`${score >= 80 ? "text-green-500" : "text-red-500"}  font-bold text-lg`}>{score} / 100</span></p> : ""}
                </div>
                {!isSubmitted && (
                    <p className={`px-4 py-2 rounded-lg text-[16px] font-bold ${quizStarted ? timeLeft <= 10 ? 'text-red-500' : 'text-green-600' : 'text-black'}`}>
                        Thời gian: {timeLeft !== null ? formatTime(timeLeft) : formatTime(QuizzDetail?.expiration_time * 60)}
                    </p>
                )}
            </div>



            {
                quizStarted && (
                    <Form form={form} onFinish={onFinish}>
                        {QuizzDetail.questions.map((question, index) => (
                            <Card
                                type="inner"
                                title={<p>Câu {index + 1}: {question.text}</p>}
                                key={question.id}
                                className="mt-4 w-full"
                                ref={el => questionRefs.current[question.id] = el}
                            >
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
                                                        key={question.id}
                                                        className={`w-fit ${selectedQuestions[question.id] ? 'bg-green-300' : 'bg-gray-100'} shadow-md rounded-md flex flex-col items-center cursor-pointer`}
                                                        onClick={() => scrollToQuestion(question.id)}
                                                    >
                                                        <p className={`${selectedQuestions[question.id] ? "text-white" : ""} text-white rounded-t-md  bg-green-700 px-2 text-[13px]`}>Câu {index + 1}</p>
                                                        <hr />
                                                        <div className={`flex flex-col text-sm py-1`}>
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
                        onClick={handleStartQuiz}
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
                            message={<span>Điểm của bạn: {score}</span>}
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
