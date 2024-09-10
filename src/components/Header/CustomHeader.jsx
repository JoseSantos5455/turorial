import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Layout, Menu, Drawer, Grid, Image, Dropdown, notification } from "antd";
import "./CustomHeader.scss";
import { DoubleRightOutlined, FacebookOutlined, FormOutlined, InstagramOutlined, LoginOutlined, LogoutOutlined, MenuOutlined, UserOutlined } from "@ant-design/icons";
import NameWeb from "../../../src/assets/image/logo.svg"
import { logOut, selectCurrentToken } from "../../slices/auth.slice";
import { useDispatch, useSelector } from "react-redux";
const { Header } = Layout;
const { useBreakpoint } = Grid;

const CustomHeader = () => {
    const screens = useBreakpoint();
    const [prevScrollPos, setPrevScrollPos] = useState(0);
    const [visible, setVisible] = useState(true);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const user = useSelector(selectCurrentToken);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollPos = window.pageYOffset;
            setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
            setPrevScrollPos(currentScrollPos);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [prevScrollPos]);

    const handleLogout = useCallback(() => {
        dispatch(logOut());     
        notification.success({
            message: "Logout successfully",
            description: "See you again!",
            duration: 1.5
        });
        navigate("/login");
    }, [dispatch, navigate]);

    const itemsNoLogin = useMemo(() => [
        {
            key: '1',
            label: (
                <Link to='/login' style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <p style={{ paddingRight: '20px' }}>Login</p> <LoginOutlined />
                </Link>
            ),
        },
        {
            key: '2',
            label: (
                <Link to='/register' style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <p style={{ paddingRight: '20px' }}>Register</p> <FormOutlined />
                </Link>
            ),
        },
    ], []);

    const items = useMemo(() => [
        {
            key: '1',
            label: (
                <Link to='/profile' style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <p style={{ paddingRight: '20px' }}>Profile</p> <LoginOutlined />
                </Link>
            ),
        },
        {
            key: '2',
            label: (
                <p onClick={handleLogout} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <p style={{ paddingRight: '20px' }}>Log out</p> <LogoutOutlined />
                </p>
            ),
        },
    ], [handleLogout]);

    return (
        <Header id="header" className={visible ? "show" : "hidden"} style={{ zIndex: '1000' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <Link to={"/"} style={{ marginLeft: '6rem' }}>
                    <div className="header-logo">
                        <Image src={NameWeb} preview={false} />
                    </div>
                </Link>
                {screens.md ? (
                    <Menu mode="horizontal" defaultSelectedKeys={["1"]} style={{ width: 'fit-content', backgroundColor: 'none', marginLeft: '2.2rem' }}>
                        <Menu.Item key="1">
                            <Link to="/">Home</Link>
                        </Menu.Item>
                        <Menu.Item key="2">
                            <Link to="admin">About</Link>
                        </Menu.Item>
                        <Menu.Item key="3">
                            <Link to="/">Community</Link>
                        </Menu.Item>
                        <Menu.Item key="4">
                            <Link to="home">Search</Link>
                        </Menu.Item>
                        <Menu.Item key="5">
                            <Link to="admin">Pricing</Link>
                        </Menu.Item>
                    </Menu>
                ) : (
                    <Button className="menu-btn" onClick={() => setDrawerVisible(true)} style={{ marginRight: '40px' }} aria-label="Open menu">
                        <MenuOutlined />
                    </Button>
                )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', zIndex: '110000' }}>
                <div style={{ display: 'flex', gap: '20px', marginRight: '20px' }}>
                    <Link aria-label="Facebook"><FacebookOutlined style={{ fontSize: '20px' }} /></Link>
                    <Link aria-label="Instagram"><InstagramOutlined style={{ fontSize: '20px' }} /></Link>
                </div>
                <Dropdown
                    menu={{ items: user ? items : itemsNoLogin }}
                    placement="bottom"
                    onOpenChange={(open) => setIsActive(open)}
                >
                    <Button className={`btn-user ${isActive ? 'active' : ''}`} aria-label="User menu">
                        <UserOutlined style={{ fontSize: '20px', color: isActive ? '#1f9bff' : '#000' }} />
                    </Button>
                </Dropdown>
            </div>
            <Drawer
                title="Navigation"
                placement="right"
                closable={false}
                onClose={() => setDrawerVisible(false)}
                open={drawerVisible}
            >
                <Menu
                    mode="vertical"
                    defaultSelectedKeys={["1"]}
                    style={{ width: '100%' }}
                    onClick={() => setDrawerVisible(false)}
                >
                    <Menu.Item key="1">
                        <Link to="/">Home</Link>
                    </Menu.Item>
                    <Menu.Item key="3">
                        <Link to="admin">About</Link>
                    </Menu.Item>
                    <Menu.Item key="4">
                        <Link to="/">Community</Link>
                    </Menu.Item>
                    <Menu.Item key="5">
                        <Link to="home">Search</Link>
                    </Menu.Item>
                    <Menu.Item key="6">
                        <Link to="admin">Pricing</Link>
                    </Menu.Item>
                </Menu>
            </Drawer>
        </Header>
    );
};

export default CustomHeader;
