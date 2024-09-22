// src/utils/navigate.js
import { Image } from "antd";
import { useNavigate } from "react-router-dom";



export const navigate = (path) => {
  const navigate = useNavigate();
  navigate(path);
};
