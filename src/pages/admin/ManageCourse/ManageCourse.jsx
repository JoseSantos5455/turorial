import React from 'react'
import { Avatar, List } from 'antd';
import { Link } from 'react-router-dom';


const ManageCourse = () => {
    const data = [
        {
            title: 'Ant Design Title 1',
            id: 1
        },
        {
            title: 'Ant Design Title 2',
            id: 2
        },
        {
            title: 'Ant Design Title 3',
            id: 3
        },
        {
            title: 'Ant Design Title 4',
            id: 4
        },
    ];
    return (
        <div>
            <div className='flex justify-end'>
                <Link to='/admin/create-course'>
                    <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
                        Add Course
                    </button>
                </Link>
            </div>
            <List
                itemLayout="horizontal"
                dataSource={data}
                renderItem={(item, index) => (
                    <List.Item>
                        <List.Item.Meta
                            avatar={<Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`} />}
                            title={<Link to={`course-details/${item.id}`}>{item.title}</Link>}
                            description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                        />
                    </List.Item>
                )}
            />
        </div>
    )
}

export default ManageCourse