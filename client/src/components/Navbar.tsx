import { NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import UserAvatar from "./UserAvatar";

export default function Navbar() {
  const { user } = useAuth();

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
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 1000,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem 2rem",
          background: "linear-gradient(to right, #1ba78dff, #8ea1f5ff)",
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
              {/* ✅ Updated: Logout now navigates to /logout page */}
              <NavLink
                to="/logout"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
                style={{ color: "#ffdddd", fontWeight: "bold" }}
              >
                Logout
              </NavLink>
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
