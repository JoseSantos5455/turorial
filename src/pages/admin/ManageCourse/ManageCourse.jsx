import React, { useState } from 'react';
import { Table, Input, Button, Space, Spin, Tooltip, Image, Tag, message, Modal, Collapse, ConfigProvider, Dropdown, Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { CaretRightOutlined, CloseOutlined, DeleteFilled, EditFilled, MoreOutlined, OpenAIFilled, OrderedListOutlined, PlusOutlined, SearchOutlined, SettingFilled } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { useCreateChapterMutation, useDeleteChapterMutation, useDeleteCourseMutation, useDeleteInfoLessonMutation, useDeleteQuizLessonMutation, useDeleteVideoLessonMutation, useGetAllCourseAdminQuery } from '../../../services/coursesAPI';
import clearFilter from '../../../assets/image/clear-filter.svg'
import './ManageCourse.scss'
import { handleDisplayTypeVideo } from '../../../utils/utils';
import VideoLesson from './ManageVideo/CreateVideo';
import InfoLesson from './ManageInfo/CreateInfo';
import QuizLesson from './ManageQuiz/CreateQuiz';
import EditVideo from './ManageVideo/EditVideo';
import EditInfo from './ManageInfo/EditInfo';
import EditQuiz from './ManageQuiz/EditQuiz';
import CreateChapter from './ManageChapter/CreateChapter';
import EditChapter from './ManageChapter/EditChapter';
import EditchapterPosition from './ManageChapter/EditchapterPosition';

const ManageCourse = () => {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [filteredInfo, setFilteredInfo] = useState({});
    const [sortedInfo, setSortedInfo] = useState({});
    const [isVisible, setIsVisible] = useState(false);
    const location = useLocation();
    const [deletingId, setDeletingId] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [lessonType, setLessonType] = useState('');
    const [stt, setStt] = useState(null)
    const [chapterId, setChapterId] = useState(null);
    const [lessonIdEdit, setLessonIdEdit] = useState(null);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isAddChapterModalVisible, setIsAddChapterModalVisible] = useState(false);
    const [courseId, setCourseId] = useState(null);
    const [chapterIdEdit, setChapterIdEdit] = useState(null);
    const [isChapterEdit, setisChapteredit] = useState(null);
    const [isChapterEditPosition, setisChaptereditPosition] = useState(false);

    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const { data: CourseData, isLoading: isLoadingCourses, refetch } = useGetAllCourseAdminQuery({ page, size });
    const [deleteCourse] = useDeleteCourseMutation()
    const [deleteVideoLesson] = useDeleteVideoLessonMutation()
    const [deleteInfoLesson] = useDeleteInfoLessonMutation()
    const [deleteQuizLesson] = useDeleteQuizLessonMutation()
    const [deleteChapter] = useDeleteChapterMutation()



    // console.log(CourseData)
    let searchInput = null;

    React.useEffect(() => {
        setIsVisible(Object.keys(filteredInfo).length > 0);
    }, [filteredInfo]);


    React.useEffect(() => {
        if (location.state?.reload) {
            refetch();
        }
    }, [location, refetch]);


    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    const handleDelete = (courseId) => {
        Modal.confirm({
            title: 'Xác nhận xóa',
            content: 'Bạn có chắc chắn muốn xóa khóa học này?',
            okText: 'Có',
            okType: 'danger',
            cancelText: 'Không',
            okButtonProps: { style: { backgroundColor: 'red', borderColor: 'red', color: 'white' } },
            onOk: async () => {
                setDeletingId(courseId);
                try {
                    await deleteCourse(courseId).unwrap();
                    message.success('Khóa học đã được xóa !');
                    refetch();
                } catch (error) {
                    console.error("Failed to delete the course: ", error);
                    message.error('Xóa khóa học thất bại vui lòng thử lại !');
                } finally {
                    setDeletingId(null);
                }
            },
        });
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={(node) => {
                        searchInput = node;
                    }}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Tìm kiếm
                    </Button>
                    <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                        xóa
                    </Button>
                </Space>
            </div>
        ),

        filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) =>
            record[dataIndex] ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()) : '',
        onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    // Handle table change (filters, sorters)
    const handleChange = (pagination, filters, sorter) => {
        setFilteredInfo(filters);
        setSortedInfo(sorter);
    };

    // Clear all filters and sorters
    const clearAll = () => {
        setFilteredInfo({});
        setSortedInfo({});
        setSearchText('');
        setSearchedColumn('');
        setIsVisible(false);
    };

    // Function to handle adding a lesson
    const handleAddLesson = (type, chapter) => {
        console.log(chapter)
        setStt(getNextLessonStt(chapter))
        setChapterId(chapter.lesson[0].lessonId)
        setIsModalVisible(true);
        setLessonType(type)
    };


    const handleCloseModal = () => {
        setIsModalVisible(false);
    }



    //props Create
    const lessonPropsCreate = {
        lessonId: chapterId,
        refetch: refetch,
        handleCloseModal: handleCloseModal,
        stt: stt,
    }

    //props Edit
    const handleEditLesson = (record, type) => {
        setIsEditModalVisible(true)
        setIsModalVisible(true);
        setLessonType(type)
        setLessonIdEdit(record.type === "video" ? record.videoId : record.type === "quiz" ? record.quizId : record.infoId);

    };

    const handleCloseEditModal = () => {
        setIsEditModalVisible(false)
        setIsModalVisible(false);
        setLessonIdEdit(null);
    };

    const lessonPropsEdit = {
        lessonId: lessonIdEdit,
        refetch: refetch,
        handleCloseEditModal: handleCloseEditModal,
    }


    const handleOpenEditModalPosition = (record) => {
        setisChaptereditPosition(true)
        setChapterIdEdit(record.id)
    };

    const handleCloseEditModalPosition = () => {
        setisChaptereditPosition(false);
        setChapterIdEdit(null)
    };

    const EditChapterPositionProps = {
        chapterId: chapterIdEdit,
        refetch: refetch,
        handleCloseModal: handleCloseEditModalPosition,
    }

    const renderLessonComponent = () => {
        if (isEditModalVisible) {
            switch (lessonType) {
                case 'video':
                    return <EditVideo {...lessonPropsEdit} />;
                case 'info':
                    return <EditInfo {...lessonPropsEdit} />;
                case 'quiz':
                    return <EditQuiz {...lessonPropsEdit} />;
                default:
                    return null;
            }
        } else {
            switch (lessonType) {
                case 'video':
                    return <VideoLesson {...lessonPropsCreate} />;
                case 'info':
                    return <InfoLesson {...lessonPropsCreate} />;
                case 'quiz':
                    return <QuizLesson {...lessonPropsCreate} />;
                default:
                    return null;
            }
        }
    };


    const getNextLessonStt = (chapter) => {
        const allLessons = [];
        chapter.lesson.forEach((lesson) => {
            lesson.videos.forEach(() => {
                allLessons.push({});
            });
            lesson.infos.forEach(() => {
                allLessons.push({});
            });
            lesson.quizs.forEach(() => {
                allLessons.push({});
            });
        });

        return allLessons.length + 1;
    };


    const columns = [
        {
            title: 'Tên khóa học',
            dataIndex: 'courseName',
            key: 'courseName',
            ...getColumnSearchProps('courseName'),
            filteredValue: filteredInfo.courseName || null,
            sorter: (a, b) => a.courseName.localeCompare(b.courseName),
            sortOrder: sortedInfo.columnKey === 'courseName' && sortedInfo.order,
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
            render: (price) => (
                <Tag color={price > 0 ? "green" : 'red'} key={price}>
                    {price > 0 ? `${price.toLocaleString()} VND` : "Miễn phí"}
                </Tag>
            ),
            sorter: (a, b) => a.price - b.price,
            sortOrder: sortedInfo.columnKey === 'price' && sortedInfo.order,
        },
        {
            title: 'Tổng số chương',
            dataIndex: 'totalChapter',
            key: 'totalChapter',
            sorter: (a, b) => a.totalChapter - b.totalChapter,
            sortOrder: sortedInfo.columnKey === 'totalChapter' && sortedInfo.order,
        },
        {
            title: 'Tổng số video',
            dataIndex: 'totalVideos',
            key: 'totalVideos',
            sorter: (a, b) => a.totalVideos - b.totalVideos,
            sortOrder: sortedInfo.columnKey === 'totalVideos' && sortedInfo.order,
        },
        {
            title: 'Đánh giá',
            dataIndex: 'rating',
            key: 'rating',
            sorter: (a, b) => a.rating - b.rating,
            sortOrder: sortedInfo.columnKey === 'rating' && sortedInfo.order,
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Space>
                    <Tooltip title="Chỉnh sửa thông tin" color='blue'>
                        <Button
                            type='default'
                            icon={<EditFilled />}
                            style={{ backgroundColor: 'white', color: 'blue' }}
                        // onClick={() => handleLockUser(record.id)}
                        />
                    </Tooltip>

                    <Tooltip title="Xóa khóa học" color='red'>
                        <Button
                            danger
                            icon={deletingId === record.id ? <Spin size="small" /> : <DeleteFilled />}
                            onClick={() => handleDelete(record.id)}
                            loading={deletingId === record.id}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];


    const handleDeleteLesson = async (chapter, record) => {
        console.log(record)
        Modal.confirm({
            title: 'Xác nhận xóa',
            content: 'Bạn có chắc chắn muốn xóa bài học này?',
            okText: 'Có',
            okType: 'danger',
            cancelText: 'Không',
            onOk: async () => {
                try {
                    if (record.type === "video") {
                        await deleteVideoLesson({ chapterId: chapter, lessonId: record.videoId }).unwrap();
                    } else if (record.type === "quiz") {
                        await deleteQuizLesson({ chapterId: chapter, lessonId: record.quizId }).unwrap();
                    } else {
                        await deleteInfoLesson({ chapterId: chapter, lessonId: record.infoId }).unwrap();
                    }
                    refetch();
                    message.success('Bài học đã được xóa!');
                } catch (error) {
                    message.error("xóa bài học thất bại !");
                }
            },
        });
    };




    const handleAddChapter = (record) => {
        setIsAddChapterModalVisible(true);
        setCourseId(record.id)
    }

    const handleCloseAddChapter = () => {
        setIsAddChapterModalVisible(false);
    }

    const handleEditChapter = (record) => {
        setIsAddChapterModalVisible(true);
        setisChapteredit(true)
        setChapterIdEdit(record.id)
    }
    const handleCloseModalChapter = (record) => {
        setIsAddChapterModalVisible(false);
        setisChapteredit(false)
        setChapterIdEdit(null)
    }

    const createChapterProps = {
        courseId: courseId,
        refetch: refetch,
        handleCloseModal: handleCloseAddChapter,
    }
    const EditChapterProps = {
        chapterId: chapterIdEdit,
        refetch: refetch,
        handleCloseModal: handleCloseModalChapter,
    }

    const handleDeleteChapter = (record) => {
        Modal.confirm({
            title: 'Xác nhận xóa chương',
            content: 'Bạn có chắc chắn muốn xóa chương này?',
            okText: 'Có',
            okType: 'danger',
            cancelText: 'Không',
            onOk: async () => {
                try {
                    await deleteChapter(record.id).unwrap();
                    message.success('Chương đã được xóa!');
                    refetch();
                } catch (error) {
                    message.error("Xóa chương thất bại!");
                }
            },
        });
    }


    const expandable = {
        expandedRowRender: (record) => {
            return (
                <>
                    <div>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => handleAddChapter(record)}
                            className='mb-5'
                        >
                            Thêm chương mới
                        </Button>
                    </div>
                    {record.chapters.map((chapter, index) => {
                        const allLessons = [];
                        chapter.lesson.forEach((lesson) => {
                            // Thêm videos vào mảng
                            lesson.videos.forEach((video) => {
                                allLessons.push({
                                    videoId: video.videoId,
                                    stt: video.stt,
                                    type: 'video',
                                    content: video.videoName,
                                });
                            });

                            // Thêm infos vào mảng
                            lesson.infos.forEach((info) => {
                                allLessons.push({
                                    infoId: info.infoId,
                                    stt: info.stt,
                                    type: 'info',
                                    content: info.infoTitle,
                                });
                            });

                            // Thêm quizs vào mảng
                            lesson.quizs.forEach((quiz) => {
                                allLessons.push({
                                    quizId: quiz.id,
                                    stt: quiz.stt,
                                    type: 'quiz',
                                    content: quiz.title,
                                });
                            });
                        });

                        // Sắp xếp mảng các bài học theo thuộc tính stt
                        const sortedLessons = allLessons.sort((a, b) => a.stt - b.stt);
                        const columnsLesson = [
                            {
                                title: 'Số thứ tự',
                                dataIndex: 'stt',
                                key: 'stt',
                                render: (stt) => {
                                    return <span>Bài {stt}</span>
                                },
                            },
                            {
                                title: 'Tên bài giảng',
                                dataIndex: 'content',
                                key: 'content',
                            },
                            {
                                title: 'Loại bài học',
                                dataIndex: 'type',
                                key: 'type',
                                render: (type) => {
                                    return <p className='flex items-center gap-2'>{handleDisplayTypeVideo[type]}<p>{type}</p> </p>
                                },
                            },
                            {
                                title: 'Hành động',
                                key: 'action',
                                render: (_, record) => (
                                    <Space>
                                        <Tooltip title="Chỉnh sửa" color='blue'>
                                            <Button
                                                type='link'
                                                icon={<EditFilled />}
                                                style={{ backgroundColor: 'white', color: 'blue' }}
                                                onClick={() => handleEditLesson(record, record.type)}
                                            />
                                        </Tooltip>
                                        <Tooltip title="Xóa" color='red'>
                                            <Button
                                                type='link'
                                                danger
                                                icon={<DeleteFilled />}
                                                onClick={() => handleDeleteLesson(chapter.id, record)}
                                            />
                                        </Tooltip>
                                    </Space>
                                ),
                            }


                        ];

                        // const menu = (

                        // );


                        return (
                            <ConfigProvider
                                theme={{
                                    components: {
                                        Collapse: {
                                            headerBg: '#e0eee0'
                                        },
                                    },
                                }}
                            >
                                <Collapse
                                    className='mb-4'
                                    defaultActiveKey={[]}
                                    expandIcon={({ isActive }) => <CaretRightOutlined className='mt-[10px]' rotate={isActive ? 90 : 0} />}>
                                    <Collapse.Panel header={
                                        <div className='flex justify-between items-center'>
                                            <p className='font-semibold flex justify-between'>
                                                Chương {index + 1} - {chapter.chapterName}
                                            </p>
                                            <Space>
                                                <Dropdown

                                                    menu={{
                                                        items: [
                                                            {
                                                                label: <p className='flex items-center gap-3' onClick={(e) => { e.stopPropagation(); handleEditChapter(chapter); }}><EditFilled style={{ color: 'blue' }} /><p>  Chỉnh sửa tên chương</p></p>,
                                                                key: 'video',
                                                            },
                                                            {
                                                                label: <p className='flex items-center gap-3' onClick={(e) => { e.stopPropagation(); handleOpenEditModalPosition(chapter) }}><OrderedListOutlined style={{ color: '#ffb90f' }} /><p>  Thay đổi vị trí bài học</p></p>,
                                                                key: 'info',
                                                            },
                                                            {
                                                                label: <p className='flex items-center w-full gap-3' onClick={(e) => e.stopPropagation()}><DeleteFilled style={{ color: '#ff3030' }} /><p className='w-full' onClick={() => handleDeleteChapter(chapter)}> Xóa chương</p></p>,
                                                                key: 'quiz',
                                                            },
                                                        ],
                                                    }}
                                                    trigger={['click']}
                                                    onClick={(e) => e.stopPropagation()}
                                                    mouseEnterDelay={0.1}
                                                    mouseLeaveDelay={0.1}

                                                >
                                                    <Button type='link' icon={<SettingFilled style={{ fontSize: '23px' }} />} onClick={(e) => e.stopPropagation()} />
                                                </Dropdown>
                                            </Space>
                                        </div>
                                    } key={chapter.id} >
                                        <Space>

                                            <Dropdown
                                                menu={{
                                                    items: [
                                                        {
                                                            label: <p className='flex items-center gap-3' onClick={() => handleAddLesson('video', chapter)}>{handleDisplayTypeVideo["video"]}<p>Video</p></p>,
                                                            key: 'video',
                                                        },
                                                        {
                                                            label: <p className='flex items-center gap-3' onClick={() => handleAddLesson('info', chapter)}>{handleDisplayTypeVideo["info"]}<p>Thông tin</p></p>,
                                                            key: 'info',
                                                        },
                                                        {
                                                            label: <p className='flex items-center gap-3' onClick={() => handleAddLesson('quiz', chapter)}>{handleDisplayTypeVideo["quiz"]}<p>Kiểm tra</p></p>,
                                                            key: 'quiz',
                                                        },
                                                    ],
                                                }}
                                                trigger={['click']}
                                            >
                                                <Button type="primary"
                                                    icon={<PlusOutlined />}
                                                    className='mb-4 w-full'
                                                >
                                                    Thêm bài học mới
                                                </Button>
                                            </Dropdown>
                                        </Space>
                                        <Table
                                            dataSource={sortedLessons}
                                            columns={columnsLesson}
                                            pagination={false}
                                            rowKey="stt"
                                        />
                                    </Collapse.Panel>
                                </Collapse>
                            </ConfigProvider>
                        );
                    })}
                </>
            );
        },
    };

    //explanded for lessons

    // Add custom styles for the table header
    const tableHeaderStyle = {
        backgroundColor: '#c1cdc1',
        color: 'black',
    };

    if (isLoadingCourses) {
        return (
            <div>
                <Spin tip="Loading" size="large">
                    Đợi một xíu nha
                </Spin>
            </div>
        );
    }

    return (
        <div className='flex flex-col justify-center gap-5 items-center'>
            <div className='flex justify-center px-5  w-fit border-[-0.5px]'>
                <p className="font-bold text-center w-fit text-4xl mb-5 mt-3 bg-custom-gradient bg-clip-text text-transparent"
                    style={{
                        textShadow: '2px 4px 8px rgba(0, 0, 0, 0.2)',
                    }}
                >
                    Quản lý khóa học
                </p>
            </div>
            <div className='w-full'>
                <div className='flex justify-end mb-4'>
                    <Space>
                        <Link to='/admin/create-course'>
                            <Button type="primary"
                                icon={<PlusOutlined />}
                                className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-medium rounded-full py-5 px-6 transition-transform duration-800 hover:from-cyan-400 hover:to-blue-500 hover:scale-105 hover:shadow-cyan-200 hover:shadow-lg">
                                Thêm khóa học mới
                            </Button>
                        </Link>

                    </Space>
                </div>

                {Object.keys(filteredInfo).length > 0 && (
                    <Button
                        onClick={clearAll}
                        type='primary'
                        className={`mb-3 fade-in ${isVisible ? 'show' : ''}`}
                    >
                        Bỏ lọc <Image preview={false} width={25} src={clearFilter} />
                    </Button>
                )}

                <Table
                    bordered={true}
                    columns={columns}
                    dataSource={CourseData?.data.content}
                    rowKey="id"
                    onChange={handleChange}
                    expandable={expandable}
                    components={{
                        header: {
                            cell: (props) => <th {...props} style={tableHeaderStyle} />,
                        },
                    }}
                    pagination={{
                        current: page + 1,
                        pageSize: size,
                        total: CourseData?.data.totalElements,
                        onChange: (pageNumber, pageSize) => {
                            setPage(pageNumber - 1);
                            setSize(pageSize);
                        },
                    }}
                />
            </div>
            <Modal
                width={"70%"}
                title={
                    <div className='w-full flex justify-center'>
                        <p className=' text-center rounded-lg  py-2'>{!isEditModalVisible ? "Thêm bài học mới" : "Chỉnh sửa bài học "}</p>
                    </div>
                }
                open={isModalVisible}
                onCancel={handleCloseEditModal}
                footer={null}
                closeIcon={<CloseOutlined className='text-white bg-red-500 p-3 rounded-lg' />}
            >
                {renderLessonComponent()}
            </Modal>
            <Modal
                width={"70%"}
                title={
                    <div className='w-full flex justify-center'>
                        <p className=' text-center rounded-lg  py-2'>{!isChapterEdit ? "Thêm chương mới" : "Chỉnh sửa tên chương"}</p>
                    </div>
                }
                open={isAddChapterModalVisible}
                onCancel={handleCloseModalChapter}
                footer={null}
                closeIcon={<CloseOutlined className='text-white bg-red-500 p-3 rounded-lg' />}
            >
                {!isChapterEdit ? (<CreateChapter {...createChapterProps} />) : (<EditChapter {...EditChapterProps} />)}
            </Modal>
            <Modal
                width={"70%"}
                title={
                    <div className='w-full flex justify-center'>
                        <p className=' text-center rounded-lg  py-2'>Chỉnh sửa vị trí</p>
                    </div>
                }
                open={isChapterEditPosition}
                onCancel={handleCloseEditModalPosition}
                footer={null}
                closeIcon={<CloseOutlined className='text-white bg-red-500 p-3 rounded-lg' />}
            >
                <EditchapterPosition {...EditChapterPositionProps} />
            </Modal>

        </div>
    );
};

export default ManageCourse;