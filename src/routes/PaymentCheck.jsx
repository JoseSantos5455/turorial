import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { selectCurrentUser } from "../slices/auth.slice";
import { showLoginModal } from "../slices/modal.slice";
import { message } from "antd";
import { useEffect } from "react";

const PaymentCheck = () => {
    const user = useSelector(selectCurrentUser);

    useEffect(() => {
        if (user.packageStatus === "CANCELLED") {
            message.destroy();
            message.error("Gói học của bạn chưa đăng ký hoặc đã hết hạn, vui lòng gia hạn để tiếp tục học tập");
        }
    }, [user.packageStatus]);

    if (user.packageStatus === "CANCELLED") {
        return <Navigate to="/combo" />;
    }

    return <Outlet />;
};

export default PaymentCheck;
