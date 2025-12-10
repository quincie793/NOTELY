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

export default function Bookmarks() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookmarks = async () => {
    try {
      const res = await api.get("/api/entries/bookmarks");
      setEntries(res.data.data || []);
    } catch {
      // handle error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  if (loading) return <LoadingSpinner />;

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
        {!entries.length ? (
          <MessageBanner type="info" message="No bookmarks yet" />
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
              gap: "1rem",
            }}
          >
            {entries.map((entry, index) => (
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
                {/* ✅ Flex row: title left, icons right */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <h3 style={{ margin: 0 }}>{entry.title}</h3>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    {entry.pinned && <span style={{ color: "gold" }}>📌</span>}
                    {entry.bookmarked && (
                      <span style={{ color: "dodgerblue" }}>🔖</span>
                    )}
                  </div>
                </div>

                <p style={{ color: "#555" }}>{entry.synopsis}</p>
                <Link to={`/entry/${entry.id}`}>Read More</Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
