import { Outlet, useNavigate } from "react-router-dom";
import { ConfigProvider, Image, Layout, Menu, Tag, theme } from "antd";
import {
  ApartmentOutlined,
  ContactsOutlined,
  DollarOutlined,
  HomeFilled,
} from "@ant-design/icons";
import { useState } from "react";
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



  const routes =
  {
    '1': '/',
    '2': '/lotrinh',
    '3': '/lienhe',
    '4': '/combo',
  }


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
      key: "3",
      icon: <ContactsOutlined />,
      label: "Liên hệ",
    },
    {
      key: "4",
      icon: <DollarOutlined />,
      label: "Mua gói",
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
                src={Logo}
                alt="Logo Letter"
                class="h-10 w-auto"
              />


            ) : (
              <div className="flex flex-col relative" >
                <Image className="cursor-pointer" style={{ width: "80px", height: "41px" }} onClick={handleHome} preview={false} src={Logo} alt="Logo" />
                <Tag className="absolute bottom-[-32px]" color="#f50"><span className="text-yellow-300 font-semibold">Education</span> </Tag>
              </div>
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
            style={{ marginTop: '40px', padding: "0 16px" }}
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
