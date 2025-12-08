import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function getInitials(firstName?: string, lastName?: string) {
  if (!firstName && !lastName) return "U";
  return `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();
}

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        padding: "1rem",
        borderBottom: "1px solid #ccc",
        gap: "1rem"
      }}
    >
      {!user ? (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Sign Up</Link>
        </>
      ) : (
        <>
          <Link to="/dashboard">My Notes</Link>
          <Link to="/new-entry">New Entry</Link>
          <Link to="/trash">Trash</Link>
          <Link to="/profile">Profile</Link>
          <span style={{ marginLeft: "auto" }}>
            Welcome back, {user.firstName}!
          </span>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor: "#eee",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              overflow: "hidden"
            }}
          >
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt="avatar"
                style={{ width: "100%", height: "100%", borderRadius: "50%" }}
              />
            ) : (
              getInitials(user.firstName, user.lastName)
            )}
          </div>
          <button onClick={handleLogout}>Logout</button>
        </>
      )}
    </header>
  );
}
