import React from 'react';
import './Contact.scss'; // Import your SCSS file
import CustomFooter from "../../components/Footer/CustomFooter";
import { Image, Layout } from 'antd';
import { PhoneFilled, MailOutlined } from '@ant-design/icons';
import location from '../../assets/image/location.svg'
import contact from '../../assets/image/contact.jpg'
const ContactUs = () => {
  return (
    <div className="contact-us">
      <section className="header-section">
        <h1>Liên Hệ Với Chúng Tôi</h1>
        <p>Home / Contact Us</p>
      </section>

      <section className="contact-details">
        <div className="contact-info">
          <h2>Hãy liên lạc với chúng tôi</h2>

          <div className="contact-item">
            <p><PhoneFilled style={{ marginRight: '20px', fontSize: '25px', color: '#fff', padding: '12px', backgroundColor: '#2878eb', borderRadius: '50%' }} /></p>

            <div>
              <p style={{ fontSize: 18, fontWeight: "bold" }}>Gọi chúng tôi: +03601 885399</p>
              <p>Giờ làm việc của chúng tôi Thứ 2 – Thứ 6, 9 am–6 pm</p>
            </div>
          </div>

          <div className="contact-item">
            <p><MailOutlined style={{ marginRight: '20px', fontSize: '25px', color: '#fff', padding: '12px', backgroundColor: '#ffa100', borderRadius: '50%' }} /></p>

            <div>
              <p style={{ fontSize: 18, fontWeight: "bold" }}>Gửi email trực tiếp:</p>
              <p>info@courselog.com</p>
            </div>
          </div>

          <div className="contact-item">

            <p>
              <Image
                src={location}
                alt="Location Icon"
                style={{
                  width: '50px',
                  marginRight: '20px',
                  fontSize: '22px',
                  color: '#fff',
                  padding: '12px',
                  backgroundColor: '#1dc295',
                  borderRadius: '50%',
                }}
              />
            </p>

            <div>
              <p style={{ fontSize: 18, fontWeight: "bold" }}>Vị Trí:</p>
              <p>Lô E2a-7, Đường D1, Đ. D1, Long Thạnh Mỹ, Thành Phố Thủ Đức, Hồ Chí Minh</p>
            </div>
          </div>
        </div>

        <div className="contact-map">
          {/* Embed the Google Map iframe here */}
          <Layout style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)" }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.6084923886146!2d106.80801617780807!3d10.841243500173142!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752731176b07b1%3A0xb752b24b379bae5e!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBGUFQgVFAuIEhDTQ!5e0!3m2!1svi!2s!4v1726135289991!5m2!1svi!2s"
              title="Location"
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </Layout>
        </div>
      </section>

      <section className="message-section">
        <div className="message-header">
          <h3 style={{ color: "red", fontSize: '22px' }}>GỬI THƯ CHO CHÚNG TÔI</h3>
          <p >Chúng Tôi Sẽ Trả Lời Câu Hỏi Của Bạn</p>
        </div>

        <div className="message-content">
          <div className="message-image">
            <img src={contact} alt="Description of image" />
          </div>
          <div>
            <form className="message-form">
              <input type="text" placeholder="Name" />
              <input type="email" placeholder="Email" />
              <textarea placeholder="Textarea"></textarea>
              <label className='terms-label'>
                <input type="checkbox" />
                <span>Tôi đồng ý với điều khoảng</span>
              </label>
              <button type="submit" className="send-btn">Gửi</button>
            </form>
          </div>
        </div>
      </section>

      <CustomFooter />
    </div>
  );
};

export default ContactUs;
