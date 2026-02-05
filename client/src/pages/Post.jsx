import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { API_BASE_URL } from '../config/api';

import { ImUserTie, ImClock, ImCalendar } from 'react-icons/im';
import { FaRegUser, FaRegClock, FaCommentAlt } from 'react-icons/fa';
import { FcLike } from 'react-icons/fc';

import styles from './Post.module.css';

export default function Post({ user }) {
  const [post, setPost] = useState();
  const [comments, setComments] = useState([]);
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
          `${API_BASE_URL}/api/posts/by-slug/${username}/${slug}`,
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

  useEffect(() => {
    let isMounted = true;

    async function loadComments() {
      if (!post?.id) return;
      try {
        setIsLoading(true);
        setErrorMsg('');

        const res = await fetch(
          `${API_BASE_URL}/api/comments?postId=${post.id}`,
        );

        if (!res.ok) {
          const data = await res.json().catch(() => null);
          throw new Error(
            data?.message || `Failed to load comments (${res.status})`,
          );
        }

        const data = await res.json();

        if (isMounted) {
          setComments(data.comments || null);
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

    loadComments();
    return () => {
      isMounted = false;
    };
  }, [post?.id]);

  if (isLoading) return <div>Loading posts...</div>;
  if (errorMsg) return <div>Error: {errorMsg}</div>;

  return (
    <main>
      {user ? (
        <h1>User</h1>
      ) : (
        <>
          <div className={styles.postContainer}>
            <h1>{post.title}</h1>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '0.3rem',
                marginBottom: '1rem',
              }}
            >
              <FcLike />
              {post._count.postLikes}
            </div>
            <div className={styles.postDetails}>
              <div>
                <ImUserTie /> {post.author.username}
              </div>
              <div>
                <ImClock />{' '}
                {new Date(post.updatedAt).toISOString().split('T')[0]}
              </div>
              <div>
                <ImCalendar />
                {new Date(post.publishedAt).toISOString().split('T')[0]}
              </div>
            </div>
            <div
              className={styles.postContent}
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>

          {comments.length > 0 ? (
            <div className={styles.commentsContainer}>
              <div>Comments</div>
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.3rem',
                    color: 'var(--text-faint)',
                  }}
                >
                  <FaCommentAlt />
                  {comments.length}
                </div>
              </div>
              {comments.map((comment) => {
                return (
                  <div className={styles.commentItem}>
                    <div className={styles.commentContent}>
                      {comment.content}
                    </div>
                    <div className={styles.commentDetails}>
                      <div>
                        <FaRegUser /> {comment.user.username}
                      </div>
                      <div>
                        <FaRegClock />
                        {new Date(comment.createdAt).toLocaleString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true,
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className={styles.commentsContainer}>
              <div>Comments</div>
              <div className={styles.commentItem}>No comments yet.</div>
            </div>
          )}
        </>
      )}
    </main>
  );
}
