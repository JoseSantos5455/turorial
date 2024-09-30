import React, { useState } from 'react';

const ManageCourse = () => {
    const [courseDetails, setCourseDetails] = useState({
        title: '',
        description: '',
        image: null,
    });

    const [chapters, setChapters] = useState([]);
    const [newChapter, setNewChapter] = useState({ title: '', video: null });

    const handleAddChapter = () => {
        if (newChapter.title && newChapter.video) {
            setChapters([...chapters, newChapter]);
            setNewChapter({ title: '', video: null });
        } else {
            alert('Please fill in the chapter title and select a video');
        }
    };

    const handleFileChange = (event) => {
        setNewChapter({ ...newChapter, video: event.target.files[0] });
    };

    const handleCourseDetailsChange = (e) => {
        const { name, value } = e.target;
        setCourseDetails({ ...courseDetails, [name]: value });
    };

    const handleImageChange = (e) => {
        setCourseDetails({ ...courseDetails, image: e.target.files[0] });
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
                {/* Course Details */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">Customize your course</h2>
                    <div className="grid grid-cols-2 gap-4">
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
                        <div className="col-span-2">
                            <label className="block text-sm font-medium mb-2">Course Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                            {courseDetails.image && (
                                <div className="mt-4">
                                    <img
                                        src={URL.createObjectURL(courseDetails.image)}
                                        alt="Course"
                                        className="h-40 object-cover rounded-md"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Course Chapters */}
                <div>
                    <h2 className="text-xl font-semibold mb-4">Course Chapters</h2>
                    {chapters.map((chapter, index) => (
                        <div key={index} className="mb-4 p-4 border border-gray-200 rounded-md">
                            <h3 className="text-lg font-medium">{chapter.title}</h3>
                            <p>Video: {chapter.video.name}</p>
                        </div>
                    ))}

                    {/* Add Chapter */}
                    <div className="bg-gray-50 p-4 border border-gray-300 rounded-md">
                        <h3 className="font-semibold mb-2">Add a chapter</h3>
                        <input
                            type="text"
                            placeholder="e.g. 'Introduction to the course'"
                            value={newChapter.title}
                            onChange={(e) => setNewChapter({ ...newChapter, title: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded-md mb-2"
                        />
                        <input
                            type="file"
                            accept="video/*"
                            onChange={handleFileChange}
                            className="w-full p-2 border border-gray-300 rounded-md mb-4"
                        />
                        <button
                            onClick={handleAddChapter}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        >
                            Create
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageCourse;
