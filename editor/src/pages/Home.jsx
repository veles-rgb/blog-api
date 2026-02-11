import { Link } from 'react-router-dom';

import styles from './Home.module.css';

export default function Home({ user }) {
  return (
    <main>
      <h2>Author Options</h2>
      <div className={styles.optionsContainer}>
        <Link to="/new">New Post</Link>
        <Link to="/my-posts">My Posts</Link>
      </div>

      {user.isAdmin ? (
        <>
          <h2>Admin Options</h2>
          <div className={styles.adminOptions}>
            <Link to="/all-posts">All Posts</Link>
            <Link to="/all-users">Users</Link>
          </div>
        </>
      ) : null}
    </main>
  );
}
