import { Link } from 'react-router-dom';
import { ImUser } from 'react-icons/im';

export default function Header({ user, onLogout }) {
  return (
    <header>
      <h3>VBlog Editor</h3>
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
            <Link to="/login">Login</Link>
          </>
        )}
      </nav>
    </header>
  );
}
