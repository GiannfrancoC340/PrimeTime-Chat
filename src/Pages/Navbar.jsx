import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const { user, signOut } = useAuth();
  
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    await signOut();
    // Redirect to login page after logout
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <NavLink to={user ? "/home" : "/"} className={({ isActive }) => (isActive ? "active" : "")}>
          Home
        </NavLink>
      </div>
      
      <div className="nav-title">
        <h1>PrimeTime Chat</h1>
      </div>
      
      <div className="nav-right">
        {user ? (
          <>
            <NavLink to="/create-post" className={({ isActive }) => (isActive ? "active" : "")}>
              Create Post
            </NavLink>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" className={({ isActive }) => (isActive ? "active" : "")}>
              Login
            </NavLink>
            <NavLink to="/signup" className={({ isActive }) => (isActive ? "active" : "")}>
              Signup
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;