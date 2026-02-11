import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';

import { API_BASE_URL } from '../config/api';
import { TINYMCE_API_KEY } from '../config/tinymce';

export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [publish, setPublish] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      setErrMsg('Title and content are required.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      setIsLoading(true);
      setErrMsg('');

      const res = await fetch(`${API_BASE_URL}/api/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content, isPublished: publish }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || `Failed to create post`);
      }

      navigate('/');
    } catch (err) {
      setErrMsg(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <h1>Create Post</h1>

      {errMsg && <p style={{ color: 'red' }}>{errMsg}</p>}

      <form onSubmit={handleSubmit}>
        {/* Title Field */}
        <label>
          Title
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter post title..."
            required
            style={{ width: '100%', marginBottom: '1rem' }}
          />
        </label>

        {/* Publish check */}
        <label>
          Publish?
          <input
            type="checkbox"
            value={publish}
            onChange={(e) => setPublish(e.target.checked)}
            required
          />
        </label>

        {/* TinyMCE Editor */}
        <Editor
          apiKey={TINYMCE_API_KEY}
          value={content}
          onEditorChange={(newValue) => setContent(newValue)}
          init={{
            height: 500,
            menubar: false,

            plugins: [
              'anchor',
              'autolink',
              'charmap',
              'codesample',
              'link',
              'lists',
              'media',
              'searchreplace',
              'table',
              'visualblocks',
              'wordcount',
              'image',
              'code',
            ],

            toolbar:
              'undo redo | blocks | bold italic underline | alignleft aligncenter alignright | bullist numlist | link image media | codesample | removeformat | code',

            block_formats:
              'Paragraph=p; Heading 1=h1; Heading 2=h2; Heading 3=h3; Blockquote=blockquote',

            content_style: `
              body {
                font-family: Inter, sans-serif;
                font-size: 16px;
                background-color: #1e1e1e;
                color: #e6e6e6;
              }
              h1,h2,h3 {
                color: #ffffff;
              }
            `,

            branding: false,
          }}
        />

        <button
          type="submit"
          disabled={isLoading}
          style={{ marginTop: '1rem' }}
        >
          {isLoading ? 'Saving...' : 'Save'}
        </button>
      </form>
    </main>
  );
}
