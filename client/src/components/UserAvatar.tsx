import { useAuth } from "../hooks/useAuth";

export default function UserAvatar() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      {user.avatarUrl ? (
        <img
          src={user.avatarUrl}
          alt={`${user.firstName} ${user.lastName}`}
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
      ) : (
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            backgroundColor: "#ccc",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
          }}
        >
          {user.firstName[0]}
          {user.lastName[0]}
        </div>
      )}
      <span>{user.username}</span>
    </div>
  );
}
