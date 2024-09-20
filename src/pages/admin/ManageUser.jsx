import React, { useRef, useState } from 'react';
import { CheckCircleOutlined, CloseCircleOutlined, EyeOutlined, LockOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space, Table, Tag } from 'antd';
import { useGetAllUserQuery } from '../../services/userAPI';


const ManageUser = () => {
    const { data: users, error, isLoading } = useGetAllUserQuery();
    console.log('data nè :', users);
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
            dataIndex: 'name',
            key: 'name',
            // width: '30%',
            ...getColumnSearchProps('name'),
            sorter: (a, b) => a.name.length - b.name.length,
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
            dataIndex: 'phone',
            key: 'phone',
            // width: '20%',
            ...getColumnSearchProps('phone'),
        },
        {
            title: 'Ngày đăng ký',
            dataIndex: 'date',
            key: 'date',
            // width: '20%',
            ...getColumnSearchProps('date'),
            sorter: (a, b) => new Date(a.date) - new Date(b.date),
            sortDirections: ['descend', 'ascend'],
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
            onFilter: (value, record) => record.state.indexOf(value) === 0,
            render: (_, record) => (
                <div>
                    {record.state === "Hoạt động" &&
                        < Tag icon={<CheckCircleOutlined />} color="success">
                            {record.state}
                        </Tag>
                    }

                    {record.state === "Bị khóa" &&
                        < Tag icon={< CloseCircleOutlined />} color="error" >
                            {record.state}
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
                <div className="space-x-2">
                    <Button danger
                        icon={<LockOutlined />}
                        onClick={() => handleLockUser(record.key)}
                    >

                    </Button>

                    <Button
                        type="primary"
                        icon={<EyeOutlined />}
                        onClick={() => handleViewDetails(record.key)}
                    >

                    </Button>
                </div>
            ),
        },

    ];
    ;
    return (
        <Table columns={columns} dataSource={users} loading={isLoading} />
    )
}

export default ManageUser