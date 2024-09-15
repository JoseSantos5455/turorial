
import { Button, Layout, Modal } from 'antd'
import Search from 'antd/es/input/Search'
import React, { useState } from 'react'
import './Header.scss';
import Login from '../../pages/login/Login';
const HeaderCustom = ({ collapsed }) => {

    const { Header } = Layout;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isRegister, setIsRegister] = useState(true);


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

            <div style={{ display: "flex", gap: "10px", paddingRight: "16px" }}>
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