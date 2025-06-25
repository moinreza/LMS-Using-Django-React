import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-indigo-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/dashboard" className="text-xl font-bold">
          LMS
        </Link>
        <div className="flex space-x-4">
          <Link to="/dashboard" className="hover:underline">
            Dashboard
          </Link>
          <Link to="/courses" className="hover:underline">
            Courses
          </Link>
          <Link to="/profile" className="hover:underline">
            Profile
          </Link>
          <button onClick={logout} className="hover:underline">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}