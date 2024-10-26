import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Breadcrumb, Button, ConfigProvider, Image, Layout, Menu, notification, theme, Modal } from "antd";
import {
    DashboardOutlined,
    DollarOutlined,
    UserOutlined,
    VideoCameraAddOutlined,
    ReadOutlined,
    LogoutOutlined
} from "@ant-design/icons";
import { useState, useEffect, useCallback } from "react";
import Logo from "./../assets/image/logo1.png";
import { logOut } from "../slices/auth.slice";
import { useDispatch } from "react-redux";

const { Header, Sider, Content } = Layout;

// Extract getSelectedKey function outside the component
const getSelectedKey = (pathname) => {
    if (pathname.startsWith('/admin/users')) return '2';
    if (pathname.startsWith('/admin/courses')) return '3';
    if (pathname.startsWith('/admin/quizs')) return '4';
    if (pathname.startsWith('/admin/money')) return '5';
    return '1'; // Default to Dashboard
};

const SecondLayout = ({ showFooter = true }) => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const [collapsed, setCollapsed] = useState(true);
    const [selectedKey, setSelectedKey] = useState("1");

    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch()

    useEffect(() => {
        // Update selected key when location changes
        setSelectedKey(getSelectedKey(location.pathname));
    }, [location]);


    const handleLogout = useCallback(() => {
        Modal.confirm({ // Hiển thị hộp thoại xác nhận
            title: 'Xác nhận đăng xuất',
            content: 'Bạn có chắc chắn muốn đăng xuất không?',
            onOk: () => {
                dispatch(logOut());
                notification.success({
                    message: "Đăng xuất thành công",
                    description: "Hẹn gặp lại!",
                    duration: 1.5
                });
                navigate('/')
            },
        });
    }, [dispatch]);

    const handleClick = (e) => {
        const routes = {
            '1': '/admin/dashboard',
            '2': '/admin/users',
            '3': '/admin/courses',
            '6': null
        };

        const path = routes[e.key];
        if (path) {
            navigate(path);
        } else if (e.key === '6') {
            handleLogout();
        }
        setSelectedKey(e.key);
    };

    return (
        <Layout className="min-h-screen">
            <Sider
                collapsible
                collapsed={collapsed}
                onCollapse={(value) => setCollapsed(value)}
                style={{
                    height: "100vh",
                    position: "fixed",
                    left: 0,
                    top: 0,
                }}
            >
                <div
                    style={{
                        paddingTop: '20px',
                        height: "60px",
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <div className="flex items-center space-x-3">
                        <Image
                            preview={false}
                            src={Logo}
                            alt="Logo"
                            style={{ width: "100%", height: "41px" }}
                            className="h-10 w-auto"
                        />
                        {!collapsed && <p className="text-white font-bold text-xl mt-2">FOR ADMIN</p>}
                    </div>
                </div>
                <ConfigProvider
                    theme={{
                        components: {
                            Menu: {
                                colorPrimary: '#0072ff',
                            },
                        },
                    }}
                >
                    <Menu
                        theme="dark"
                        mode="inline"
                        style={{ marginTop: '20px', padding: "0 16px" }}
                        selectedKeys={[selectedKey]}
                        onClick={handleClick}
                        items={[
                            {
                                key: "1",
                                icon: <DashboardOutlined />,
                                label: "Dashboard",
                            },
                            {
                                key: "2",
                                icon: <UserOutlined />,
                                label: "Người Dùng",
                            },
                            {
                                key: "3",
                                icon: <VideoCameraAddOutlined />,
                                label: "Khóa Học",
                            },
                            {
                                key: "6",
                                icon: <LogoutOutlined />,
                                label: "Đăng xuất",
                            },
                        ]}
                    />
                </ConfigProvider>
            </Sider>

            <Layout style={{ marginLeft: collapsed ? "80px" : "200px" }}>

                <Content
                    style={{
                        margin: "24px 16px",
                        padding: 24,
                        minHeight: 280,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default SecondLayout;
