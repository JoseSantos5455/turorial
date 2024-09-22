import React, { useState, useEffect } from 'react'; // Removed useEffect and useRef
import { useDispatch } from 'react-redux'; // Thêm useDispatch
import ReactQuill, { Quill } from 'react-quill'; // Import ReactQuill
import 'react-quill/dist/quill.snow.css'; // Import ReactQuill styles
import { Button, Card, Layout } from 'antd'; // Import Ant Design Card
import { setNote } from '../../slices/course.slice';
import { CloseOutlined } from '@ant-design/icons';
import './takenote.scss'

const TakeNote = ({ video, setTakeNote }) => {
  const [text, setText] = useState('');
  const dispatch = useDispatch();
  console.log(video)

  useEffect(() => {
    const savedNote = localStorage.getItem(`note_${video?.videoId}`); // Update key to include videoId
    if (savedNote) {
      setText(savedNote);
    }
  }, [video?.videoId]);

  // Lưu ghi chú vào localStorage và dispatch action khi text thay đổi
  useEffect(() => {
    localStorage.setItem(`note_${video?.videoId}`, text);
    dispatch(setNote({ noteId: video?.videoId, text }));
  }, [text, dispatch, video?.videoId]);

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'image', 'video'],
      [{ 'color': [] }, { 'background': [] }]
    ],
  };

  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike', 'list', 'link', 'image', 'video', 'color', 'background'
  ];

  console.log(text);

  return (
    <Layout className='relative flex items-center rounded-xl h-full mt-[20px] drop-shadow-lg'>
      <p className='font-bold mt-5 text-xl'>Nội dung </p>
      <div
        dangerouslySetInnerHTML={{ __html: text }}
        className='mt-10 overflow-auto w-[95%] px-8 rounded-md bg-slate-200 py-3 olCustome shadow-md'
        style={{ maxHeight: '350px', minHeight: '250px' }}
      />

      <ReactQuill
        value={text}
        onChange={setText}
        modules={modules}
        formats={formats}
        style={{
          maxHeight: '180px',
          backgroundColor: 'white',
          border: '1px solid #d1d1d1',
        }}
        className=" olCustome mt-10 pb-10"
      />
      <button
        onClick={setTakeNote}
        className='bg-red-700 px-5 py-2 rounded-md hover:bg-red-500 absolute right-3 top-3'>
        <CloseOutlined style={{ color: 'white' }} />
      </button>
    </Layout>
  );
};

export default TakeNote;
