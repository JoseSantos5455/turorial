import { Outlet, useNavigate } from "react-router-dom";
import { ConfigProvider, Image, Layout, Menu, theme } from "antd";
import {
  ApartmentOutlined,
  ContactsOutlined,
  DashboardOutlined,
  DollarOutlined,
  HomeFilled,
  ReadOutlined,
  UserOutlined,
  VideoCameraAddOutlined,
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import Logo from "./../assets/image/logo.png";
import LogoLetter from "./../assets/image/b.svg";
import HeaderCustom from "../components/Header/Header";
import { selectCurrentUser } from "../slices/auth.slice";
import { useSelector } from "react-redux";

const { Sider, Content } = Layout;

const MainLayout = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [collapsed, setCollapsed] = useState(true);
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);

  const handleHome = () => {
    navigate('/');
  };

  const menuItems = user?.id !== 1
    ? [
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
    ]
    : [
      {
        key: "6",
        icon: <HomeFilled />,
        label: "Trang chủ",
      },
      {
        key: "7",
        icon: <ApartmentOutlined />,
        label: "Lộ trình",
      },
      {
        key: "8",
        icon: <ContactsOutlined />,
        label: "Liên hệ",
      },
    ];

  const routes = user?.id === 1
    ? {
      '1': '/admin',
      '2': '/admin/users',
      '3': '/admin/videos',
      '4': '/admin/quizs',
      '5': '/admin/money',
    }
    : {
      '6': '/',
      '7': '/lotrinh',
      '8': '/lienhe',
    };

  const handleClick = (e) => {
    const path = routes[e.key];
    if (path) {
      navigate(path);
    }
  };

  const navbarForUser = [
    {
      key: "1",
      icon: <HomeFilled />,
      label: "Trang chủ",
    },
    {
      key: "2",
      icon: <ApartmentOutlined />,
      label: "Lộ trình",
    },
    {
      key: "4",
      icon: <ContactsOutlined />,
      label: "Liên hệ",
    }
  ]


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
        <div style={{ paddingTop: '20px', height: "60px", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div className="flex items-center space-x-3">
            {collapsed ? (
              <Image
                width={35}
                className="cursor-pointer"
                onClick={handleHome}
                preview={false}
                src={LogoLetter}
                alt="Logo Letter"
                class="h-10 w-auto"
              />
            ) : (
              <Image className="cursor-pointer" onClick={handleHome} preview={false} src={Logo} alt="Logo" />
            )}
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
            defaultSelectedKeys={[String(user?.id === 1 ? '1' : '6')]} // Chọn key đầu tiên dựa trên user
            onClick={handleClick}
            items={navbarForUser}
          />
        </ConfigProvider>
      </Sider>

      <Layout style={{ marginLeft: collapsed ? "80px" : "200px" }}>
        <HeaderCustom collapsed={collapsed} setCollapsed={setCollapsed} />
        <Content
          style={{
            margin: "80px 16px 24px",
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

export default MainLayout;
