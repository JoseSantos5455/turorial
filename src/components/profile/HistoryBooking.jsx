import React from 'react';
import { Table } from 'antd';

const HistoryBooking = () => {
    const columns = [
        {
            title: 'Booking ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Service',
            dataIndex: 'service',
            key: 'service',
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
        },
    ];

    const data = [
        {
            key: '1',
            id: '12345',
            service: 'Clinical Psychology',
            date: '2023-01-01',
            status: 'Completed',
        },
        {
            key: '2',
            id: '12346',
            service: 'Marriage and Family Therapy',
            date: '2023-02-15',
            status: 'Pending',
        },
        // Add more data as needed
    ];

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-6">History Booking</h2>
            <Table columns={columns} dataSource={data} pagination={false} />
        </div>
    );
};

export default HistoryBooking;