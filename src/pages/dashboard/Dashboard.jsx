import { Badge, Button, Card, Col, Form, Input, Row, Select } from "antd";
import FormItem from "antd/es/form/FormItem";
import Meta from "antd/es/card/Meta";
import "./Dashboard.scss"

import { useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import CustomFooter from "../../components/Footer/CustomFooter";
import CarouselCustom from "../../components/Home/Carousel";
import CourseList from "../../components/Home/Courses/CourseList";

function Dashboard() {

  return (
    <div
      style={{
        flex: 1,
        overflow: "auto",

      }}
    >
      <Row >
        <CarouselCustom/>
        <CourseList/>
      </Row>
      <CustomFooter/>
    </div>
  );
}

export default Dashboard;
