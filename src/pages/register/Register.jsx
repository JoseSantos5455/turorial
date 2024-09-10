import { Button, Col, DatePicker, Form, Image, Input, Layout, Radio, Row, Space, message } from 'antd'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
// import { useAddUserMutation } from '../../services/userAPI';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import './Register.scss'
import imager from '../../assets/image/image-login.jpg';
import { validationPatterns } from '../../utils/utils';
import { useRegisterUserMutation } from '../../services/authAPI';
import dayjs from 'dayjs';


const Register = () => {

  const [form] = Form.useForm();
  const [registerUser, { isLoading }] = useRegisterUserMutation();
  const navigate = useNavigate();

  const handleSubmit = async (values) => {

    try {
      const user = await registerUser(values);
      // console.log(user.error.data.message);
      if (user.error) {
        message.error(user.error.data.message);
        return;
      }
      message.success(user.data.message);
      form.resetFields();
      navigate("/login");
      console.log(user);

    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Layout className='register-layout'>

      <Row className='row-layout' justify={'space-between'}>
        <Col >
          <div className='content-layout-register '>
            <div className='form-register'>
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h2 className="title-login">Sign Up</h2>
              </div>
              <Form form={form} onFinish={handleSubmit}>
                {/* <Form form={form}> */}
                <Form.Item
                  hasFeedback
                  label="Email"
                  name="email"
                  rules={[
                    {
                      required: true,
                      pattern: validationPatterns.email.pattern,
                      message: validationPatterns.email.message,
                    },
                  ]}
                >
                  <Input type="" placeholder="Email" className="form-input" />
                </Form.Item>
                <Form.Item
                  hasFeedback
                  label="Full name"
                  name="fullname"
                  rules={[
                    {
                      required: true,
                      pattern: validationPatterns.name.pattern,
                      message: validationPatterns.name.message,
                    },

                  ]}
                >
                  <Input type="" placeholder="Full name" className="form-input" />
                </Form.Item>
                <Form.Item
                  hasFeedback
                  label="Address"
                  name="address"
                  rules={[
                    {
                      required: true,
                      //     pattern: validationPatterns.name.pattern,
                      //     message: validationPatterns.name.message,
                    },

                  ]}
                >
                  <Input type="" placeholder="Address" className="form-input" />
                </Form.Item>
                <Form.Item
                  hasFeedback
                  label="Phone number"
                  name="phonenumber"
                  rules={[
                    {
                      required: true,
                      pattern: validationPatterns.phoneNumber.pattern,
                      message: validationPatterns.phoneNumber.message,
                    },
                  ]}
                >
                  <Input type="" placeholder="Phone number" className="form-input" />
                </Form.Item>

                <Form.Item
                  hasFeedback
                  label="Gender"
                  name="gender"
                  rules={[{ required: true, message: "Please select gender!" }]}
                >
                  <Radio.Group>
                    <Radio value={"Male"}>Male</Radio>
                    <Radio value={"Female"}>Female</Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.Item
                  hasFeedback
                  label="DOB"
                  name="dateOfBirth"
                  rules={[
                    // { required: true, message: "Please select your date of birth!" },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value) {
                          return Promise.reject(new Error("Please select a valid date of birth!"));
                        }
                        const selectedYear = value.year();
                        const nowYear = new Date().getFullYear();
                        const yearChecked = nowYear - selectedYear;
                        if (yearChecked >= 18 && yearChecked <= 100) {
                          return Promise.resolve();
                        } else {
                          if (yearChecked < 18) {
                            return Promise.reject(new Error("You must be at least 18 years old!"));
                          } else if (yearChecked > 100) {
                            return Promise.reject(new Error("Invalid age! Please select a valid date of birth."));
                          }
                        }
                      },
                    }),
                  ]}
                >
                  <DatePicker
                    format="DD/MM/YYYY"
                    placeholder="DD/MM/YYYY"
                    onChange={(date, dateString) => {
                      if (dateString) {
                        const formattedDate = dayjs(dateString, 'DD/MM/YYYY');
                        form.setFieldsValue({ dob: formattedDate });
                      }
                    }}
                    onBlur={() => {
                      const value = form.getFieldValue('dob');
                      if (value && dayjs(value, 'DD/MM/YYYY').isValid()) {
                        form.setFieldsValue({ dob: dayjs(value, 'DD/MM/YYYY') });
                      }
                    }}
                  />
                </Form.Item>
                <Form.Item
                  hasFeedback
                  label="Password"
                  name="password"
                  rules={[
                    {
                      required: true,
                      pattern: validationPatterns.password.pattern,
                      message: validationPatterns.password.message

                    }
                  ]}
                >
                  <Input.Password placeholder="Password" className="form-input"
                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                  />
                </Form.Item>
                <Form.Item
                  hasFeedback
                  label="Re-Type Password"
                  name="retypePassword"
                  rules={[
                    { required: true, message: 'Please re-type the password!' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('The passwords do not match!'));
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    placeholder="Re-type password"
                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                  />
                </Form.Item>

                <Form.Item>
                  {/* {!isLoading ? (
                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '2rem' }}>
                      <button
                        type="primary"
                        htmlType="submit"
                        className="submit-btn"
                      >
                        Register
                      </button>

                      <div style={{ marginLeft: '2rem' }}>
                        <span>Already have account ?</span>
                        <Link to={"/login"}><span style={{ fontSize: '16px', marginLeft: '16px' }}>Login</span> </Link>
                      </div>

                    </div>

                  ) : ( */}
                  <div className='flex items-center pt-6 mt-1'>
                    <Button className="w-36  h-14" type='primary' loading={isLoading} htmlType='submit' >Register</Button>

                    <div style={{ marginLeft: '2rem' }}>
                      <span>Already have account ?</span>
                      <Link to={"/login"}><span style={{ fontSize: '16px', marginLeft: '16px' }}>Login</span> </Link>
                    </div>
                  </div>
                  {/* )} */}
                </Form.Item>
              </Form>
            </div>

          </div>
        </Col>
        <Col>
          <div className='image-register'>
            <Image preview={false} src={imager} />
          </div></Col>
      </Row>

    </Layout>
  )
}

export default Register