import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Form, Input, Button, Alert, notification, message, Image, Checkbox } from "antd";
import "./Login.scss";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { EyeInvisibleOutlined, EyeTwoTone, LockFilled, LockOutlined, SmileFilled, SmileOutlined, UserOutlined } from "@ant-design/icons";
import { useLoginUserMutation } from "../../services/authAPI";
import { setToken, setUser } from "../../slices/auth.slice";
import Cookies from "js-cookie";
import Logo from '../../assets/image/logo.png';



const LoginForm = ({ Islogin, handleOpenModalForgotPass, setIslogin }) => {
  const [form] = Form.useForm();
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const location = useLocation()
  const navigate = useNavigate();
  const [rememberMe, setRememberMe] = useState(false);
  const [loginUser, { isLoading }] = useLoginUserMutation();


  useEffect(() => {

    const savedEmail = Cookies.get("rememberEmail");
    const savedPassword = Cookies.get("rememberPassword");

    if (savedEmail && savedPassword) {
      form.setFieldsValue({
        email: savedEmail,
        password: savedPassword,
      });
      setRememberMe(true);
    }
  }, [form]);

  const handleLoginSuccess = (data) => {
    const user = data.data.user;
    const token = data.data.token;

    dispatch(setUser(user));
    dispatch(setToken(token));

    // remember me
    if (rememberMe) {
      Cookies.set("rememberEmail", form.getFieldValue("email"), { expires: 7 }); // Lưu trong 7 ngày
      Cookies.set("rememberPassword", form.getFieldValue("password"), { expires: 7 });
    } else {

      Cookies.remove("rememberEmail");
      Cookies.remove("rememberPassword");
    }

    notification.success({
      message: "Login successfully",
      duration: 2,
      description: (
        <div>
          Welcome {user.userName} <SmileOutlined />
        </div>
      ),
    });

    const from = location.state?.from || "/";
    navigate(from);
  };

  const handleLoginFailure = (error, email) => {
    if (error.data) {
      setError(error.data.message); // Set error message
      // message.error(error.data.message);
    } else {
      setError("Tài khoản hoặc mật khẩu không đúng. vui lòng thử lại!"); // Set default error message
      notification.error({
        message: "Lỗi đăng nhập",
        description: "Tài khoản hoặc mật khẩu không đúng. vui lòng thử lại!",
      });
    }

    form.resetFields();
  };

  const handleSubmit = async (values) => {
    try {
      const result = await loginUser({ email: values.email, password: values.password });
      console.log(result);
      if (result.data) {
        handleLoginSuccess(result.data);
      } else {
        handleLoginFailure(result.error, values.email);
      }
    } catch (error) {
      console.error("Login error:", error);
      message.error("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <div className="flex flex-col text-center items-center justify-center w-full ">
      <div className="flex flex-col text-center items-center justify-center mt-8 w-[80%] ">
        <Image
          width={50}
          height={40}
          preview={false}
          src={Logo}
        />
        <p className="text-3xl  font-Bold p-5">Đăng nhập vào Blue</p>
        <p className="text-sm mb-4 text-red-500">Mỗi người nên sử dụng riêng một tài khoản, tài khoản nhiều người
          sử dụng chung sẽ bị khóa.
        </p>
      </div>
      <div className="form-container">
        <Form form={form} onFinish={handleSubmit}>
          {error && (
            <>
              <Alert message={error} type="error" showIcon />
              <br />
            </>
          )}
          <Form.Item

            style={{ marginBottom: '0.5rem' }}
            name="email"
            rules={[{ required: true, message: "Trường này không được để trống" }]}
          // rules={[
          //   {
          //     required: true,
          //     pattern: /^[\w-]+(\.[\w-]+)*@(gmail\.com|fpt\.edu\.vn)$/,
          //     message: "Please input valid Email!",
          //   },
          // ]}
          >
            <Input placeholder="   Email hoặc số điện thoại" size="large" className="form-input" prefix={<UserOutlined />} />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Trường này không được để trống" }]}
          >
            <Input.Password
              placeholder="  Mật khẩu"
              size="large" className="form-input"
              prefix={<LockOutlined />}
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked">
            <Checkbox
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            >
              Ghi nhớ đăng nhập
            </Checkbox>
          </Form.Item>


          <Form.Item>

            <Button

              size='large'
              className="
              w-[80%]
                  bg-gradient-to-r 
              from-blue-500 to-cyan-400 text-white 
              font-medium rounded-full py-2 px-6 transition-transform duration-800
                hover:from-cyan-400 hover:to-blue-500 hover:scale-105 hover:shadow-cyan-200 hover:shadow-lg"
              type="primary"
              htmlType="submit"
              loading={isLoading}
              onClick={() => showModal('login')}
            >
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className="mb-4">
        <p className="">Bạn chưa có tài khoản?
          <button onClick={() => setIslogin(!Islogin)} className="text-orange-500 pl-1 text-[15px] font-SemiBold">
            <u>Đăng ký</u>
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
    </div>
  );
};

export default LoginForm;
