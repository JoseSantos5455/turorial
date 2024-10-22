import { Row, Select, Skeleton, Spin } from "antd";
import "./Dashboard.scss"
import { useState, useEffect } from "react";
import { SearchOutlined } from "@ant-design/icons";
import CustomFooter from "../../components/Footer/CustomFooter";
import CarouselCustom from "../../components/Home/Carousel";
import CourseList from "../../components/Home/Courses/CourseList";
import { useGetAllCourseQuery } from "../../services/coursesAPI";

function Dashboard() {

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const { data: CourseData, isLoading: isLoadingCourses, refetch } = useGetAllCourseQuery({ page, size });

  // Array of GIF objects with animation keys
  const gifs = [
    { url: "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExcmg4NjF6dDlzN3dxc2NsaHF0YXFybXEwanJhamJmcnk1NTV1OGV3OSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/mynT1vekMKm6TCrXq4/giphy.webp", animation: "animate-move" },
    { url: "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExd3lpOXpzZnE4aW1ibTZ5NnphM2p6dWR4MTk2M2x4aTV0eHZjOG03dCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/9JlHV3C3BKdJQHOPQq/giphy.webp", animation: "fadeInUp" },
    { url: "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExbm9yZjRxZWJmYW9obXZ0aDBmZTR3a2YzZXhwenVuaWtmN2Y5OWZmeCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Aiq85mpGemWiJAddot/giphy.webp", animation: "fadeInUp" },
    { url: "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExeHNhbWN1bjlyaHlocDljYjQ1bW10cWQ2NXU1bWU2b2Ewc3plcW50NyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/iNLEYybRJKz0zm1Zgs/giphy.webp", animation: "" },
    { url: "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExbmd0N2ViOHh3djhxNDRyOG52ZG1ydXBmeDE0eHJscm4wZ3Q4bXh6NSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/1qbSNZXvP8QUA3hiXv/giphy.webp", animation: "" },
    { url: "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExNzhzd2Mzb2Q0ZjV1NDcxcWgyYzhheHV3OGFsbjd6ajA0MDF2aTN5diZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Y4sWCxVW2vHbGWfJPb/giphy.webp", animation: "" }
  ];

  // Array of quotes
  const quotes = [
    " 'Thất bại là mẹ đập con !' ",
    " 'Học đi đôi với hành, hành đi đôi với tỏi' ",
    "Bố mẹ đã cho tiền ăn học, không học được thì cố mà ăn",
    "Còn trời còn nước còn non, còn chứng lười học là còn đau mông ",
    "Gọi em là Việt Nam. Vì em chẳng bao giờ thuộc về Anh.",
    "Đất nước cần trăm năm độc lập. Em ngại gì vài tháng độc thân",
    "Gọi em là sông Bạch Đằng. Vì anh đặt cọc em từ năm 938."
  ];

  const [randomGifIndex, setRandomGifIndex] = useState(Math.floor(Math.random() * gifs.length));
  const [randomQuoteIndex, setRandomQuoteIndex] = useState(Math.floor(Math.random() * quotes.length));

  useEffect(() => {
    const displayDuration = 20000; // 20 seconds
    const intervalDuration = 1800000; // 30 minutes

    const interval = setInterval(() => {
      setRandomGifIndex(Math.floor(Math.random() * gifs.length));
      setRandomQuoteIndex(Math.floor(Math.random() * quotes.length));
    }, intervalDuration);

    const timeout = setTimeout(() => {
      setRandomGifIndex(null);
      setRandomQuoteIndex(null);
    }, displayDuration);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [gifs.length, quotes.length]);

  if (isLoadingCourses)
    return (
      <div>
        <Skeleton />
      </div>
    );

  return (
    <div
      style={{
        flex: 1,
        overflow: "auto",
      }}
    >
      <Row>
        <CarouselCustom />
        <div className="relative w-full h-[100px] mt-5 ml-10 py-3 overflow-hidden">
          {randomGifIndex !== null && randomQuoteIndex !== null && (
            <div className={`absolute flex items-center space-x-2 w-auto h-full ${gifs[randomGifIndex].animation}`}>
              <img
                src={gifs[randomGifIndex].url}
                alt="Random GIF"
                className="w-[110px] h-auto mb-3"
              />
              <div className="relative max-w-xs mb-14">
                <div className="text-md text-black rounded-md py-2 bg-white border-r-2 px-2 shadow-lg font-bold">
                  {quotes[randomQuoteIndex]}
                </div>
                <div className="absolute top-2 -left-4 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-white"></div>
              </div>
            </div>
          )}
        </div>

        <CourseList courses={CourseData?.data?.content} />

      </Row>

      <CustomFooter />
    </div>
  );
}

export default Dashboard;
