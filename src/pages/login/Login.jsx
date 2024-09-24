import { Button, Col, Divider, Form, Image, Input, Layout, message, Row, Space } from "antd";
import "./../../components/login/Login.scss";

import { useSelector } from "react-redux";
// import { selectCurrenToken } from "../../slices/auth.slice";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import { BackwardOutlined, LeftOutlined, LoadingOutlined, UserOutlined } from "@ant-design/icons";
import Logo from '../../assets/image/logo.png';
import LoginForm from "../../components/login/FormLogin.jsx";
import { selectCurrentToken } from "../../slices/auth.slice.js";
import { useResetPasswordMutation, useVerifyOtpMutation } from "../../services/authAPI.js";
import { useForm } from "antd/es/form/Form.js";
import ImportIcon from "../../assets/Icon.jsx";
import ForgotPass from "../forgotpass/ForgotPass.jsx";
import Register from "../register/Register.jsx";
function Login({ setIslogin, Islogin, handleCancel }) {
  const token = useSelector(selectCurrentToken);
  const navigate = useNavigate();
  const [isSendOTP, setIsSendOTP] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingSendOTP, setIsLoadingSendOTP] = useState(false)
  const [isLoadingResetPassword, setIsLoadingResetPassword] = useState(false)
  const [isFogotPasswords, setIsFogotPasswords] = useState(false);
  const [sendOtp, { isLoadingSending }] = useVerifyOtpMutation()
  const [resetPas] = useResetPasswordMutation()
  const [form] = useForm();
  const [isLoginNormal, setIsLoginNormal] = useState(false)
  const [isForgotPass, setIsForgotPass] = useState(false)
  const [isPress, setIsPress] = useState(false)

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  const setFogotPassword = () => {
    setIsFogotPasswords(!isFogotPasswords);
  }

  const handleSendOtp = async (values) => {
    setIsLoadingSendOTP(true);
    try {
      const response = await sendOtp(values).unwrap();
      console.log(response)
      if (response.code == 200) {
        setIsSendOTP(true);
      }
    } catch (error) {
      console.error("Failed to send OTP:", error);
    }
    finally {
      setIsLoadingSendOTP(false);
    }
  };

  const handleResetPass = async (values) => {
    setIsLoadingResetPassword(true);
    try {
      const response = await resetPas({ token: values.otp, newPassword: values.newPassword }).unwrap();
      console.log(response)
      message.success("Password reset successful! ")
      setFogotPassword();
      form.resetFields();
    } catch (error) {
      console.error("Failed to send OTP:", error);
    }
    finally {
      setIsLoadingResetPassword(false);
    }
  };

  const handleNavigate = () => {
    handleCancel()
    navigate('/law')
  }

  const handleOpenModalForgotPass = () => {
    setIsLoginNormal(true)
    setIsForgotPass(true);
  }
  const handleCloseModal = () => {
    setIsLoginNormal(false)
    setIsForgotPass(false);
  }

  return (
    <>
      {isLoading ? (
        <div>
          <LoadingOutlined />
        </div>
      ) : (
        <>
          {isLoginNormal == false ? (
            <div className="h-[100%] flex flex-col items-center">
              {/* header */}
              <div className="flex flex-col text-center items-center justify-center mt-14 w-[80%] ">
                <Image
                  width={50}
                  height={40}
                  preview={false}
                  src={Logo}
                />
                <p className="text-3xl font-Bold p-4">Đăng nhập vào Blue</p>
                <p className="text-sm text-red-500">Mỗi người nên sử dụng riêng một tài khoản, tài khoản nhiều người
                  sử dụng chung sẽ bị khóa.
                </p>
                {/* button */}
                <div className="mt-6">
                  {Islogin == true ? (
                    <button
                      onClick={() => setIsLoginNormal(true)}
                      className="bg-white 
                  py-2 px-20 relative 
                  rounded-full border-[2.5px] 
                  border-[#dce0e3] hover:bg-[#dce0e3]
                  transition duration-200
                  mb-3 min-w-[326px]
                  ">
                      <span className="absolute left-3"><UserOutlined style={{ fontSize: '20px', color: 'grey' }} /></span>
                      <span className="font-SemiBold">Sử dụng email / số điện thoại</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsLoginNormal(true)}
                      className="bg-white 
                  py-2 px-20 relative 
                  rounded-full border-[2.5px] 
                  border-[#dce0e3] hover:bg-[#dce0e3]
                  transition duration-200
                  mb-3 min-w-[326px]
                  ">
                      <span className="absolute left-3"><UserOutlined style={{ fontSize: '20px', color: 'grey' }} /></span>
                      <span className="font-SemiBold">Đăng ký với email</span>
                    </button>
                  )}

                  <button
                    className="bg-white 
                  py-2 px-20 relative 
                  rounded-full border-[2.5px] 
                  border-[#dce0e3] hover:bg-[#dce0e3]
                  transition duration-200
                  mb-3 min-w-[326px]
                  ">
                    <span className="absolute left-3">{ImportIcon.google()}</span>
                    <span className="font-SemiBold">Đăng nhập với Google</span>
                  </button>
                  <button

                    className="bg-white 
                  py-2 px-20 relative 
                  rounded-full border-[2.5px] 
                  border-[#dce0e3] hover:bg-[#dce0e3]
                  transition duration-200
                  mb-3 min-w-[326px]
                  ">
                    <span className="absolute left-3">{ImportIcon.facebook()}</span>
                    <span className="font-SemiBold">Đăng nhập với Facebook</span>
                  </button>
                  <button

                    className="bg-white 
                  py-2 px-20 relative 
                  rounded-full border-[2.5px] 
                  border-[#dce0e3] hover:bg-[#dce0e3]
                  transition duration-200
                  mb-3 min-w-[326px]
                  ">
                    <span className="absolute left-3">{ImportIcon.github()}</span>
                    <span className="font-SemiBold">Đăng nhập với Github</span>
                  </button>
                </div>
                <div>
                  <p className="mt-4">Bạn chưa có tài khoản?
                    {Islogin ? (
                      <button onClick={setIslogin} className="text-orange-500 pl-1 text-[15px] font-SemiBold">
                        <u>Đăng ký</u>
                      </button>
                    ) : (
                      <button onClick={setIslogin} className="text-orange-500 pl-1 text-[15px] font-SemiBold">
                        <u>Đăng nhập</u>
                      </button>
                    )}
                  </p>
                  <button
                    className="mt-3"
                    onClick={handleOpenModalForgotPass}>
                    <u className="text-orange-500 pl-1 text-[15px] font-SemiBold">
                      Quên mật khẩu?
                    </u>
                  </button>
                  <p className="py-3">Việc bạn tiếp tục sử dụng trang web này đồng nghĩa bạn đồng ý với&nbsp;
                    <button onClick={handleNavigate} className="text-orange-500"> <u className="button x-[2px]"> điều khoản sử dụng </u></button>
                    &nbsp;của chúng tôi.
                  </p>
                </div>
              </div>
            </div>
          ) : (

            <div>
              <Button onClick={handleCloseModal}
                type="link"
                icon={<LeftOutlined />}
                iconPosition="start"
              >
                Quay lại
              </Button>
              {!isForgotPass ? (
                Islogin == false ? (
                  <Register
                    setIslogin={setIslogin}
                    handleOpenModalForgotPass={handleOpenModalForgotPass}
                  />
                ) : (
                  <LoginForm
                    handleCancel={handleCancel}
                    handleOpenModalForgotPass={handleOpenModalForgotPass}
                    Islogin={Islogin}
                    setIslogin={setIslogin}
                  />
                )
              ) : (
                <ForgotPass   setIsForgotPass={setIsForgotPass} />
              )}
            </div>
          )}
        </>
      )}
    </>
  );
}

export default Login;