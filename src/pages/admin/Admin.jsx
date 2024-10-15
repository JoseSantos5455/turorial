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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Admin = () => {

  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    datasets: [
      {
        label: 'Monthly Revenue (in $)',
        data: [5000, 4000, 6000, 8000, 5500, 4500, 7000, 6000, 8500, 9000, 9500, 10000],
        backgroundColor: 'rgba(54, 162, 235, 0.6)', // Màu nền cột
        borderColor: 'rgba(54, 162, 235, 1)', // Màu viền cột
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
      <div className='flex flex-row justify-center'>
        <div className='bg-[#3d4d76] w-[400px] h-[100px] m-5 rounded-xl'>
          <div className='flex flex-row justify-between'>
            <div className='text-white mx-6 my-4 text-base'>
              <div className='font-bold opacity-90'>Tổng Số Tiền</div>
              <div className='opacity-50'>vinh</div>
            </div>
            <div className='text-white mt-8 mr-4 text-3xl font-bold'>
              1234
            </div>
          </div>

        </div>
        <div className='bg-[#1bd6e5] w-[400px] h-[100px] m-5 rounded-xl'>
          <div className='flex flex-row justify-between'>
            <div className='text-white mx-6 my-4 text-base'>
              <div className='font-bold opacity-90'>Khóa Học</div>
              <div className='opacity-50'>vinh</div>
            </div>
            <div className='text-white mt-8 mr-4 text-3xl font-bold'>
              1234
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
              1234
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