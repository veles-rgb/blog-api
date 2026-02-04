import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { ImUserTie, ImClock, ImCalendar } from 'react-icons/im';

import styles from './Post.module.css';

export default function Post() {
  const [post, setPost] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const { username, slug } = useParams();

  useEffect(() => {
    let isMounted = true;

    async function loadPost() {
      try {
        setIsLoading(true);
        setErrorMsg('');

        const res = await fetch(
          `http://localhost:3001/api/posts/by-slug/${username}/${slug}`,
        );

        if (!res.ok) {
          const data = await res.json().catch(() => null);
          throw new Error(
            data?.message || `Failed to load posts (${res.status})`,
          );
        }

        const data = await res.json();

        if (isMounted) {
          setPost(data.post || null);
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

    loadPost();
    return () => {
      isMounted = false;
    };
  }, [username, slug]);

  if (isLoading) return <div>Loading posts...</div>;
  if (errorMsg) return <div>Error: {errorMsg}</div>;

  return (
    <main>
      <div className={styles.postContainer}>
        <h1>{post.title}</h1>
        <div className={styles.postDetails}>
          <div>
            <ImUserTie /> {post.author.username}
          </div>
          <div>
            <ImClock /> {new Date(post.updatedAt).toISOString().split('T')[0]}
          </div>
          <div>
            <ImCalendar />
            {new Date(post.publishedAt).toISOString().split('T')[0]}
          </div>
        </div>
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>
    </main>
  );
}
