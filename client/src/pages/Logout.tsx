// pages/Logout.tsx
import { useAuth } from "../hooks/useAuth";
import MessageBanner from "../components/MessageBanner";

export default function Logout() {
  const { logout } = useAuth(); // assuming your hook exposes a logout function

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background: "linear-gradient(to right, #74ebd5, #ACB6E5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        paddingTop: "80px", // space for fixed navbar
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          backgroundColor: "#fafafa",
          padding: "2rem",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          textAlign: "center",
        }}
      >
        <h2>Confirm Logout</h2>
        <p>Are you sure you want to log out?</p>
        <button
          onClick={logout}
          style={{
            marginTop: "1rem",
            padding: "0.6rem 1rem",
            backgroundColor: "#b00020",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
