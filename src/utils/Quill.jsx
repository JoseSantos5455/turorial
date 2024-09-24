// QuillEditor.js
import React, { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

const QuillEditor = ({ onChange }) => {
  const quillRef = useRef(null);
  const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],
    ['link', 'image', 'video', 'formula'],
  
    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
    [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
    [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
    [{ 'direction': 'rtl' }],                         // text direction
  
    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  
    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'font': [] }],
    [{ 'align': [] }],
  
    ['clean']                                         // remove formatting button
  ];
  useEffect(() => {
    const quill = new Quill(quillRef.current, {  // Updated to use quillRef
      modules: {
        toolbar: toolbarOptions
      },
      theme: 'snow'
    });
    
    quill.on('text-change', () => {
      onChange(quill.root.innerHTML);
    });

    return () => {
      quill.off('text-change');
    };
  }, [onChange]);

  return <div ref={quillRef} style={{ minHeight: '200px' }} />;
};

export default QuillEditor;
