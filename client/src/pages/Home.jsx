import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';

import { ImUserTie, ImCalendar } from 'react-icons/im';
import { FaCommentAlt } from 'react-icons/fa';
import { CiHeart } from 'react-icons/ci';

import styles from './Home.module.css';

function htmlToText(html) {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
}

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadPosts() {
      try {
        setIsLoading(true);
        setErrorMsg('');

        // Posts
        const res = await fetch(`${API_BASE_URL}/api/posts`);

        if (!res.ok) {
          const data = await res.json().catch(() => null);
          throw new Error(
            data?.message || `Failed to load posts (${res.status})`,
          );
        }

        const data = await res.json();

        if (isMounted) {
          setPosts(data.posts || []);
        }
      } catch (err) {
        if (isMounted) {
          setErrorMsg(err.message || 'Something went wrong');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadPosts();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) return <div>Loading posts...</div>;
  if (errorMsg) return <div>Error: {errorMsg}</div>;

  return (
    <main className={styles.homeMain}>
      <h1>Posts</h1>

      {posts.length === 0 ? (
        <div>No posts yet.</div>
      ) : (
        <div className={styles.postsContainer}>
          <div className={styles.scrollInner}>
            {posts.map((post) => {
              const text = htmlToText(post.content);
              const preview = text.length > 50 ? text.slice(0, 50) + '…' : text;
              return (
                <div key={post.id} className={styles.postItem}>
                  <Link
                    to={`/posts/${post.author?.username ?? 'unknown'}/${post.slug}`}
                  >
                    <div className={styles.postTitle}>{post.title}</div>
                    <div className={styles.postContent}>{preview}</div>
                    <div
                      className={styles.postDetails}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        color: 'var(--text-faint)',
                      }}
                    >
                      <div>
                        <ImUserTie />
                        {post.author.username}
                      </div>
                      <div>
                        <ImCalendar />
                        {new Date(post.publishedAt).toISOString().split('T')[0]}
                      </div>
                    </div>
                    <div
                      className={styles.postLikesComments}
                      style={{
                        display: 'flex',
                        justifyContent: 'left',
                        gap: '2rem',
                        color: 'var(--text-faint)',
                      }}
                    >
                      <div>
                        <CiHeart />
                        {post._count.postLikes}
                      </div>
                      <div>
                        <FaCommentAlt />
                        {post._count.comments}
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </main>
  );
}
