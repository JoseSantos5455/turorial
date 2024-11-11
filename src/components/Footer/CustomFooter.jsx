import React from "react";
import { Layout, Row, Col, Divider, Image, Input, Button } from "antd";
import logo from "./../../assets/image/logo1.png";
const { Footer } = Layout;
import './Footer.scss'
import { FacebookFilled, InstagramFilled, PhoneFilled, PhoneOutlined, SendOutlined, TikTokOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

function CustomFooter() {
  return (
    <Footer style={{ backgroundColor: "#f0f2f5", padding: "20px 10px 40px 10px" }}>
      <div style={{ display: 'flex', justifyContent: 'center', borderBottom: '1px solid #d9d9db', marginBottom: '20px' }}>
        <Image width={80} src={logo} className="mb-4" preview={false} />
      </div>
      <Row justify={"space-between"} style={{ margin: '0 10px' }} gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <div className="containerF">
            <p className="title">Liên hệ chúng tôi</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div >
                <p><PhoneFilled style={{ fontSize: '22px', color: '#fff', padding: '12px', backgroundColor: '#727375', borderRadius: '50%' }} /></p>
              </div>
              <div>
                <p className="subtitle">Gọi chúng tôi</p>
                <p>0336504192</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '20px' }}>
              <div >
                <p><SendOutlined style={{ fontSize: '22px', color: '#fff', padding: '12px', backgroundColor: '#1c4c93 ', borderRadius: '50%' }} /></p>
              </div>
              <div>
                <p className="subtitle">Gửi mail cho chúng tôi</p>
                <a href="https://mail.google.com/mail/?view=cm&fs=1&to=blueedu.info2024@gmail.com" target="_blank" rel="noopener noreferrer">
                  Gửi mail
                </a>
              </div>
            </div>
          </div>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <div className="containerF">
            <p className="title">Về chúng tôi</p>
            <Row>
              <Col span={12} style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontWeight: '600' }}>
                <Link>Giới thiệu về chúng tôi</Link>
                <Link>Các khóa học</Link>
                <Link>Vị trí</Link>
                <Link>Mua gói học</Link>
              </Col>
              <Col span={12} style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontWeight: '600' }}>
                <Link>Khóa học lịch sử lớp 9</Link>
                <Link>Tài liệu tham khảo</Link>
                <Link>Hỗ trợ học viên</Link>
              </Col>

            </Row>
          </div>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <div className="containerF">
            <h4 className="title">Đăng ký</h4>
            <p style={{ width: '200px' }} className="content">
              Đăng ký nhận bản tin Blue để nhận tất cả các tin tức ưu đãi và giảm giá từ trang web Blue.
            </p>
            <Input style={{ height: '45px', marginTop: '10px' }} placeholder="Type in your email address" />
            <Button type="primary" style={{ backgroundColor: '#1c4c93', height: '45px', width: '120px', marginTop: '20px' }}><p style={{ fontWeight: '600' }}>Đăng ký</p></Button>
          </div>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <div className="containerF">
            <p className="title">Mạng xã hội</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div >
                <p><FacebookFilled style={{ fontSize: '22px', color: '#fff', padding: '12px', backgroundColor: '#0866ff', borderRadius: '50%' }} /></p>
              </div>
              <div>
                <p className="subtitle">Facebook</p>
                <a href="https://www.facebook.com/profile.php?id=61566399880813" target="_blank" rel="noopener noreferrer">Blue Edu</a>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '20px' }}>
              <div >
                <p><TikTokOutlined style={{ fontSize: '22px', color: '#fff', padding: '12px', backgroundColor: 'black ', borderRadius: '50%' }} /></p>
              </div>
              <div>
                <p className="subtitle">Tiktok</p>
                <a href="https://www.tiktok.com/@blue.edu2024" target="_blank" rel="noopener noreferrer">Blue Edu</a>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Footer>
  );
}

export default CustomFooter;