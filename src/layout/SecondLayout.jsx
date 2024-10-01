import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Breadcrumb, Button, ConfigProvider, Image, Layout, Menu, theme } from "antd";
import {
    DashboardOutlined,
    DollarOutlined,
    UserOutlined,
    VideoCameraAddOutlined,
    ReadOutlined
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import Logo from "./../assets/image/logo.png";

const { Header, Sider, Content } = Layout;

// Extract getSelectedKey function outside the component
const getSelectedKey = (pathname) => {
    if (pathname.startsWith('/admin/users')) return '2';
    if (pathname.startsWith('/admin/videos')) return '3';
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

    useEffect(() => {
        // Update selected key when location changes
        setSelectedKey(getSelectedKey(location.pathname));
    }, [location]);

    const handleClick = (e) => {
        const routes = {
            '1': '/admin',
            '2': '/admin/users',
            '3': '/admin/videos',
            '4': '/admin/quizs',
            '5': '/admin/money'
        };

        const path = routes[e.key];
        if (path) {
            navigate(path);
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
                                key: "4",
                                icon: <ReadOutlined />,
                                label: "Bài Tập",
                            },
                            {
                                key: "5",
                                icon: <DollarOutlined />,
                                label: "Doanh Thu",
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
