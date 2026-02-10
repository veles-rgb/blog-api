import { Link } from 'react-router-dom';
import { ImUser } from 'react-icons/im';

export default function Header({ user, onLogout }) {
  return (
    <header>
      <h3>VBlog</h3>
      <nav>
        {user ? (
          <>
            <Link to="/">Home</Link>
            <a
              onClick={onLogout}
              style={{ cursor: 'pointer', display: 'flex' }}
            >
              Logout
            </a>
            <div className="headerUser">
              <ImUser /> {user.username}
            </div>
          </>
        ) : (
          <>
            <Link to="/">Home</Link>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}
