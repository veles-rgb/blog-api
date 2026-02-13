import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { FaCommentAlt, FaUser } from 'react-icons/fa';

import { API_BASE_URL } from '../config/api';

export default function PostComments() {
  const { postId } = useParams();
  const [comments, setComments] = useState([]);
  const [postTitle, setPostTitle] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    async function fetchComments() {
      setIsLoading(true);

      try {
        const res = await fetch(
          `${API_BASE_URL}/api/comments/${postId}/comments`,
          {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        if (!res.ok) {
          throw new Error(`There was an error: ${res.status}`);
        }

        const results = await res.json();
        setComments(results.comments || []);
        setPostTitle(results.post);
        setErrMsg(null);
      } catch (err) {
        setErrMsg(err.message);
        setComments([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchComments();
  }, [postId]);

  if (isLoading) return 'Loading...';

  return (
    <main>
      {errMsg && <p style={{ color: 'red' }}>{errMsg}</p>}
      <h2 style={{ margin: '1rem' }}>{postTitle}</h2>
      <h3
        style={{
          margin: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.3rem',
        }}
      >
        <FaCommentAlt />
        {comments.length}
      </h3>
      <div
        style={{
          width: '50%',
          display: 'flex',
          flexDirection: 'column',
          border: '2px solid var(--border)',
          borderRadius: '1rem',
          padding: '1rem',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        {comments.map((comment) => {
          return (
            <div
              key={comment.id}
              style={{
                border: '2px solid var(--primary)',
                borderRadius: '1rem',
                padding: '1rem',
              }}
            >
              <div style={{ marginBottom: '1rem' }}>{comment.content}</div>
              <div
                style={{
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  gap: '0.3rem',
                }}
              >
                <FaUser /> {comment.user.username}
              </div>
              <div>
                Posted:{' '}
                {new Date(comment.createdAt).toISOString().split('T')[0] +
                  ' ' +
                  new Date(comment.createdAt).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  })}
              </div>
              <div>
                <button>Delete</button>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
