
import { Button, Empty, Layout, Modal, Popover, Spin } from 'antd'
import Search from 'antd/es/input/Search'
import React, { useState } from 'react'
import './Header.scss';
import Login from '../../pages/login/Login';
import { useGetMyCourseQuery } from '../../services/coursesAPI';
import { Link } from 'react-router-dom';

const HeaderCustom = ({ collapsed }) => {

    const { data: Mycourses, error, isLoading } = useGetMyCourseQuery();


    const { Header } = Layout;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isRegister, setIsRegister] = useState(true);

    const [open, setOpen] = useState(false);

    const hide = () => {
        setOpen(false);
    };

    const handleOpenChange = (newOpen) => {
        setOpen(newOpen);
    };

    const handleShowLoginModal = () => {
        console.log(isRegister)
        setIsRegister(false);
        setIsModalOpen(true);
    }
    const handleShowRegisterModal = () => {
        console.log(isRegister)
        setIsRegister(true);
        setIsModalOpen(true);
    }

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    console.log(Mycourses)

    return (
        <Header
            style={{
                padding: 0,
                background: '#001529',
                position: "fixed",
                width: `calc(100% - ${collapsed ? "80px" : "200px"})`,
                zIndex: 1000,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                height: '80px',

            }}

        >
            <div className='p-14'>
                <p></p>
            </div>

            <Search
                allowClear
                placeholder="Tìm kiếm khóa học, bài viết, video..."
                enterButton
                size='large'
                style={{
                    width: "30%",
                    borderRadius: "50%",
                    fontSize: '14px'
                }}
            />


            <div style={{ display: "flex", gap: "10px", paddingRight: "16px", alignItems: 'center' }}>
                <Popover
                    content={isLoading ? <Spin /> : (
                        <div>
                            {Mycourses.length > 0 ? (
                                Mycourses
                                    .filter(course => course.isSub)
                                    .map(course => (
                                        <Link to={'learning/course_002'}>
                                            {/* <Link to={`learning/${Mycourses.courseId}`} */}
                                            <div key={course.id} className="flex items-center mb-2 hover:shadow-lg hover:bg-slate-100 hover:bg-opacity-85 rounded-lg p-2">
                                                <div className="w-[120px] h-[70px] flex-shrink-0 rounded-md ">
                                                    <img
                                                        src={course.img}
                                                        alt={course.name}
                                                        className="w-full h-full object-cover rounded-[7px]"
                                                    />
                                                </div>
                                                <span className="ml-3 font-semibold">{course.name}</span>

                                            </div>
                                        </Link>
                                    ))
                            ) : (
                                <Empty />
                            )}
                        </div>
                    )}
                    title={<span className='ml-2 my-10'>Khóa học của tôi</span>}
                    trigger="click"
                    open={open}
                    onOpenChange={handleOpenChange}
                    overlayStyle={{ width: '400px' }}
                    onClickOutside={hide}
                >
                    <Button className='text-white' type='link'>Khóa học của tôi</Button>
                </Popover>

                <Button
                    size='large'
                    className='hover:scale-105 hover:shadow-cyan-200 hover:shadow-lg '
                    style={{
                        fontSize: '14px',
                        borderRadius: '25px',
                        padding: '0 30px'
                    }}
                    onClick={() => handleShowRegisterModal()}

                >Đăng ký
                </Button>
                <Button

                    size='large'
                    className="
                    bg-gradient-to-r 
                    from-blue-500 to-cyan-400 text-white 
                    font-medium rounded-full py-2 px-6 transition-transform duration-800
                     hover:from-cyan-400 hover:to-blue-500 hover:scale-105 hover:shadow-cyan-200 hover:shadow-lg"
                    type="primary"
                    onClick={() => handleShowLoginModal()}
                >
                    Đăng nhập
                </Button>
            </div>

            <Modal
                className='custom-modal'
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
            >
                {isRegister ?
                    <Login
                        setIslogin={handleShowLoginModal}
                        Islogin={false}
                        handleCancel={handleCancel}
                    /> :
                    <Login
                        setIslogin={handleShowRegisterModal}
                        Islogin={true}
                        handleCancel={handleCancel}
                    />
                }
            </Modal>
        </Header>
    )
}

export default HeaderCustom