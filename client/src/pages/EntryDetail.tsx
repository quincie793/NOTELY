import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import LoadingSpinner from "../components/LoadingSpinner";
import MessageBanner from "../components/MessageBanner";

type Entry = {
  id: string;
  title: string;
  synopsis: string;
  content: string;
};

export default function EntryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [entry, setEntry] = useState<Entry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const res = await api.get(`/api/entry/${id}`);
        const data: Entry = res.data.entry || res.data.data;
        setEntry(data);
      } catch {
        setError("Failed to load entry");
      } finally {
        setLoading(false);
      }
    };
    fetchEntry();
  }, [id]);

  const moveToTrash = async () => {
    try {
      await api.delete(`/api/entry/${id}`); // backend should soft-delete
      setMessage({ type: "success", text: "Entry moved to trash" });
      navigate("/dashboard");
    } catch {
      setMessage({ type: "error", text: "Failed to move entry to trash" });
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <MessageBanner type="error" message={error} />;
  if (!entry) return <MessageBanner type="info" message="Entry not found" />;

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(to right, #74ebd5, #ACB6E5)", // unified gradient
        padding: "2rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "700px",
          backgroundColor: "#fff",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          padding: "2rem",
        }}
      >
        {message && <MessageBanner type={message.type} message={message.text} />}
        <h2 style={{ marginBottom: "0.5rem" }}>{entry.title}</h2>
        <p style={{ fontStyle: "italic", color: "#555", marginBottom: "1rem" }}>
          {entry.synopsis}
        </p>
        <div style={{ marginBottom: "1.5rem", whiteSpace: "pre-wrap", lineHeight: "1.6" }}>
          {entry.content}
        </div>

        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            onClick={() => navigate(`/entry/${entry.id}/edit`)}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#1976d2",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Edit Entry
          </button>

          <button
            onClick={moveToTrash}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#ff9800",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Move to Trash
          </button>
        </div>
      </div>
    </div>
  );
}
