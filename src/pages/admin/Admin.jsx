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
      <div className='flex justify-start'>
        {/* Tổng số doanh thu */}
        {/* <div className='bg-[#3d4d76] w-[400px] h-[100px] m-5 rounded-xl flex justify-start items-center '>
          <Statistic
            valueStyle={{ color: 'white' }}
            title={<span className='text-white text-xl font-bold'>Tổng số doanh thu</span>}
            value={Statitic?.totalRevenue ?? "Chưa có doanh thu"} // Giữ lại logic kiểm tra dữ liệu
            formatter={formatter}
            className='text-white ml-5 '
          />
        </div> */}
        <div className='bg-[#3d4d76] w-[400px] h-[100px] m-5 rounded-xl flex justify-start items-center '>
          <Statistic
            valueStyle={{ color: 'white' }}
            title={<span className='text-white text-xl font-bold'>Tổng số doanh thu</span>}
            value={Statitic?.totalRevenue ?? "Chưa có doanh thu"} // Giữ lại logic kiểm tra dữ liệu
            formatter={formatter}
            className='text-white ml-5 '
          />
        </div>

        {/* Tổng số khóa học */}
        <div className='bg-[#1bd6e5] w-[400px] h-[100px] m-5 rounded-xl flex justify-start items-center'>
          <Statistic
            valueStyle={{ color: 'white' }}
            title={<span className='text-white text-xl font-bold'>Tổng số khóa học</span>}
            value={Statitic?.totalCourses ?? "Chưa có khóa học"} // Giữ lại logic kiểm tra dữ liệu
            formatter={formatter}
            className='text-white ml-5'
          />
        </div>

        {/* Tổng số người sử dụng */}
        <div className='bg-[#2ab17f] w-[400px] h-[100px] m-5 rounded-xl flex justify-start items-center'>
          <Statistic
            valueStyle={{ color: 'white' }}
            title={<span className='text-white text-xl font-bold'>Tổng số người sử dụng</span>}
            value={Statitic?.totalCustomers ?? "Chưa có người sử dụng"} // Giữ lại logic kiểm tra dữ liệu
            formatter={formatter}
            className='text-white ml-5'
          />
        </div>
      </div>

      {/* Doanh thu theo tháng */}
      <div className='text-2xl ml-5 font-bold'>
        Doanh thu theo tháng
      </div>

      {/* Biểu đồ doanh thu theo tháng */}
      <div className='mx-40 my-6' style={{ width: '1000px', height: '500px' }}>
        <Bar data={data} options={options} />
      </div>
    </div>


  )
}

export default Admin
