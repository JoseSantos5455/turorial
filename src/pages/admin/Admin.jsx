import React from 'react'
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useGetRevenueByMonthQuery, useGetStatisticsQuery } from '../../services/revenueAPI';
import { Statistic } from 'antd';
import CountUp from 'react-countup';


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Admin = () => {
  const { data: Statitic, isLoading: isStatiticLoading, error: StatiticError } = useGetStatisticsQuery();
  const { data: RevenueYear, isLoading: isRevenueLoading, error: revenueError } = useGetRevenueByMonthQuery();

  const formatter = (value) => <CountUp end={value} separator="," />;
  const data = {

    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    datasets: [
      {
        label: 'Monthly Revenue (in $)',
        data: RevenueYear ? [
          RevenueYear['Month 1'] || 0,
          RevenueYear['Month 2'] || 0,
          RevenueYear['Month 3'] || 0,
          RevenueYear['Month 4'] || 0,
          RevenueYear['Month 5'] || 0,
          RevenueYear['Month 6'] || 0,
          RevenueYear['Month 7'] || 0,
          RevenueYear['Month 8'] || 0,
          RevenueYear['Month 9'] || 0,
          RevenueYear['Month 10'] || 0,
          RevenueYear['Month 11'] || 0,
          RevenueYear['Month 12'] || 0
        ] : Array(12).fill(0),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Tùy chọn hiển thị của biểu đồ
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top', // Vị trí của chú thích (legend)
      },
      title: {
        display: true,
        text: 'Monthly Revenue for 2024', // Tiêu đề biểu đồ
      },
    },
    scales: {
      y: {
        beginAtZero: true, // Bắt đầu trục y từ giá trị 0
      },
    },
  };


  return (
    <div>
      <div className='flex justify-center'>
        <div className='bg-[#3d4d76] w-[400px] h-[100px] mt-5 rounded-xl flex justify-center items-center'>
          <Statistic valueStyle={{ color: 'white' }} title={<span className='text-white text-lg'>Tổng số doanh thu</span>} style={{ color: 'white' }} value={Statitic?.totalRevenue == null ? "Chưa có doanh thu" : Statitic?.totalRevenue} formatter={formatter} />
        </div>
        <div className='bg-[#1bd6e5] w-[400px] h-[100px] m-5 rounded-xl'>
          <div className='flex flex-row justify-between'>
            <div className='text-white mx-6 my-4 text-base'>
              <div className='font-bold opacity-90'>Khóa Học</div>
              <div className='opacity-50'>vinh</div>
            </div>
            <div className='text-white mt-8 mr-4 text-3xl font-bold'>
            <Statistic valueStyle={{ color: 'white' }} title={<span className='text-white text-lg'>Tổng số khóa học</span>} style={{ color: 'white' }} value={Statitic?.totalCourses == null ? "Chưa có khóa học" : Statitic?.totalCourses} formatter={formatter} />
            </div>
          </div>
        </div>
        <div className='bg-[#2ab17f] w-[400px] h-[100px] m-5 rounded-xl'>
          <div className='flex flex-row justify-between'>
            <div className='text-white mx-6 my-4 text-base'>
              <div className='font-bold opacity-90'>Người Dùng</div>
              <div className='opacity-50'>vinh</div>
            </div>
            <div className='text-white mt-8 mr-4 text-3xl font-bold'>
            <Statistic valueStyle={{ color: 'white' }} title={<span className='text-white text-lg'>Tổng số người sử dụng</span>} style={{ color: 'white' }} value={Statitic?.totalCustomers == null ? "Chưa có khóa học" : Statitic?.totalCustomers} formatter={formatter} />
            </div>
          </div>
        </div>
      </div>
      <div className='text-2xl ml-5 font-bold'>
        Doanh thu theo tháng
      </div>
      <div className='mx-40 my-6' style={{ width: '1000px', height: '500px' }}>
        <Bar data={data} options={options} />
      </div>
    </div>

  )
}

export default Admin
