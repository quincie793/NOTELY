import { useState } from "react";
import api from "../api/api";
import MessageBanner from "../components/MessageBanner";

export default function NewEntry() {
  const [form, setForm] = useState({ title: "", synopsis: "", content: "" });
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/api/entries", form);
      setMessage({ type: "success", text: "Entry created!" });
      setForm({ title: "", synopsis: "", content: "" });
    } catch (err: any) {
      setMessage({ type: "error", text: err.response?.data?.error || "Failed to create entry" });
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(to right, #74ebd5, #ACB6E5)", // unified gradient
        padding: "2rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "600px",
          backgroundColor: "#fafafa",
          padding: "2rem",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        {message && <MessageBanner type={message.type} message={message.text} />}
        <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>Create New Entry</h2>
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <input
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
          />
          <input
            name="synopsis"
            placeholder="Synopsis"
            value={form.synopsis}
            onChange={handleChange}
          />
          <textarea
            name="content"
            placeholder="Content"
            value={form.content}
            onChange={handleChange}
            rows={8}
            style={{ resize: "vertical" }}
          />
          <button
            type="submit"
            style={{
              padding: "0.6rem 1rem",
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
            Save Entry
          </button>
        </form>
      </div>
    </div>
  );
}
