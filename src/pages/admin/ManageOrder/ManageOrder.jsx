import React, { useEffect, useState, useRef } from "react";
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    EyeOutlined,
    SearchOutlined,
    ReloadOutlined,
} from '@ant-design/icons';
import { Button, Image, Input, Space, Table, Tag, Tooltip, notification } from 'antd';
import { useGetAllOrderQuery } from '../../../services/paymentAPI';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../../slices/auth.slice';
import clearFilter from '../../../assets/image/clear-filter.svg';
import Highlighter from 'react-highlight-words';

const ManageOrders = () => {

    const { data: orders, error, refetch, isLoading } = useGetAllOrderQuery();
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [filteredInfo, setFilteredInfo] = useState({});
    const [sortedInfo, setSortedInfo] = useState({});
    const [isVisible, setIsVisible] = useState(false);
    console.log('orders', orders);
    const searchInput = useRef(null);

    const admin = useSelector(selectCurrentUser);

    useEffect(() => {
        setIsVisible(Object.keys(filteredInfo).length > 0);
    }, [orders, searchText, sortedInfo]);

    useEffect(() => {
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
                    ref={searchInput}
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
                        Xóa
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
        refetch();
    };

    const columns = [
        {
            title: 'Mẫ Đơn Hàng',
            dataIndex: 'orderCode',
            key: 'orderCode',
            ...getColumnSearchProps('orderCode'),
            sorter: (a, b) => a.orderCode - b.orderCode,
            sortDirections: ['descend', 'ascend'],
            sortOrder: sortedInfo.columnKey === 'orderCode' && sortedInfo.order,
        },
        {
            title: 'Tên Người Dùng',
            dataIndex: 'userName',
            key: 'userName',
            ...getColumnSearchProps('userName'),
            sorter: (a, b) => a.userName.length - b.userName.length,
            sortDirections: ['descend', 'ascend'],
            sortOrder: sortedInfo.columnKey === 'userName' && sortedInfo.order,
        },
        {
            title: 'Ngày Mua',
            dataIndex: 'purchaseDate',
            key: 'purchaseDate',
            sorter: (a, b) => new Date(a.purchaseDate[0], a.purchaseDate[1] - 1, a.purchaseDate[2]) - new Date(b.purchaseDate[0], b.purchaseDate[1] - 1, b.purchaseDate[2]),
            sortDirections: ['descend', 'ascend'],
            render: (purchaseDate) => dayjs(new Date(purchaseDate[0], purchaseDate[1] - 1, purchaseDate[2])).format('DD/MM/YYYY'),
            sortOrder: sortedInfo.columnKey === 'purchaseDate' && sortedInfo.order,
        },
        {
            title: 'Ngày Hết Hạn',
            dataIndex: 'expiryDate',
            key: 'expiryDate',
            sorter: (a, b) => new Date(a.expiryDate[0], a.expiryDate[1] - 1, a.expiryDate[2]) - new Date(b.expiryDate[0], b.expiryDate[1] - 1, b.expiryDate[2]),
            sortDirections: ['descend', 'ascend'],
            render: (expiryDate, record) => {
                return record.packageStatus === "CANCELLED"
                    ? <span style={{ color: 'gray' }}>N/A</span>
                    : dayjs(new Date(expiryDate[0], expiryDate[1] - 1, expiryDate[2])).format('DD/MM/YYYY');
            },
            sortOrder: sortedInfo.columnKey === 'expiryDate' && sortedInfo.order,
        },


        {
            title: 'Trạng Thái Gói',
            dataIndex: 'packageStatus',
            key: 'packageStatus',
            filters: [
                { text: 'CANCELLED', value: 'CANCELLED' },
                { text: 'PAID', value: 'PAID' },
            ],
            onFilter: (value, record) => record.packageStatus === value,
            render: (_, record) => (
                record.packageStatus === "PAID" ? (
                    <Tag icon={<CheckCircleOutlined />} color="success">PAID</Tag>
                ) : (
                    <Tag icon={<CloseCircleOutlined />} color="error">CANCELLED</Tag>
                )
            ),
        },
        {
            title: 'Giá Tiền (VND)',
            dataIndex: 'price',
            key: 'price',
            sorter: (a, b) => a.price - b.price,
            sortDirections: ['descend', 'ascend'],
            sortOrder: sortedInfo.columnKey === 'price' && sortedInfo.order,
            render: (price) => `${price.toLocaleString()} đ`,
        },

    ];

    // Giả sử bạn có hàm xử lý gia hạn đơn hàng
    const handleRenewal = (orderId) => {
        // Logic để gia hạn đơn hàng, ví dụ gửi email thông báo
        notification.success({
            message: "Gia hạn thành công",
            description: `Đơn hàng #${orderId} đã được gia hạn.`,
            duration: 2,
        });
    };


    return (
        <div className='flex flex-col justify-center items-center p-6'>
            <p className="font-bold text-center w-fit text-4xl mb-9 mt-3 bg-custom-gradient bg-clip-text text-transparent"
                style={{
                    textShadow: '2px 4px 8px rgba(0, 0, 0, 0.2)',
                }}
            >
                Quản lý đơn hàng
            </p>
            {/* {Object.keys(filteredInfo).length > 0 && (
                <Button
                    onClick={() => clearAll()}
                    type='primary'
                    className={`mb-3 flex items-center`}
                >
                    Bỏ lọc <Image preview={false} width={25} src={clearFilter} />
                </Button>
            )} */}
            <Table
                className='w-full'
                columns={columns}
                dataSource={orders}
                rowKey="id"
                loading={isLoading}
                onChange={handleChange}

            />
        </div>
    );
};

export default ManageOrders;
