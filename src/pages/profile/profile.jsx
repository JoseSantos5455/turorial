import React, { useState } from 'react';
import { Image, Layout, Menu } from 'antd';
import Profile from '../../components/profile/profile';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentUser } from '../../slices/auth.slice';
import ChangePassword from '../../components/profile/ChangePassword';
import profileIcon from './../../assets/image/profile.svg'
import shieldIcon from './../../assets/image/shield.svg'
import { useGetUserDetailQuery } from '../../services/userAPI';


const { Sider, Content } = Layout;

const ProfilePage = () => {
    const [selectedKey, setSelectedKey] = useState('1');

    const handleMenuClick = (e) => {
        setSelectedKey(e.key);
    };
    const user = useSelector(selectCurrentUser);
    const { data: profile, isLoading } = useGetUserDetailQuery(user?.id);

    console.log(profile);
    return (
        <Layout className="min-h-screen">
            <Sider width={250} className="site-layout-background">
                <Menu
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    style={{ height: '100%', borderRight: 0 }}
                    onClick={handleMenuClick}
                    className='pr-5 w-full'
                >
                    <Menu.Item key="1"><div className='flex items-center'> <Image src={profileIcon} width={25} className='pr-2' preview={false} />Thông tin cá nhân </div></Menu.Item>
                    <Menu.Item key="2"><div className='flex items-center'> <Image src={shieldIcon} width={25} className='pr-2' preview={false} />Mật khẩu và bảo mật </div></Menu.Item>
                </Menu>
            </Sider>
            <Layout style={{ padding: '0 24px 24px' }}>
                <Content style={{ padding: 24, margin: 0, minHeight: 280 }}>
                    {selectedKey === '1' && <div> <Profile profile={profile} userId={user?.id} isLoading={isLoading}  /> </div>}
                    {selectedKey === '2' && <ChangePassword />}
                </Content>
            </Layout>
        </Layout>
    );
};

export default ProfilePage;