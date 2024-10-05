import React, { useState } from 'react';
import { Table, Input, Button, Space, Spin, Tooltip, Image, Tag, message, Modal } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { DeleteFilled, DeleteOutlined, EditFilled, EditOutlined, EyeOutlined, LockOutlined, PlusOutlined, SearchOutlined, UnlockOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { useDeleteCourseMutation, useGetAllCourseQuery } from '../../../services/coursesAPI';
import clearFilter from '../../../assets/image/clear-filter.svg'
import './ManageCourse.scss'
const ManageCourse = () => {
    const { data: CourseData, isLoading: isLoadingCourses, refetch } = useGetAllCourseQuery();
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
                    message.success('Xóa khóa học thành công !');
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

    // Add custom styles for the table header
    const tableHeaderStyle = {
        backgroundColor: '#fafafa',
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
        <div>
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
            <div>
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
                    // Apply custom header style
                    components={{
                        header: {
                            cell: (props) => <th {...props} style={tableHeaderStyle} />,
                        },
                    }}
                />
            </div>
        </div>
    );
};

export default ManageCourse;
