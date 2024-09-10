import { Badge, Button, Card, Col, Form, Input, Row, Select } from "antd";
import FormItem from "antd/es/form/FormItem";
import Meta from "antd/es/card/Meta";
import "./Dashboard.scss"
import IMG from '../../assets/image/image-login.jpg';
import { useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import Slider from "../../components/Home/slider/Slider";
import OptometryServices from "../../components/Home/Workhours/OptometryServices ";
import CustomFooter from "../../components/Footer/CustomFooter";
import CarouselCustom from "../../components/Home/Carousel";

function Dashboard() {

  return (
    <div
      style={{
        flex: 1,
        overflow: "auto",

      }}
    >
      <Row >
        {/* <Slider /> */}
        <CarouselCustom/>
        <OptometryServices />
      </Row>
      <CustomFooter/>
    </div>
  );
}

export default Dashboard;
