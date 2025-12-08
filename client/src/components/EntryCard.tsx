import { Link } from "react-router-dom";

type Entry = {
  id: string;
  title: string;
  synopsis: string;
  isDeleted?: boolean;
};

type Props = {
  entry: Entry;
  onDelete?: (id: string) => void;
};

export default function EntryCard({ entry, onDelete }: Props) {
  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "1rem",
        borderRadius: "4px",
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem"
      }}
    >
      <h3 style={{ margin: 0 }}>{entry.title}</h3>
      <p style={{ color: "#555" }}>{entry.synopsis}</p>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <Link to={`/entry/${entry.id}`}>Read More</Link>
        <Link to={`/entry/${entry.id}/edit`}>Edit</Link>
        {onDelete && (
          <button onClick={() => onDelete(entry.id)} style={{ color: "#b00020" }}>
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
