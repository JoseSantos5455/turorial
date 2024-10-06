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

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const { data: CourseData, isLoading: isLoadingCourses, refetch } = useGetAllCourseQuery({ page, size });


  if (isLoadingCourses)
    return
  <div>
    <Spin tip="Loading" size="large">
      Đợi một xíu nha
    </Spin>;
  </div>;
  

  return (
    <div
      style={{
        flex: 1,
        overflow: "auto",

      }}
    >
      <Row >
        <CarouselCustom />
        <CourseList courses={CourseData.data.content} />
      </Row>
      <CustomFooter />
    </div>
  );
}

export default Dashboard;
