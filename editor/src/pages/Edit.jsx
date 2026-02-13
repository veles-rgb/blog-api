import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';

import { API_BASE_URL } from '../config/api';
import { TINYMCE_API_KEY } from '../config/tinymce';
import { useEffect } from 'react';

export default function Edit() {
  const { postId } = useParams();
  const [post, setPost] = useState();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [publish, setPublish] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    async function fetchPost() {
      setIsLoading(true);

      try {
        const res = await fetch(`${API_BASE_URL}/api/posts/me/${postId}`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          throw new Error(`http error. Status: ${res.status}`);
        }

        const result = await res.json();
        setPost(result.post);
        setTitle(result.post.title);
        setContent(result.post.content);
        setPublish(result.post.isPublished);
        setErrMsg(null);
      } catch (err) {
        setErrMsg(err.message);
        setPost();
      } finally {
        setIsLoading(false);
      }
    }

    fetchPost();
  }, [postId]);

  async function handleSubmit(e) {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      setIsLoading(true);
      setErrMsg('');

      const res = await fetch(`${API_BASE_URL}/api/posts/${post.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          content,
          isPublished: publish,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || `Failed to edit post`);
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
            minLength={2}
            maxLength={150}
            required
            style={{ width: '100%', marginBottom: '1rem' }}
          />
        </label>

        {/* Publish check */}
        <label>
          Publish?{' '}
          <input
            type="checkbox"
            checked={publish ? true : false}
            value={publish}
            onChange={(e) => setPublish(e.target.checked)}
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
