import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Breadcrumb, Button, ConfigProvider, Image, Layout, Menu, theme } from "antd";
import {
    ApartmentOutlined,
    ContactsOutlined,
    DashboardOutlined,
    DollarOutlined,
    HomeFilled,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraAddOutlined,
    ReadOutlined
} from "@ant-design/icons";
import { useState } from "react";
import Search from "antd/es/input/Search";
import Logo from "./../assets/image/logo.png";

const { Header, Sider, Content } = Layout;

const SecondLayout = ({ showFooter = true }) => {
    const {
        token: { colorBgContainer, borderRadiusLG, ...other },
    } = theme.useToken();
    const [collapsed, setCollapsed] = useState(true);

    const navigate = useNavigate();
    const location = useLocation(); // Lấy thông tin về đường dẫn hiện tại

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
    };

    // Tìm key tương ứng với đường dẫn hiện tại
    const getSelectedKey = () => {
        const { pathname } = location;

        if (pathname.startsWith('/admin')) {
            return '1';
        }
        if (pathname.startsWith('/users')) {
            return '2';
        }
        if (pathname.startsWith('/videos')) {
            return '3';
        }
        if (pathname.startsWith('/quizs')) {
            return '4';
        }
        if (pathname.startsWith('/money')) {
            return '5';
        }

        return '1'; // Mặc định chọn Dashboard
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
                    <div class="flex items-center space-x-3">
                        <Image
                            preview={false}
                            src={Logo}
                            alt="Logo"
                            class="h-10 w-auto"
                        />
                        {!collapsed && <p className="text-[white] font-bold text-xl mt-2">FOR ADMIN</p>}
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
                        style={{ marginTop: '20px', padding: "0 16px", }}
                        selectedKeys={[getSelectedKey()]} // Sử dụng selectedKeys thay vì defaultSelectedKeys
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
                        margin: "24px 16px 24px",
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
