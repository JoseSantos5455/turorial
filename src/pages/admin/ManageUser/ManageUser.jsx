import React, { useRef, useState } from 'react';
import { CheckCircleOutlined, CloseCircleOutlined, EyeOutlined, LockOutlined, SearchOutlined, UnlockOutlined } from '@ant-design/icons';
import { Button, Image, Input, Space, Table, Tag, Tooltip } from 'antd';
import { useGetAllUserQuery, userAPI } from '../../../services/userAPI';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../../slices/auth.slice';
import clearFilter from '../../../assets/image/clear-filter.svg'
import Highlighter from 'react-highlight-words';


const ManageUser = () => {
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(10);
    const { data: users, error, reload, isLoading, refetch } = useGetAllUserQuery({ page, limit });
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [filteredInfo, setFilteredInfo] = useState({});
    const [isVisible, setIsVisible] = useState(false);
    const [sortedInfo, setSortedInfo] = useState({});

    let searchInput = null;

    const admin = useSelector(selectCurrentUser);

    React.useEffect(() => {
        setIsVisible(Object.keys(filteredInfo).length > 0);
    }, [filteredInfo, searchText, sortedInfo]);

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



    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
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
        filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />,
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
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

    const handleChange = (pagination, filters, sorter) => {
        setFilteredInfo(filters);
        setSortedInfo(sorter);
    };


    // Clear all filters and sorters
    const clearAll = () => {
        setFilteredInfo({});
        setSortedInfo({});
        setSearchText("");
        setSearchedColumn('');
        setIsVisible(false);
        reload();
    };

    const filteredUsers = users?.users.filter(user => {

        if (user.id == admin.id) return false;
        // if (Object.keys(filteredInfo).length === 0 && !searchText) return true;
        if (!searchText || !searchedColumn) return true;
        return user[searchedColumn].toString().toLowerCase().includes(searchText.toLowerCase());
    });
    const columns = [
        {
            title: 'Name',
            dataIndex: 'full_name',
            key: 'full_name',
            ...getColumnSearchProps('full_name'),
            sorter: (a, b) => a.full_name.length - b.full_name.length,
            sortDirections: ['descend', 'ascend'],
            sortOrder: sortedInfo.columnKey === 'full_name' && sortedInfo.order,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            ...getColumnSearchProps('email'),
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone_number',
            key: 'phone_number',
            ...getColumnSearchProps('phone_number'),
        },
        {
            title: 'Ngày sinh nhật',
            dataIndex: 'date_of_birth',
            key: 'date_of_birth',
            sorter: (a, b) => new Date(a.date_of_birth) - new Date(b.date_of_birth),
            sortDirections: ['descend', 'ascend'],
            render: (date_of_birth) => dayjs(date_of_birth).format('DD/MM/YYYY'),
            sortOrder: sortedInfo.columnKey === 'date_of_birth' && sortedInfo.order,
        },
        {
            title: 'Status',
            key: 'state',
            dataIndex: 'state',
            width: 150,
            align: "center",
            filters: [
                { text: 'Bị khóa', value: false },
                { text: 'Hoạt động', value: true },
            ],
            onFilter: (value, record) => record.is_active === value,
            render: (_, record) => (
                record.is_active ? (
                    <Tag icon={<CheckCircleOutlined />} color="success">Hoạt động</Tag>
                ) : (
                    <Tag icon={<CloseCircleOutlined />} color="error">Bị khóa</Tag>
                )
            ),
        },
        {
            title: 'Khóa học đã mua',
            dataIndex: 'course',
            key: 'course',
            align: "center",
            ...getColumnSearchProps('course'),
            sorter: (a, b) => a.course - b.course,
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Space>
                    {record.is_active ? (
                        <Tooltip title="Khóa người dùng" color='red'>
                            <Button
                                icon={<LockOutlined />}
                                danger
                                onClick={() => handleLockUser(record.id)}
                            />
                        </Tooltip>
                    ) : (
                        <Tooltip title="Mở khóa người dùng" color='green'>
                            <Button
                                icon={<UnlockOutlined />}
                                onClick={() => handleLockUser(record.id)}
                            />
                        </Tooltip>
                    )}
                    <Tooltip title="Xem chi tiết" color='blue'>
                        <Link to={`user-details/${record.id}`}>
                            {/* {console.log(record)} */}
                            <Button icon={<EyeOutlined />} />
                        </Link>
                    </Tooltip>
                </Space>
            ),
        },
    ];

    const transformedData = users?.users?.map((item, index) => ({
        ...item,
        key: index + 1,
    }));

    const handlePageChange = (newPage) => {
        setPage(newPage - 1);
    };

    return (
        <div className='flex flex-col justify-center items-center'>
            <p className="font-bold text-center w-fit text-4xl mb-9 mt-3 bg-custom-gradient bg-clip-text text-transparent"
                style={{
                    textShadow: '2px 4px 8px rgba(0, 0, 0, 0.2)',
                }}
            >
                Quản lý tài khoản
            </p>
            {Object.keys(filteredInfo).length > 0 && (
                <Button
                    onClick={() => clearAll()}
                    type='primary'
                    className={`mb-3 fade-in ${isVisible ? 'show' : ''}`}
                >
                    Bỏ lọc <Image preview={false} width={25} src={clearFilter} />
                </Button>

            )}

            <Table
                className='w-full'
                columns={columns}
                dataSource={filteredUsers}
                rowKey="id"
                loading={isLoading}
                onChange={handleChange}
                pagination={{
                    current: page + 1,
                    pageSize: limit,
                    total: users?.total,
                    onChange: (pageNumber, pageSize) => {
                        setPage(pageNumber - 1);
                        setLimit(pageSize);
                    },
                }}
            />
        </div>
    );
};

export default ManageUser;
