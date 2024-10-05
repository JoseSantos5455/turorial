import { Badge, Button, Card, Col, Form, Input, Row, Select, Spin } from "antd";
import FormItem from "antd/es/form/FormItem";
import Meta from "antd/es/card/Meta";
import "./Dashboard.scss"

import { useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import CustomFooter from "../../components/Footer/CustomFooter";
import CarouselCustom from "../../components/Home/Carousel";
import CourseList from "../../components/Home/Courses/CourseList";
import { useGetAllCourseQuery } from "../../services/coursesAPI";



function Dashboard() {

  const { data: courses, error, isLoading } = useGetAllCourseQuery();
console.log(courses)
  if (isLoading)
    return
  <div>
    <Spin tip="Loading" size="large">
      Đợi một xíu nha
    </Spin>;
  </div>;

  if (error) return <div>Error: {error.message}</div>;

  return (
    <div
      style={{
        flex: 1,
        overflow: "auto",

      }}
    >
      <Row >
        <CarouselCustom />
        <CourseList courses={courses.data.content} />
      </Row>
      <CustomFooter />
    </div>
  );
}

export default Dashboard;
