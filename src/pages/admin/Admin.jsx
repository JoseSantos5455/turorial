import React from 'react'
import { Column } from '@ant-design/charts';

const Admin = () => {
  const data = [
    { type: 'Jan', money: 38 },
    { type: 'Feb', money: 52 },
    { type: 'Mar', money: 61 },
    { type: 'Apr', money: 145 },
    { type: 'May', money: 48 },
    { type: 'Jun', money: 38 },
    { type: 'Jul', money: 38 },
    { type: 'Aug', money: 38 },
    { type: 'Sep', money: 90 },
    { type: 'Oct', money: 110 },
    { type: 'Nov', money: 120 },
    { type: 'Dec', money: 150 },
  ];

  const config = {
    data,
    xField: 'type',
    yField: 'money',
    label: {
      position: 'middle',
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    columnWidthRatio: 0.6,
    meta: {
      type: { alias: 'Month' },
      money: { alias: 'money' },
    },
    responsive: true,
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
        <Column {...config} />
      </div>
    </div>

  )
}

export default Admin