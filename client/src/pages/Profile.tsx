import { useState, useEffect } from "react";
import api from "../api/api";
import MessageBanner from "../components/MessageBanner";
import { useAuth } from "../hooks/useAuth";

export default function Profile() {
  const { user, setUser } = useAuth();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    avatarUrl: ""
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (user) {
      setForm({
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        avatarUrl: user.avatarUrl || ""
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const uploadAvatar = async (file: File) => {
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("upload_preset", import.meta.env.VITE_CLOUDINARY_PRESET);

      const cloudRes = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD}/image/upload`,
        { method: "POST", body: fd }
      );
      const data = await cloudRes.json();

      const res = await api.patch("/api/user", { avatarUrl: data.secure_url });
      const updatedUser = res.data.data;

      setForm(f => ({ ...f, avatarUrl: updatedUser.avatarUrl }));
      setUser(updatedUser);
      setMessage({ type: "success", text: "Avatar updated!" });
    } catch {
      setMessage({ type: "error", text: "Failed to upload avatar" });
    }
  };

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.patch("/api/user", form);
      const updatedUser = res.data.data;
      setForm({
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        username: updatedUser.username,
        email: updatedUser.email,
        avatarUrl: updatedUser.avatarUrl || ""
      });
      setUser(updatedUser);
      setMessage({ type: "success", text: "Profile updated!" });
    } catch (err: any) {
      setMessage({ type: "error", text: err.response?.data?.error || "Failed to update profile" });
    }
  };

  const updatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match" });
      return;
    }
    try {
      await api.post("/api/auth/password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      setMessage({ type: "success", text: "Password updated!" });
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: any) {
      setMessage({ type: "error", text: err.response?.data?.error || "Failed to update password" });
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(to right, #74ebd5, #ACB6E5)", // 🌈 unified gradient
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

        <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>Update Profile</h2>
        <form
          onSubmit={updateProfile}
          style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
        >
          <input name="firstName" placeholder="First Name" value={form.firstName} onChange={handleChange} />
          <input name="lastName" placeholder="Last Name" value={form.lastName} onChange={handleChange} />
          <input name="username" placeholder="Username" value={form.username} onChange={handleChange} />
          <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
          <div>
            <label>Avatar:</label>
            <input
              type="file"
              accept="image/*"
              onChange={e => {
                const file = e.target.files?.[0];
                if (file) uploadAvatar(file);
              }}
            />
          </div>
          {form.avatarUrl && (
            <img src={form.avatarUrl} alt="avatar" style={{ width: "80px", borderRadius: "50%", marginTop: "0.5rem" }} />
          )}
          <button
            type="submit"
            style={{
              marginTop: "0.5rem",
              padding: "0.6rem 1rem",
              backgroundColor: "#1976d2",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Save Profile
          </button>
        </form>

        <h2 style={{ textAlign: "center", marginTop: "2rem" }}>Update Password</h2>
        <form
          onSubmit={updatePassword}
          style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
        >
          <input
            type="password"
            name="currentPassword"
            placeholder="Current Password"
            value={passwordForm.currentPassword}
            onChange={handlePasswordChange}
          />
          <input
            type="password"
            name="newPassword"
            placeholder="New Password"
            value={passwordForm.newPassword}
            onChange={handlePasswordChange}
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm New Password"
            value={passwordForm.confirmPassword}
            onChange={handlePasswordChange}
          />
          <button
            type="submit"
            style={{
              marginTop: "0.5rem",
              padding: "0.6rem 1rem",
              backgroundColor: "#1976d2",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
}
