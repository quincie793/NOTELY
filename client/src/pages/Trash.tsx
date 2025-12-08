import { useEffect, useState } from "react";
import api from "../api/api";
import LoadingSpinner from "../components/LoadingSpinner";
import MessageBanner from "../components/MessageBanner";

type Entry = {
  id: string;
  title: string;
  synopsis: string;
};

export default function Trash() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null);

  useEffect(() => {
    const loadTrash = async () => {
      try {
        const res = await api.get("/api/entries/trash");
        setEntries(res.data.entries || res.data.data || []);
      } catch {
        setMessage({ type: "error", text: "Failed to load trash items" });
      } finally {
        setLoading(false);
      }
    };
    loadTrash();
  }, []);

  const restore = async (id: string) => {
    try {
      await api.patch(`/api/entry/restore/${id}`);
      setEntries(prev => prev.filter(e => e.id !== id));
      setMessage({ type: "success", text: "Entry restored!" });
    } catch {
      setMessage({ type: "error", text: "Failed to restore entry" });
    }
  };

  const destroy = async (id: string) => {
    try {
      await api.delete(`/api/entry/${id}`);
      setEntries(prev => prev.filter(e => e.id !== id));
      setMessage({ type: "success", text: "Entry permanently deleted" });
    } catch {
      setMessage({ type: "error", text: "Failed to permanently delete entry" });
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "1rem",
        paddingTop: "80px",
        background: "linear-gradient(to right, #74ebd5, #ACB6E5)", // unified gradient
      }}
    >
      {message && <MessageBanner type={message.type} message={message.text} />}

      {!entries.length ? (
        <MessageBanner type="info" message="Nothing to show here" />
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "1rem",
          }}
        >
          {entries.map(entry => (
            <div
              key={entry.id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "6px",
                padding: "1rem",
                backgroundColor: "#fafafa",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.transform = "scale(1.02)";
                (e.currentTarget as HTMLDivElement).style.boxShadow =
                  "0 4px 12px rgba(0,0,0,0.1)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.transform = "scale(1)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
              }}
            >
              <h3>{entry.title}</h3>
              <p style={{ color: "#555" }}>{entry.synopsis}</p>
              <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                <button
                  onClick={() => restore(entry.id)}
                  style={{
                    padding: "0.4rem 0.8rem",
                    backgroundColor: "#1976d2",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    transition: "background-color 0.2s ease",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#1565c0")}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#1976d2")}
                >
                  Restore
                </button>
                <button
                  onClick={() => destroy(entry.id)}
                  style={{
                    padding: "0.4rem 0.8rem",
                    backgroundColor: "#b00020",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    transition: "background-color 0.2s ease",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#8c0018")}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#b00020")}
                >
                  Delete forever
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
