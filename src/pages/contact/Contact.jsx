import React from 'react';
import './Contact.scss'; // Import your SCSS file
import CustomFooter from "../../components/Footer/CustomFooter";
import { Layout } from 'antd';
const ContactUs = () => {
  return (
    <div className="contact-us">
      <section className="header-section">
        <h1>Contact Us</h1>
        <p>Home / Contact Us</p>
      </section>

      <section className="contact-details">
        <div className="contact-info">
          <h2>Get in touch with us</h2>

          <div className="contact-item">
            <span className="icon phone-icon"></span>
            <div>
              <p style={{ fontSize: 18, fontWeight: "bold" }}>Call us on: +03601 885399</p>
              <p>Our office hours are Monday – Friday, 9 am–6 pm</p>
            </div>
          </div>

          <div className="contact-item">
            <span className="icon email-icon"></span>
            <div>
              <p style={{ fontSize: 18, fontWeight: "bold" }}>Email us directly:</p>
              <p>info@courselog.com</p>
            </div>
          </div>

          <div className="contact-item">
            <span className="icon location-icon"></span>
            <div>
              <p style={{ fontSize: 18, fontWeight: "bold" }}>Our Location:</p>
              <p>70-80 Upper St Norwich NR2 1LT</p>
            </div>
          </div>
        </div>

        <div className="contact-map">
          {/* Embed the Google Map iframe here */}
          <Layout style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)" }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.999873393024!2d2.294481715674226!3d48.85884497928744!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66f03e387c2b3%3A0x4bde99a12b67ac91!2sEiffel%20Tower!5e0!3m2!1sen!2sfr!4v1646320591012!5m2!1sen!2sfr"
              title="Location"
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </Layout>
        </div>
      </section>

      <section className="message-section">
        <div className="message-header">
          <h3 style={{ color: "red" }}>SENT US A MESSAGE</h3>
          <p >We will Answer all your Questions</p>
        </div>

        <div className="message-content">
          <div className="message-image">
            <img src="https://demo-themewinter.com/turitor/coursehub/wp-content/uploads/sites/3/2022/07/contact_1.jpg" alt="Description of image" />
          </div>
          <div>
            <form className="message-form">
              <input type="text" placeholder="Name" />
              <input type="email" placeholder="Email" />
              <textarea placeholder="Textarea"></textarea>
              <label className='terms-label'>
                <input type="checkbox" />
                <span>I agree to the Terms</span>
              </label>
              <button type="submit" className="send-btn">Send</button>
            </form>
          </div>
        </div>
      </section>

      <CustomFooter />
    </div>
  );
};

export default ContactUs;
