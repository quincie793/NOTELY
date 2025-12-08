import { useState } from "react";

type EntryFormValues = {
  title: string;
  synopsis: string;
  content: string;
};

type Props = {
  initial?: EntryFormValues;
  onSubmit: (values: EntryFormValues) => Promise<void> | void;
  submitting?: boolean;
};

export default function EntryForm({ initial, onSubmit, submitting }: Props) {
  const [form, setForm] = useState<EntryFormValues>(
    initial || { title: "", synopsis: "", content: "" }
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
    >
      <input
        name="title"
        placeholder="Title"
        value={form.title}
        onChange={handleChange}
        required
      />
      <input
        name="synopsis"
        placeholder="Synopsis"
        value={form.synopsis}
        onChange={handleChange}
        required
      />
      <textarea
        name="content"
        placeholder="Content (Markdown)"
        value={form.content}
        onChange={handleChange}
        rows={10}
        required
      />
      <button type="submit" disabled={submitting}>
        {submitting ? "Saving..." : "Save"}
      </button>
    </form>
  );
}
