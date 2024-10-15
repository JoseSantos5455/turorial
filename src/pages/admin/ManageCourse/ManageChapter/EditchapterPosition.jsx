import React, { useState, useEffect } from 'react';
import { useEditChapterMutation, useGetChapterDetailsQuery } from '../../../../services/coursesAPI';
import { Table, Button } from 'antd';
import { DndContext } from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// SortableItem Component
const SortableItem = ({ id, children }) => {
    const { attributes, listeners, setNodeRef, transition, transform, isDragging } = useSortable({ id });

    const style = {
        transition,
        transform: transform ? CSS.Transform.toString(transform) : undefined,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <tr ref={setNodeRef} style={style} {...attributes} {...listeners}>
            {children}
        </tr>
    );
};

// Main Component
const EditchapterPosition = ({ chapterId, refetch, handleCloseModal }) => {
    const { data: chapterData, isLoading: loadingChapter } = useGetChapterDetailsQuery(chapterId);
    console.log(chapterData)
    const [editChapter, { isLoading }] = useEditChapterMutation();
    const [combinedLessons, setCombinedLessons] = useState([]);

    useEffect(() => {
        if (chapterData?.data) {
            const { lesson } = chapterData.data;

            // Combine and sort lessons by 'stt'
            const allItems = lesson.flatMap((lessonItem) => [
                ...lessonItem.videos.map(video => ({
                    ...video,
                    type: 'video',
                    id: `video-${video.videoId}`,
                })),
                ...lessonItem.infos.map(info => ({
                    ...info,
                    type: 'info',
                    id: `info-${info.infoId}`,
                })),
                ...lessonItem.quizs.map(quiz => ({
                    ...quiz,
                    type: 'quiz',
                    id: `quiz-${quiz.id}`,
                })),
            ]);

            const sortedItems = allItems.sort((a, b) => a.stt - b.stt);
            setCombinedLessons(sortedItems);
        }
    }, [chapterData]);

    const handleDragEnd = ({ active, over }) => {
        if (over) {
            const activeIndex = combinedLessons.findIndex(item => item.id === active.id);
            const overIndex = combinedLessons.findIndex(item => item.id === over.id);

            const reorderedLessons = arrayMove(combinedLessons, activeIndex, overIndex);

            // Update the 'stt' for lessons after dragging
            const updatedLessons = reorderedLessons.map((item, index) => ({
                ...item,
                stt: index + 1, // Update 'stt' based on new order
            }));

            setCombinedLessons(updatedLessons);
        }
    };

    const handleSave = async () => {
        try {
            // Tạo cấu trúc dữ liệu mới từ combinedLessons
            const updatedLessons = chapterData.data.lesson.map(lesson => {
                const updatedVideos = lesson.videos.map(video => {
                    const combinedVideo = combinedLessons.find(item => item.id === `video-${video.videoId}`);
                    return combinedVideo ? { ...video, stt: combinedVideo.stt } : video;
                });

                const updatedInfos = lesson.infos.map(info => {
                    const combinedInfo = combinedLessons.find(item => item.id === `info-${info.infoId}`);
                    return combinedInfo ? { ...info, stt: combinedInfo.stt } : info;
                });

                const updatedQuizs = lesson.quizs.map(quiz => {
                    const combinedQuiz = combinedLessons.find(item => item.id === `quiz-${quiz.id}`);
                    return combinedQuiz ? { ...quiz, stt: combinedQuiz.stt } : quiz;
                });

                return {
                    lessonId: lesson.lessonId,
                    videos: updatedVideos,
                    infos: updatedInfos,
                    quizs: updatedQuizs,
                };
            });

            // Gửi dữ liệu đến API
            console.log(updatedLessons);
            await editChapter({
                chapterId,
                lessons: updatedLessons,
            });

            refetch();
            handleCloseModal();
        } catch (error) {
            console.error('Failed to save changes:', error);
        }
    };


    const columns = [
        {
            title: 'Order',
            dataIndex: 'stt',
            key: 'stt',
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (_, record) => {
                switch (record.type) {
                    case 'video':
                        return `Video: ${record.videoName}`;
                    case 'info':
                        return `Info: ${record.infoTitle}`;
                    case 'quiz':
                        return `Quiz: ${record.title}`;
                    default:
                        return '';
                }
            },
        },
    ];

    return (
        <div>
            <h3>Drag to reorder lessons</h3>
            {loadingChapter ? (
                <p>Loading...</p>
            ) : (
                <DndContext onDragEnd={handleDragEnd}>
                    <SortableContext items={combinedLessons.map(item => item.id)} strategy={verticalListSortingStrategy}>
                        <Table
                            dataSource={combinedLessons}
                            columns={columns}
                            pagination={false}
                            rowKey="id"
                            components={{
                                body: {
                                    row: ({ children, ...restProps }) => {
                                        return (
                                            <SortableItem key={restProps['data-row-key']} id={restProps['data-row-key']}>
                                                {children}
                                            </SortableItem>
                                        );
                                    },
                                },
                            }}
                        />
                    </SortableContext>
                </DndContext>
            )}
            <Button type="primary" onClick={handleSave} disabled={isLoading}>
                Save
            </Button>
        </div>
    );
};

export default EditchapterPosition;
