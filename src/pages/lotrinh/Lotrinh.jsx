import {
  VerticalTimeline,
  VerticalTimelineElement
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { FaBook } from "react-icons/fa"; // Sử dụng icon phù hợp từ react-icons
import Tank from "../../assets/image/war.png"
import { Image } from "antd";
const WorkIcon = () => <FaBook />; // Icon cuốn sách cho các chương

export default function App() {
  const historyChapters = [
    { id: 1, title: "Lịch Sử 9 Chương 1", description: "Thế giới từ năm 1918 đến năm 1945", time: "1918-1945", icon: <Image preview={false} src={Tank} /> },
    { id: 2, title: "Lịch Sử 9 Chương 2", description: "Việt Nam từ năm 1918 đến năm 1945" },
    { id: 3, title: "Lịch Sử 9 Chương 3", description: "Thế giới từ năm 1945 đến năm 1991" },
    { id: 4, title: "Lịch Sử 9 Chương 4", description: "Việt Nam từ năm 1945 đến năm 1991" },
    { id: 5, title: "Lịch Sử 9 Chương 5", description: "Thế giới từ năm 1991 đến nay" },
    { id: 6, title: "Lịch Sử 9 Chương 6", description: "Việt Nam từ năm 1991 đến nay" },
    { id: 7, title: "Lịch Sử 9 Chương 7", description: "Cách mạng khoa học - kĩ thuật và xu thế toàn cầu hoá" },
  ];

  return (
    <div className="App p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Lịch Sử 9</h1>
      <VerticalTimeline
        layout="1-column-left"
        lineColor="gray"
      >
        {historyChapters.map((chapter) => (
          <VerticalTimelineElement

            key={chapter.id}
            className="vertical-timeline-element--work"
            contentStyle={{ background: "rgb(33, 150, 243)", color: "#fff" }}
            contentArrowStyle={{ borderRight: "7px solid  rgb(33, 150, 243)" }}
            date={chapter?.time}
            iconStyle={{ background: "rgb(33, 150, 243)", color: "#fff", width: "50px", height: "50px" }}
            icon={chapter?.icon}
          >
            <h3 className="text-lg font-semibold text-white">{chapter.title}</h3>
            <p className="text-white mt-2">{chapter.description}</p>
          </VerticalTimelineElement>
        ))}
      </VerticalTimeline>
    </div>
  );
}
