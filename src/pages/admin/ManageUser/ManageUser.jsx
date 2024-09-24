import React, { useRef, useState } from 'react';
import { CheckCircleOutlined, CloseCircleOutlined, EyeOutlined, LockOutlined, SearchOutlined, UnlockOutlined } from '@ant-design/icons';
import { Button, Input, Space, Table, Tag, Tooltip } from 'antd';
import { useGetAllUserQuery } from '../../../services/userAPI';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';

const ManageUser = () => {
    const { data: users, error, isLoading } = useGetAllUserQuery();
    const filteredUsers = users?.users.filter(user => user.role.id === 2);

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
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
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({
                                closeDropdown: false,
                            });
                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1677ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },

    });

    const handleLockUser = (userId) => {
        console.log(`Khóa user với ID: ${userId}`);
    };

    const handleViewDetails = (userId) => {
        console.log(`Xem chi tiết user với ID: ${userId}`);
    };
    const columns = [
        {
            title: 'Name',
            dataIndex: 'full_name',
            key: 'full_name',
            // width: '30%',
            ...getColumnSearchProps('full_name'),
            sorter: (a, b) => a.full_name.length - b.full_name.length,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            // width: '20%',
            ...getColumnSearchProps('email'),
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone_number',
            key: 'phone_number',
            // width: '20%',
            ...getColumnSearchProps('phone_number'),
        },
        {
            title: 'Ngày sinh nhật',
            dataIndex: 'date_of_birth',
            key: 'date_of_birth',
            // width: '20%',
            ...getColumnSearchProps('date_of_birth'),
            sorter: (a, b) => new Date(a.date_of_birth) - new Date(b.date_of_birth),
            sortDirections: ['descend', 'ascend'],
            render: (date_of_birth) => dayjs(date_of_birth).format('DD/MM/YYYY'),
        },
        {
            title: 'Status',
            key: 'state',
            dataIndex: 'state',
            width: 150,
            align: "center",
            filters: [
                {
                    text: 'Bị khóa',
                    value: 'Bị khóa',
                },
                {
                    text: 'Hoạt động',
                    value: 'Hoạt động',
                },

            ],
            onFilter: (value, record) => record.is_active.indexOf(value) === 0,
            render: (_, record) => (
                <div>
                    {record.is_active === true &&
                        < Tag icon={<CheckCircleOutlined />} color="success">
                            Hoạt động
                        </Tag>
                    }

                    {record.is_active === false &&
                        < Tag icon={< CloseCircleOutlined />} color="error" >
                            Bị khóa
                        </Tag >
                    }
                </div >
            ),
        },
        {
            title: 'Khóa học đã mua',
            dataIndex: 'course',
            key: 'course',
            align: "center",
            // width: '20%',
            ...getColumnSearchProps('course'),
            sorter: (a, b) => a.course - b.course,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (text, record) => (
                <Space>
                    {
                        record.is_active === true
                            ?
                            <Tooltip title="Khóa người dùng" color='red'>
                                <Button
                                    icon={<LockOutlined />}
                                    danger
                                    onClick={() => {
                                        showModal({
                                            userId: record.id,
                                            status: 0
                                        })
                                    }} />
                            </Tooltip>
                            :
                            <Tooltip title="Mở khóa người dùng" color='green'>
                                <Button
                                    icon={<UnlockOutlined />}
                                    onClick={() => {
                                        showModal({
                                            userId: record.id,
                                            status: 1
                                        })
                                    }} ></Button>
                            </Tooltip>
                    }
                    <Tooltip title="Xem chi tiết" color='blue'>
                        <Link to={`user-details/${record.key}`}>
                            <Button
                                icon={<EyeOutlined />}
                            >
                            </Button>
                        </Link>
                    </Tooltip>
                </Space >
            ),
        },

    ];
    const transformedData = users?.users?.map((item, index) => ({
        ...item,
        key: index + 1,
    }));
    console.log("tra", transformedData)
    return (
        <Table columns={columns} dataSource={transformedData} loading={isLoading} />
    )
}

export default ManageUser