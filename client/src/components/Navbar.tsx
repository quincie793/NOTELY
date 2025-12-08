import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import UserAvatar from "./UserAvatar";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <style>
        {`
          .nav-link {
            text-decoration: none;
            color: #f0f0f0;
            font-weight: bold;
            transition: color 0.3s ease, text-decoration 0.3s ease;
          }
          .nav-link:hover {
            color: #ffffff;
            text-decoration: underline;
          }
          .nav-link.active {
            color: #ffffff;
            text-decoration: underline;
          }
        `}
      </style>

      <nav
        style={{
          position: "fixed",       // ✅ fixed at top
          top: 0,                  // ✅ anchor to top
          left: 0,
          width: "100%",           // ✅ full width
          zIndex: 1000,            // ✅ stays above other content
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem 2rem",
          background: "linear-gradient(to right, #1ba78dff, #8ea1f5ff)", // 🌈 your gradient untouched
          color: "#fff",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "1.5rem" }}>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            My Notes App
          </NavLink>
        </h1>

        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          {user ? (
            <>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/new-entry"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                Create Entry
              </NavLink>
              <NavLink
                to="/trash"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                Trash
              </NavLink>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                Profile
              </NavLink>
              <button
                onClick={handleLogout}
                className="nav-link"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#ffdddd",
                  fontWeight: "bold",
                }}
              >
                Logout
              </button>
              <UserAvatar />
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                Register
              </NavLink>
            </>
          )}
        </div>
      </nav>
    </>
  );
}
