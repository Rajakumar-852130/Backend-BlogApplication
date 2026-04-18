import { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

const RichEditor = ({ value, onChange, placeholder }) => {
  const containerRef = useRef(null);
  const quillRef = useRef(null);
  const onChangeRef = useRef(onChange);

  // Keep onChange ref current
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (quillRef.current) return; // already initialized

    const container = containerRef.current;
    const editorDiv = document.createElement('div');
    container.appendChild(editorDiv);

    const quill = new Quill(editorDiv, {
      theme: 'snow',
      placeholder: placeholder || 'Write your story here...',
      modules: {
        toolbar: [
          [{ header: [1, 2, 3, false] }],
          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['link'],
          ['clean'],
        ],
      },
    });

    quillRef.current = quill;

    quill.on('text-change', () => {
      const html = quill.root.innerHTML;
      onChangeRef.current?.(html === '<p><br></p>' ? '' : html);
    });

    return () => {
      quillRef.current = null;
      container.innerHTML = '';
    };
  }, []);

  // Sync external value into editor (for edit mode)
  useEffect(() => {
    const quill = quillRef.current;
    if (!quill) return;

    if (value && quill.root.innerHTML !== value) {
      quill.root.innerHTML = value;
    }
  }, [value]);

  return (
    <div
      ref={containerRef}
      className="quill-container bg-white dark:bg-slate-900 rounded-xl border border-slate-300 dark:border-slate-700/50 overflow-hidden"
      style={{ minHeight: '350px' }}
    />
  );
};

export default RichEditor;
