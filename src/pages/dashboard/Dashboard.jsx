import { Row, Select, Skeleton, Spin } from "antd";
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
    <Skeleton/>
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
        <CourseList courses={CourseData?.data.content} />
      </Row>
      <CustomFooter />
    </div>
  );
}

export default Dashboard;
