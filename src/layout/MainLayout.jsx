import { Outlet, useNavigate } from "react-router-dom";
import { Breadcrumb, Button, ConfigProvider, Image, Layout, Menu, theme } from "antd";
import {
  ApartmentOutlined,
  ContactsOutlined,
  HomeFilled,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import Search from "antd/es/input/Search";
import Logo from "./../assets/image/logo_tutorial.jpg"
import HeaderCustom from "../components/Header/Header";
import Lotrinh from "../assets/image/road.svg"
const { Header, Sider, Content } = Layout;

const MainLayout = ({ showFooter = true }) => {
  const {
    token: { colorBgContainer, borderRadiusLG, ...other },
  } = theme.useToken();
  const [collapsed, setCollapsed] = useState(false);

  const navigate = useNavigate();

  const handleClick = (e) => {
    const routes = {
      '1': '/',
      '2': '/lotrinh',
      '3': '/baiviet',
      '4': '/lienhe'
    };

    const path = routes[e.key];
    if (path) {
      navigate(path);
    }
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
            <img
              src={Logo}
              alt="Logo"
              class="h-12 w-auto"
            />
            {!collapsed && <h1 class="text-xs text-white font-semibold">Ươn mầm sử sách Việt</h1>}
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
            defaultSelectedKeys={["1"]}
            onClick={handleClick}
            items={[
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
                key: "3",
                icon: <UploadOutlined />,
                label: "nav 3",
              },
              {
                key: "4",
                icon: <ContactsOutlined />,
                label: "Liên hệ",
              },
            ]}
          />
        </ConfigProvider>

      </Sider>

      <Layout style={{ marginLeft: collapsed ? "80px" : "200px" }}>
        <HeaderCustom
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />
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
