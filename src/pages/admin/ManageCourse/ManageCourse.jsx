import React, { useState } from 'react';
import { Table, Input, Button, Space, Spin, Tooltip, Image, Tag, message, Modal, List, Collapse, ConfigProvider } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { CaretRightOutlined, DeleteFilled, EditFilled, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { useDeleteCourseMutation, useGetAllCourseQuery } from '../../../services/coursesAPI';
import clearFilter from '../../../assets/image/clear-filter.svg'
import './ManageCourse.scss'
import { handleDisplayTypeVideo } from '../../../utils/utils';
const ManageCourse = () => {
    const [page, setPage] = useState(0); 
    const [size, setSize] = useState(20); 
    const { data: CourseData, isLoading: isLoadingCourses, refetch } = useGetAllCourseQuery({ page, size });
    const [deleteCourse, { isLoading: isDeleting }] = useDeleteCourseMutation()
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [filteredInfo, setFilteredInfo] = useState({});
    const [sortedInfo, setSortedInfo] = useState({});
    const [isVisible, setIsVisible] = useState(false);
    const location = useLocation();
    const [deletingId, setDeletingId] = useState(null);

    console.log(CourseData)
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

    // Add expandable feature to the table
    const expandable = {
        expandedRowRender: (record) => {
            // Xử lý dữ liệu các bài học của chương
            return record.chapters.map((chapter) => {
                // Tạo mảng chung chứa tất cả bài học từ các loại khác nhau (videos, infos, quizs)
                const allLessons = [];

                chapter.lesson.forEach((lesson) => {
                    // Thêm videos vào mảng
                    lesson.videos.forEach((video) => {
                        allLessons.push({
                            stt: video.stt,
                            type: 'video',
                            content: video.videoName,
                        });
                    });

                    // Thêm infos vào mảng
                    lesson.infos.forEach((info) => {
                        allLessons.push({
                            stt: info.stt,
                            type: 'info',
                            content: info.infoTitle,
                        });
                    });

                    // Thêm quizs vào mảng
                    lesson.quizs.forEach((quiz) => {
                        allLessons.push({
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
                ];

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
                            // bordered={false}
                            defaultActiveKey={[]}
                            expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                        >
                            <Collapse.Panel header={<p className='font-semibold flex justify-between'>{chapter.chapterName} <Button>Thêm bài học mới</Button></p>} key={chapter.id} >
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
            });
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
                        total: CourseData?.total,
                        onChange: (pageNumber, pageSize) => {
                            setPage(pageNumber - 1);
                            setSize(pageSize); 
                        },
                    }}
                />
            </div>
        </div>
    );
};

export default ManageCourse;