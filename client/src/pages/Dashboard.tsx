import { useEffect, useState } from "react";
import api from "../api/api";
import { Link } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import MessageBanner from "../components/MessageBanner";

type Entry = {
  id: string;
  title: string;
  synopsis: string;
  pinned?: boolean;
  bookmarked?: boolean;
};

export default function Dashboard() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ filter state
  const [filter, setFilter] = useState<"all" | "pinned" | "bookmarked">("all");

  const fetchEntries = async () => {
    try {
      const res = await api.get("/api/entries");
      setEntries(res.data.entries || res.data.data || []);
    } catch {
      // handle error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const togglePin = async (id: string, pinned: boolean) => {
    await api.patch(`/api/entry/${id}/pin`, { pinned: !pinned });
    fetchEntries();
  };

  const toggleBookmark = async (id: string, bookmarked: boolean) => {
    await api.patch(`/api/entry/${id}/bookmark`, { bookmarked: !bookmarked });
    fetchEntries();
  };

  if (loading) return <LoadingSpinner />;

  // ✅ apply filter before rendering
  const filteredEntries = entries.filter((entry) => {
    if (filter === "pinned") return entry.pinned;
    if (filter === "bookmarked") return entry.bookmarked;
    return true; // "all"
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        paddingTop: "80px",
        background: "linear-gradient(to right, #74ebd5, #ACB6E5)",
        animation: "fadeInSide 1.5s ease-in-out",
      }}
    >
      <div style={{ padding: "1rem" }}>
        {/* ✅ Filter bar */}
        <div style={{ marginBottom: "1rem", display: "flex", gap: "1rem" }}>
          <button
            onClick={() => setFilter("all")}
            style={{
              padding: "0.5rem 1rem",
              background: filter === "all" ? "#4cafef" : "#eee",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            All
          </button>
          <button
            onClick={() => setFilter("pinned")}
            style={{
              padding: "0.5rem 1rem",
              background: filter === "pinned" ? "#4cafef" : "#eee",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            📌 Pinned
          </button>
          <button
            onClick={() => setFilter("bookmarked")}
            style={{
              padding: "0.5rem 1rem",
              background: filter === "bookmarked" ? "#4cafef" : "#eee",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            🔖 Bookmarked
          </button>
        </div>

        <style>
          {`
            @keyframes fadeInSide {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }
            @keyframes fadeInLeft {
              from { opacity: 0; transform: translateX(-40px); }
              to { opacity: 1; transform: translateX(0); }
            }
            @keyframes fadeInRight {
              from { opacity: 0; transform: translateX(40px); }
              to { opacity: 1; transform: translateX(0); }
            }
          `}
        </style>

        {!filteredEntries.length ? (
          <MessageBanner type="info" message="No entries yet" />
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
              gap: "1rem",
            }}
          >
            {filteredEntries.map((entry, index) => (
              <div
                key={entry.id}
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "6px",
                  padding: "1rem",
                  backgroundColor: "#fafafa",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  animation: `${
                    index % 2 === 0 ? "fadeInLeft" : "fadeInRight"
                  } 0.8s ease forwards`,
                  animationDelay: `${index * 0.1}s`,
                  opacity: 0,
                }}
              >
                <h3>{entry.title}</h3>
                <p style={{ color: "#555" }}>{entry.synopsis}</p>
                <Link to={`/entry/${entry.id}`}>Read More</Link>

                {/* ✅ Icons instead of buttons */}
                <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.8rem" }}>
                  <span
                    onClick={() => togglePin(entry.id, entry.pinned ?? false)}
                    style={{
                      cursor: "pointer",
                      fontSize: "1.2rem",
                      color: entry.pinned ? "gold" : "#aaa",
                      textDecoration: entry.pinned ? "line-through" : "none",
                    }}
                    title={entry.pinned ? "Unpin" : "Pin"}
                  >
                    📌
                  </span>
                  <span
                    onClick={() =>
                      toggleBookmark(entry.id, entry.bookmarked ?? false)
                    }
                    style={{
                      cursor: "pointer",
                      fontSize: "1.2rem",
                      color: entry.bookmarked ? "dodgerblue" : "#aaa",
                      textDecoration: entry.bookmarked ? "line-through" : "none",
                    }}
                    title={entry.bookmarked ? "Remove Bookmark" : "Bookmark"}
                  >
                    🔖
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
