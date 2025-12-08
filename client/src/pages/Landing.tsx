import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "2rem",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(to right, #74ebd5, #ACB6E5)", // 🌈 colorful gradient background
        animation: "fadeIn 1.5s ease-in-out", // ✅ fade-in for whole container
      }}
    >
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>

      <h1
        style={{
          fontSize: "3.5rem", // 🔥 bigger header
          color: "#2c3e50",   // 🎨 darker header color
          marginBottom: "1rem",
          animation: "fadeIn 2s ease-in-out", // ✅ fade-in header
        }}
      >
        Welcome to Notely ✍️
      </h1>

      <p
        style={{
          margin: "1rem 0",
          maxWidth: "600px",
          color: "#333",
          fontSize: "1.2rem",
          animation: "fadeIn 2.5s ease-in-out", // ✅ fade-in paragraph
        }}
      >
        Capture your ideas, organize your thoughts, and manage your notes with ease.
      </p>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "1rem",
          marginTop: "2rem",
          animation: "fadeIn 3s ease-in-out", // ✅ fade-in buttons
        }}
      >
        <Link to="/login">
          <button
            style={{
              padding: "0.8rem 1.5rem",
              backgroundColor: "#1976d2",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "1rem",
              transition: "background-color 0.3s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1565c0")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#1976d2")}
          >
            Login
          </button>
        </Link>
        <Link to="/register">
          <button
            style={{
              padding: "0.8rem 1.5rem",
              backgroundColor: "#43a047",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "1rem",
              transition: "background-color 0.3s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#2e7d32")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#43a047")}
          >
            Sign Up
          </button>
        </Link>
      </div>
    </div>
  );
}
