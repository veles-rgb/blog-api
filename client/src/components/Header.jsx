import { Link } from 'react-router-dom';
import { ImUser } from 'react-icons/im';

export default function Header({ user, onLogout }) {
  return (
    <header>
      <nav>
        {user ? (
          <>
            <Link to="/">Home</Link> |{' '}
            <a
              onClick={onLogout}
              style={{ cursor: 'pointer', display: 'flex' }}
            >
              {' '}
              Logout
            </a>
            <p>
              <ImUser /> {user.username}
            </p>
          </>
        ) : (
          <>
            <Link to="/">Home</Link> | <Link to="/login">Login</Link> |{' '}
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}
