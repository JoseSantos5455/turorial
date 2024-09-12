import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Button, Layout, Modal, theme } from 'antd'
import Search from 'antd/es/input/Search'
import React, { useState } from 'react'
import './Header.scss';
import LoginForm from '../login/FormLogin';
import Register from '../../pages/register/Register';
import Login from '../../pages/login/Login';
const HeaderCustom = ({ collapsed, setCollapsed }) => {

    const { Header, Sider, Content } = Layout;
    const {
        token: { colorBgContainer, borderRadiusLG, colorBgLayout },
    } = theme.useToken();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isRegister, setIsRegister] = useState(true); // Quản lý trạng thái đăng ký/đăng nhập

    const showModal = (type) => {
        setIsRegister(type === 'register');
        setIsModalOpen(true);
    };

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
                    onClick={() => showModal('register')}

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
                    onClick={() => showModal('login')}
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
                {!isRegister ?
                    <Login
                        setIslogin={setIsRegister}
                        Islogin={isRegister}
                    /> :
                    <Register />}
            </Modal>
        </Header>
    )
}

export default HeaderCustom