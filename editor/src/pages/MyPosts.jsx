import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { API_BASE_URL } from '../config/api';
import { CLIENT_URL } from '../config/client';

import styles from './MyPosts.module.css';

function htmlToText(html) {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
}

export default function MyPosts({ user }) {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [publishLoading, setPublishLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    const fetchPosts = async () => {
      setIsLoading(true);

      try {
        const res = await fetch(`${API_BASE_URL}/api/posts/me`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          throw new Error(`http error. Status: ${res.status}`);
        }

        const results = await res.json();
        setPosts(results.posts || []);
        setError(null);
      } catch (err) {
        setError(err.message);
        setPosts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  async function handleDelete(id) {
    const token = localStorage.getItem('token');

    if (!confirm('Delete this post?')) return;
    try {
      setDeleteLoading(true);

      const res = await fetch(`${API_BASE_URL}/api/posts/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error(`http error. Status: ${res.status}`);
      }

      setPosts((prev) => prev.filter((post) => post.id !== id));

      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleteLoading(false);
    }
  }

  async function handlePublish(id, post) {
    const token = localStorage.getItem('token');
    if (!token) return;

    const action = post.isPublished ? 'unpublish' : 'publish';
    if (
      !confirm(`${action === 'publish' ? 'Publish' : 'Unpublish'} this post?`)
    )
      return;

    try {
      setPublishLoading(true);

      const res = await fetch(`${API_BASE_URL}/api/posts/${id}/${action}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error(`http error. Status: ${res.status}`);

      setPosts((prev) =>
        prev.map((p) =>
          p.id === id
            ? {
                ...p,
                isPublished: !p.isPublished,
                publishedAt: p.isPublished ? null : new Date().toISOString(),
              }
            : p,
        ),
      );

      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setPublishLoading(false);
    }
  }

  function handleEdit(postId) {
    navigate(`/edit/${postId}`);
  }

  if (isLoading)
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        Loading...
      </div>
    );

  if (posts.length < 1)
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        No posts yet.
      </div>
    );

  return (
    <main className={styles.myPostsMain}>
      {error && <p>{error}</p>}
      <div className={styles.postsContainer}>
        <div className={styles.scrollInner}>
          <h1 style={{ textAlign: 'center' }}>{user.username}'s posts</h1>
          {posts.map((post) => {
            const text = htmlToText(post.content);
            const preview = text.length > 50 ? text.slice(0, 50) + '…' : text;
            return (
              <div key={post.id} className={styles.postItem}>
                <h2 style={{ color: 'var(--primary)', textAlign: 'center' }}>
                  {post.title}
                </h2>
                <div style={{ textAlign: 'center' }}>{preview}</div>

                <div>
                  <div>
                    Created:{' '}
                    {new Date(post.createdAt).toISOString().split('T')[0] +
                      ' ' +
                      new Date(post.createdAt).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                      })}
                  </div>
                  <div>
                    {post.isPublished
                      ? 'Published: ' +
                        new Date(post.publishedAt).toISOString().split('T')[0] +
                        ' ' +
                        new Date(post.publishedAt).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true,
                        })
                      : null}
                  </div>
                  {post.updatedAt !== post.createdAt
                    ? 'Updated: ' +
                      new Date(post.updatedAt).toISOString().split('T')[0] +
                      ' ' +
                      new Date(post.updatedAt).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                      })
                    : null}
                </div>

                <div style={{ display: 'flex', gap: '0.3rem' }}>
                  <p style={{ color: 'var(--text-muted)' }}>Status:</p>{' '}
                  <p
                    style={
                      post.isPublished ? { color: 'green' } : { color: 'red' }
                    }
                  >
                    {post.isPublished ? 'Published' : 'Unpublished'}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <button onClick={() => handlePublish(post.id, post)}>
                    {publishLoading
                      ? 'Loading...'
                      : post.isPublished
                        ? 'Unpublish'
                        : 'Publish'}
                  </button>
                  <button>Manage Comments</button>
                  <button type="button" onClick={() => handleEdit(post.id)}>
                    Edit
                  </button>
                  {post.isPublished ? (
                    <button>
                      <a
                        href={`${CLIENT_URL}/posts/${user.username}/${post.slug}`}
                        rel="noopener noreferrer"
                        target="_blank"
                        style={{ color: 'black' }}
                      >
                        View
                      </a>
                    </button>
                  ) : null}
                  <button
                    style={{ backgroundColor: 'red', color: 'white' }}
                    onClick={() => handleDelete(post.id)}
                  >
                    {deleteLoading ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
