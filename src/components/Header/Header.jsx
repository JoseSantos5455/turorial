import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Button, Layout, theme } from 'antd'
import Search from 'antd/es/input/Search'
import React from 'react'

const HeaderCustom = ({ collapsed, setCollapsed }) => {
    const { Header, Sider, Content } = Layout;
    const {
        token: { colorBgContainer, borderRadiusLG,colorBgLayout  },
    } = theme.useToken();
    return (
        <Header
            style={{
                padding: 0,
                background: '#001529',
                position: "fixed",
                width: `calc(100% - ${collapsed ? "80px" : "200px"})`,
                zIndex: 10000,
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
                    fontSize:'14px'
                }}
            />

            <div style={{ display: "flex", gap: "10px", paddingRight: "16px" }}>
                <Button type="primary">Đăng nhập</Button>
                <Button>Đăng ký</Button>
            </div>

        </Header>
    )
}

export default HeaderCustom