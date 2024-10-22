
import { Button, Dropdown, Empty, Image, Layout, Modal, Popover, Spin, Progress, notification } from 'antd'
import Search from 'antd/es/input/Search'
import React, { useCallback, useMemo, useState } from 'react'
import './Header.scss';
import Login from '../../pages/login/Login';
// import { useGetMyCourseQuery } from '../../services/coursesAPI';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logOut, selectCurrentToken, selectCurrentUser } from '../../slices/auth.slice';
import { navigate } from '../../utils/navigate';
import { LoginOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import userIcon from '../../assets/image/graduate.svg'
import AuthGuard from '../../routes/AuthGuard';
import { hideLoginModal, hideRegisterModal, selectIsLoginModalVisible, selectIsRegisterModalVisible, showLoginModal, showRegisterModal } from '../../slices/modal.slice';
import { useGetUserDetailQuery } from '../../services/userAPI';
const HeaderCustom = ({ collapsed }) => {

    // const { data: Mycourses, error, isLoading } = useGetMyCourseQuery();
    const { Header } = Layout;
    const isModalVisible = useSelector(selectIsLoginModalVisible);
    const isRegisterModalVisible = useSelector(selectIsRegisterModalVisible);
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch()
    const [isActive, setIsActive] = useState(false);
    const user = useSelector(selectCurrentUser);
    const { data: profile, isLoading: isloadingProfile } = useGetUserDetailQuery(user?.id);



    const handleLogout = useCallback(() => {
        dispatch(logOut());
        notification.success({
            message: "Đăng xuất thành công",
            description: "Hẹn gặp lại!",
            duration: 1.5
        });
        navigate("/login");
    }, [dispatch, navigate]);



    const hide = () => {
        setOpen(false);
    };

    const twoColors = {
        '0%': '#108ee9',
        '100%': '#87d068',
    };

    const handleOpenChange = (newOpen) => {
        setOpen(newOpen);
    };

    const handleShowLoginModal = () => {
        dispatch(showLoginModal());
    };

    const handleShowRegisterModal = () => {
        dispatch(showRegisterModal());
    };

    const handleCancel = () => {
        dispatch(hideLoginModal());
        dispatch(hideRegisterModal());
    };
    const items = useMemo(() => [
        {
            key: '1',
            label: (
                <Link to='/profile' style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <p style={{ paddingRight: '20px' }}>Cài đặt</p> <SettingOutlined />
                </Link>
            ),
        },
        {
            key: '2',
            label: (
                <p onClick={handleLogout} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <p style={{ paddingRight: '20px' }}>Đăng xuất</p> <LogoutOutlined />
                </p>
            ),
        },
    ], [handleLogout]);

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
                {user ? (
                    <div className='mr-10 flex items-center justify-center'>


                        <Dropdown
                            trigger="click"
                            menu={{ items: items }}
                            placement="bottom"
                            onOpenChange={(open) => setIsActive(open)}
                        >
                            <div className='flex items-center justify-center bg-cyan-600 rounded-full'>
                                <button className='flex rounded-full p-1' aria-label="User menu">
                                    <Image className='rounded-full hover:shadow-xl hover:shadow-cyan-300' preview={false} width={40} height={40} src={profile?.avatar || userIcon} />
                                </button>
                            </div>
                        </Dropdown>
                    </div>
                ) : (
                    <>
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
                    </>
                )}
            </div>
            <Modal
                className='custom-modal'
                open={isModalVisible}
                onCancel={handleCancel}
                footer={null}
            >
                {isRegisterModalVisible ?
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