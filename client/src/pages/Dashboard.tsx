import { useEffect, useState } from "react";
import api from "../api/api";
import { Link } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import MessageBanner from "../components/MessageBanner";

type Entry = {
  id: string;
  title: string;
  synopsis: string;
};

export default function Dashboard() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    fetchEntries();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div
      style={{
        minHeight: "100vh",
        paddingTop: "80px", // ✅ space for fixed navbar
        background: "linear-gradient(to right, #74ebd5, #ACB6E5)", // 🌈 full-width gradient
        animation: "fadeInSide 1.5s ease-in-out",
      }}
    >
      <div style={{ padding: "1rem" }}>
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

        {!entries.length ? (
          <MessageBanner type="info" message="No entries yet" />
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
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.transform =
                    "scale(1.02)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow =
                    "0 4px 12px rgba(0,0,0,0.1)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.transform =
                    "scale(1)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                }}
              >
                <h3>{entry.title}</h3>
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
