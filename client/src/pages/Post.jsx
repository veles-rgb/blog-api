import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';

import { API_BASE_URL } from '../config/api';

import { ImUserTie, ImClock, ImCalendar } from 'react-icons/im';
import { FaRegUser, FaRegClock, FaCommentAlt } from 'react-icons/fa';
import { FcLike } from 'react-icons/fc';
import { CiHeart } from 'react-icons/ci';

import styles from './Post.module.css';

export default function Post({ user }) {
  const [post, setPost] = useState(null);
  const [isLiked, setIsLiked] = useState(false);

  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [likesLoading, setLikesLoading] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');
  const [commentsError, setCommentsError] = useState('');
  const [likesError, setLikesError] = useState('');

  const { username, slug } = useParams();
  const navigate = useNavigate();

  // Load post
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
            data?.message || `Failed to load post (${res.status})`,
          );
        }

        const data = await res.json();

        if (isMounted) setPost(data.post || null);
      } catch (err) {
        if (isMounted) setErrorMsg(err.message || 'Something went wrong');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadPost();
    return () => {
      isMounted = false;
    };
  }, [username, slug]);

  // Load comments
  useEffect(() => {
    let isMounted = true;

    async function loadComments() {
      if (!post?.id) return;

      try {
        setCommentsLoading(true);
        setCommentsError('');

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

        if (isMounted)
          setComments(Array.isArray(data.comments) ? data.comments : []);
      } catch (err) {
        if (isMounted) setCommentsError(err.message || 'Something went wrong');
      } finally {
        if (isMounted) setCommentsLoading(false);
      }
    }

    loadComments();
    return () => {
      isMounted = false;
    };
  }, [post?.id]);

  // Check like status
  useEffect(() => {
    let isMounted = true;

    async function checkIsLiked() {
      if (!post?.id) return;

      // Not logged in -> not liked
      if (!user) {
        if (isMounted) setIsLiked(false);
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        if (isMounted) {
          setIsLiked(false);
          setLikesLoading(false);
        }
        return;
      }

      try {
        setLikesLoading(true);
        setLikesError('');

        const res = await fetch(
          `${API_BASE_URL}/api/likes/me?postId=${post.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        if (!res.ok) {
          const data = await res.json().catch(() => null);
          throw new Error(
            data?.message || `Failed to check like (${res.status})`,
          );
        }

        const data = await res.json();

        if (isMounted) setIsLiked(Boolean(data.liked));
      } catch (err) {
        if (isMounted) setLikesError(err.message || 'Something went wrong');
      } finally {
        if (isMounted) setLikesLoading(false);
      }
    }

    checkIsLiked();
    return () => {
      isMounted = false;
    };
  }, [post?.id, user]);

  // Toggle like/unlike
  async function handleClick() {
    if (!post?.id) return;

    if (!user) {
      navigate('/login');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const wasLiked = isLiked; // capture current value
    const method = wasLiked ? 'DELETE' : 'POST';

    try {
      setLikesLoading(true);
      setLikesError('');

      const res = await fetch(`${API_BASE_URL}/api/likes/${post.id}`, {
        method,
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || `Like request failed (${res.status})`);
      }

      // flip liked state
      setIsLiked(!wasLiked);

      // update count safely
      setPost((p) => {
        if (!p?._count) return p;
        const curr = Number(p._count.postLikes || 0);
        const next = curr + (wasLiked ? -1 : 1);
        return {
          ...p,
          _count: { ...p._count, postLikes: next < 0 ? 0 : next },
        };
      });
    } catch (err) {
      setLikesError(err.message || 'Something went wrong');
    } finally {
      setLikesLoading(false);
    }
  }

  // Post comment
  async function handleSubmit(e) {
    e.preventDefault();

    if (!user) {
      navigate('/login');
      return;
    }

    if (!post?.id || !commentText.trim()) return;

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      setCommentsLoading(true);
      setCommentsError('');

      const res = await fetch(`${API_BASE_URL}/api/comments/${post.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: commentText.trim() }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(
          data?.message || `Failed to post comment (${res.status})`,
        );
      }

      const data = await res.json();

      setComments((prev) => [
        data.comment,
        ...(Array.isArray(prev) ? prev : []),
      ]);
      setCommentText('');
    } catch (err) {
      setCommentsError(err.message || 'Something went wrong');
    } finally {
      setCommentsLoading(false);
    }
  }

  if (isLoading) return <div>Loading post...</div>;
  if (errorMsg) return <div>Error: {errorMsg}</div>;
  if (!post) return <div>Post not found.</div>;

  return (
    <main>
      <div className={styles.postContainer}>
        <h1>{post.title}</h1>

        {/* Likes */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '0.3rem',
            marginBottom: '1rem',
          }}
        >
          {user ? (
            <button
              onClick={handleClick}
              disabled={likesLoading}
              className={isLiked ? styles.likedPost : styles.notLikedPost}
              title={likesError ? likesError : undefined}
            >
              {isLiked ? <FcLike /> : <CiHeart />}
              {post._count?.postLikes ?? 0}
            </button>
          ) : (
            <>
              <CiHeart />
              {post._count?.postLikes ?? 0}
            </>
          )}
        </div>

        {/* Post details */}
        <div className={styles.postDetails}>
          <div>
            <ImUserTie /> {post.author?.username ?? 'unknown'}
          </div>
          <div>
            <ImClock /> {new Date(post.updatedAt).toISOString().split('T')[0]}
          </div>
          <div>
            <ImCalendar />{' '}
            {post.publishedAt
              ? new Date(post.publishedAt).toISOString().split('T')[0]
              : '—'}
          </div>
        </div>

        {/* Content */}
        <div
          className={styles.postContent}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>

      {/* Comments */}
      <div className={styles.commentsContainer}>
        <div>Comments</div>

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

        {commentsError && <p>{commentsError}</p>}

        <form className={styles.commentForm} onSubmit={handleSubmit}>
          <textarea
            className={styles.commentTextArea}
            minLength={2}
            maxLength={1000}
            name="commentBox"
            id="commentBox"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write a comment..."
            required
          />

          <button disabled={commentsLoading} type="submit">
            {commentsLoading ? 'Posting...' : 'Post'}
          </button>
        </form>

        {commentsLoading && comments.length === 0 ? (
          <p>Loading comments...</p>
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className={styles.commentItem}>
              <div className={styles.commentContent}>{comment.content}</div>
              <div className={styles.commentDetails}>
                <div>
                  <FaRegUser /> {comment.user?.username ?? 'unknown'}
                </div>
                <div>
                  <FaRegClock />{' '}
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
          ))
        ) : (
          <p>No comments yet.</p>
        )}
      </div>
    </main>
  );
}
