import { Link, useNavigate } from "react-router-dom";
import { isAuthenticated, logout } from "../utils/auth";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav style={{ padding: 10, background: "#eee" }}>
      <Link to="/">Dashboard</Link>{" "}
      {!isAuthenticated() && <Link to="/login">Login</Link>}{" "}
      {!isAuthenticated() && <Link to="/register">Register</Link>}
      {isAuthenticated() && <button onClick={handleLogout}>Logout</button>}
    </nav>
  );
}

export default Navbar;
