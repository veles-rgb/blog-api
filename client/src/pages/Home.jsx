import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import styles from './Home.module.css';

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

        const res = await fetch('http://localhost:3001/api/posts');

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
    <main>
      <h1>Posts</h1>

      {posts.length === 0 ? (
        <div>No posts yet.</div>
      ) : (
        <div
          className={styles.postsContainer}
          style={{ padding: '1rem', border: '1px solid red' }}
        >
          {posts.map((post) => (
            <div key={post.id} className={styles.postItem}>
              <Link
                to={`/posts/${post.author?.username ?? 'unknown'}/${post.slug}`}
              >
                <div>{post.title}</div>
                <div>{post.content.substring(0, 30) + '...'}</div>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <div>Author: {post.author.username}</div>
                  <div>Posted: {post.publishedAt}</div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
