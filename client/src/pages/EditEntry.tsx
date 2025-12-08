import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import MessageBanner from "../components/MessageBanner";

type Entry = {
  id: string;
  title: string;
  synopsis: string;
  content: string;
};

export default function EditEntry() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState<Entry | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const res = await api.get(`/api/entry/${id}`);
        const entry: Entry = res.data.entry || res.data.data;
        setForm(entry);
      } catch {
        setMessage({ type: "error", text: "Failed to load entry" });
      } finally {
        setLoading(false);
      }
    };
    fetchEntry();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!form) return;
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    try {
      await api.patch(`/api/entry/${id}`, form);
      setMessage({ type: "success", text: "Entry updated!" });
      setTimeout(() => navigate(`/entry/${id}`), 1000);
    } catch (err: any) {
      setMessage({ type: "error", text: err.response?.data?.error || "Update failed" });
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!form) return <p>Entry not found</p>;

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(to right, #74ebd5, #ACB6E5)", // unified gradient
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          width: "100%",
          maxWidth: "600px",
          padding: "2rem",
          backgroundColor: "#fff",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        {message && <MessageBanner type={message.type} message={message.text} />}
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
        <input name="synopsis" placeholder="Synopsis" value={form.synopsis} onChange={handleChange} required />
        <textarea name="content" placeholder="Content (Markdown)" value={form.content} onChange={handleChange} rows={10} required />
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}
