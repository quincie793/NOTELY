type Props = {
  type: "success" | "error" | "info";
  message: string;
};

export default function MessageBanner({ type, message }: Props) {
  const colors: Record<string, string> = {
    success: "#d4edda",
    error: "#f8d7da",
    info: "#d1ecf1"
  };

  const borders: Record<string, string> = {
    success: "#c3e6cb",
    error: "#f5c6cb",
    info: "#bee5eb"
  };

  return (
    <div
      style={{
        backgroundColor: colors[type],
        border: `1px solid ${borders[type]}`,
        padding: "0.75rem",
        marginBottom: "1rem",
        borderRadius: "4px"
      }}
    >
      {message}
    </div>
  );
}
