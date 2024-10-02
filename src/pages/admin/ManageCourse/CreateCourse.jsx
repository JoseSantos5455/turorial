import { InfoOutlined, PlusOutlined, QuestionOutlined, UploadOutlined, VideoCameraAddOutlined } from '@ant-design/icons';
import { Button, Dropdown, Input, Upload } from 'antd';
import React, { useState } from 'react';
import CreateVideo from './CreateVideo';
import CreateQuiz from './CreateQuiz';
import CreateInfo from './CreateInfo';

const CourseEditor = () => {
    const [courseDetails, setCourseDetails] = useState({
        title: '',
        description: '',
        image: null,
    });

    const items = [
        {
            key: '1',
            label: (
                <div>
                    Video
                </div>

            ),
            icon: <VideoCameraAddOutlined />,


        },
        {
            key: '2',
            label: (
                <div>
                    Quiz
                </div>
            ),
            icon: <QuestionOutlined />,
        },
        {
            key: '3',
            label: (
                <div>
                    Infomation
                </div>
            ),
            icon: <InfoOutlined />,

        },

    ];

    const [chapters, setChapters] = useState([]);
    const [newChapter, setNewChapter] = useState({ title: '', video: null });

    const handleAddChapter = () => {
        // if (newChapter.title && newChapter.video) {
        setChapters([...chapters, newChapter]);
        setNewChapter({ title: '', video: null });
        // } else {
        // alert('Please fill in the chapter title and select a video');
        // }
    };
    const handleRemove = (index) => {
        const newChapters = [...chapters];
        newChapters.splice(index, 1);
        setChapters(newChapters);
    }

    const handleChapterTitleChange = (e) => {
        setNewChapter({ ...newChapter, title: e.target.value });
    };


    const handleCourseDetailsChange = (e) => {
        const { name, value } = e.target;
        setCourseDetails({ ...courseDetails, [name]: value });
    };

    const handleUploadChange = (info) => {
        // Xử lý logic upload tại đây
        console.log(info.fileList);
    };

    const isCreateButtonDisabled = () => {
        const isChaptersFilled = chapters.every(chapter => chapter.title && chapter.video);
        return !(courseDetails.title && courseDetails.description && courseDetails.image && isChaptersFilled);
    };

    return (
        <div className="p-6 min-h-screen">
            <div className="max-w-6xl mx-auto bg-gray-50 shadow-xl rounded-lg p-6 flex space-x-6">
                {/* Left Side: Customize Your Course */}
                <div className="w-1/2">
                    <h2 className="text-xl font-semibold mb-4">Customize your course</h2>
                    <div className="space-y-6">
                        {/* Course Title */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Course Title</label>
                            <input
                                type="text"
                                name="title"
                                value={courseDetails.title}
                                onChange={handleCourseDetailsChange}
                                placeholder="Advanced Web Development"
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>

                        {/* Course Description */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Course Description</label>
                            <textarea
                                name="description"
                                value={courseDetails.description}
                                onChange={handleCourseDetailsChange}
                                placeholder="No description"
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>

                        {/* Course Image */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Course Image</label>
                            <Upload
                                onChange={handleUploadChange}
                                accept="image/*"
                            >
                                <Button icon={<UploadOutlined />}>Add an image</Button>
                            </Upload>
                        </div>
                    </div>
                </div>

                {/* Right Side: Course Chapters */}
                <div className="w-1/2">
                    <h2 className="text-xl font-semibold mb-4">Course Chapters</h2>

                    {/* Chapter Input Section */}
                    <div className="mb-4">
                        <div className='flex flex-row justify-between mb-2'>
                            <div className='block text-sm font-medium'>Chapter title</div>
                            <Dropdown menu={{ items }} trigger={['hover']}>
                                <Button icon={<PlusOutlined />}>add </Button>
                            </Dropdown>
                        </div>

                        {chapters.length > 0 && (
                            <div>
                                {chapters.map((chapter, index) => (
                                    <div className='bg-gray-100 p-4 rounded-xl mb-4'>
                                        <input
                                            type="text"
                                            value={newChapter.title}
                                            onChange={handleChapterTitleChange}
                                            placeholder="e.g. 'Introduction to the course'"
                                            className="w-full p-2 border border-gray-300 rounded-md mb-4"
                                        />
                                        <div className='flex flex-row justify-between'>
                                            <Upload
                                                onChange={handleUploadChange}
                                                accept="video/*"
                                            >
                                                <Button icon={<UploadOutlined />}>Upload Video</Button>
                                            </Upload>
                                            <div>
                                                <button onClick={handleAddChapter}>Add</button>
                                                <button className='ml-3' onClick={handleRemove}>Remove</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>



                    <div className="mt-4">
                        <Button type="primary" className="mt-2" disabled={isCreateButtonDisabled()}>
                            Create
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseEditor;
