import { Button, Col, Form, Image, Input, Layout, message, Row } from 'antd'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { EyeInvisibleOutlined, EyeTwoTone, FormOutlined, LockOutlined } from '@ant-design/icons';
import { validationPatterns } from '../../utils/utils';
import Logo from '../../assets/image/logo.png'
import ImportIcon from '../../assets/Icon';
import { useRegisterUserMutation } from '../../services/authAPI';

const Register = ({ setIslogin, handleOpenModalForgotPass }) => {

  const [form] = Form.useForm();
  const [registerUser, { isLoading }] = useRegisterUserMutation();
  const navigate = useNavigate();

  const handleSubmit = async (values) => {

    try {
      const user = await registerUser(values);
      console.log(user);
      if (user.data.status !== "CREATED") {
        const messsage = "User registered unsuccessfully!"
        message.success(messsage);
        return;
      }
      const messsage = "User registered successfully!"
      message.success(messsage);
      form.resetFields();

    } catch (error) {
      console.log(error);
    }
  }

  return (


    <Row className='row-layout' justify={'center'}>
      <Col >
        <div className="flex flex-col text-center items-center justify-center py-7 w-[100%] ">
          <Image
            width={50}
            height={40}
            preview={false}
            src={Logo}
          />
          <p className="text-3xl font-Bold p-4">Đăng nhập vào Blue</p>
          <p className="text-sm w-[80%] text-red-500">Mỗi người nên sử dụng riêng một tài khoản, tài khoản nhiều người
            sử dụng chung sẽ bị khóa.
          </p>
        </div>
        <Form
          form={form}
          onFinish={handleSubmit}
          className='w-[70%] mx-auto'
        >
          {/* <Form form={form}> */}
          <div>
            <label className='font-SemiBold ml-1'>Tên của bạn</label>
            <Form.Item
              className='mt-1 mb-2'
              hasFeedback
              name="full_name"
              rules={[
                {
                  required: true,
                  pattern: validationPatterns.name.pattern,
                  message: validationPatterns.name.message,
                },

              ]}
            >
              <Input
                prefix={<FormOutlined />}
                size='large'
                type=""
                placeholder="   Họ và Tên"
                className="form-input"
              />
            </Form.Item>

            <label className='font-SemiBold ml-1'>Email của bạn</label>
            <Form.Item
              className='mt-1 mb-4'
              hasFeedback
              name="email"
              rules={[
                {
                  required: true,
                  pattern: validationPatterns.email.pattern,
                  message: validationPatterns.email.message,
                },
              ]}
            >
              <Input
                size='large'
                type=""
                placeholder="  Nhập vào Email"
                className="form-input"
                prefix={ImportIcon.GmailIcon()}
              />
            </Form.Item>

            <label className='font-SemiBold ml-1 '>Mật khẩu</label>
            <Form.Item
              className=' mb-4'
              hasFeedback
              name="password"
              rules={[
                {
                  required: true,
                  pattern: validationPatterns.password.pattern,
                  message: validationPatterns.password.message

                }
              ]}
            >
              <Input.Password
                placeholder="Mật khẩu"
                className="form-input"
                size='large'
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>
            <Form.Item
              className='mt-1 mb-2'
              hasFeedback
              name="retype_password"
              rules={[
                { required: true, message: 'Nhập lại mật khẩu để xác nhận!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Mật khẩu không khớp!'));
                  },
                }),
              ]}
            >
              <Input.Password
                size='large'
                placeholder="Nhập lại mật khẩu"
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
              <Button

                size='large'
                className="w-[100%] mb-4 mt-5 bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-medium rounded-full py-2 px-6 transition-transform duration-800hover:from-cyan-400 hover:to-blue-500 hover:scale-105 hover:shadow-cyan-200 hover:shadow-lg"
                type="primary"
                htmlType="submit"
                loading={isLoading}
              >
                Đăng ký
              </Button>

              <div className='text-center mt-4'>
                <p className="mt-4">Bạn đã có tài khoản?
                  <button onClick={setIslogin} className="text-orange-500 pl-1 text-[15px] font-SemiBold">
                    <u>Đăng nhập</u>
                  </button>
                </p>
                <button
                  className="mt-3"
                  onClick={handleOpenModalForgotPass}>
                  <u className="text-orange-500 pl-1 text-[15px] font-SemiBold">
                    Quên mật khẩu?
                  </u>
                </button>
              </div>
            </Form.Item>
          </div>
        </Form>
      </Col>
    </Row>

  )
}

export default Register