// Profile.tsx - Full Updated Code
import { useState, useEffect } from "react";
import api from "../api/api";
import MessageBanner from "../components/MessageBanner";
import { useAuth } from "../hooks/useAuth";
import UploadImage from "../components/UploadImage";

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
  const [isUploading, setIsUploading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setForm({
        firstName: user.firstName ?? "",
        lastName: user.lastName ?? "",
        username: user.username ?? "",
        email: user.email ?? "",
        avatarUrl: user.avatarUrl || ""
      });
      setAvatarPreview(user.avatarUrl || null);
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAvatarUploadSuccess = async (url: string) => {
    setIsUploading(true);
    try {
      // Save the Cloudinary URL to your backend
      const res = await api.patch("/api/user", { avatarUrl: url });
      const updatedUser = res.data.data || res.data.user || res.data;

      setForm(f => ({ ...f, avatarUrl: updatedUser.avatarUrl }));
      setAvatarPreview(updatedUser.avatarUrl);
      setUser(updatedUser);
      setMessage({ type: "success", text: "Profile picture updated successfully!" });
    } catch (err: any) {
      console.error("Failed to update avatar URL:", err);
      setMessage({ 
        type: "error", 
        text: err.response?.data?.error || "Failed to save profile picture" 
      });
    } finally {
      setIsUploading(false);
    }
  };

  const removeAvatar = async () => {
    try {
      const res = await api.patch("/api/user", { avatarUrl: "" });
      const updatedUser = res.data.data || res.data.user || res.data;

      setForm(f => ({ ...f, avatarUrl: "" }));
      setAvatarPreview(null);
      setUser(updatedUser);
      setMessage({ type: "success", text: "Profile picture removed!" });
    } catch (err: any) {
      setMessage({ type: "error", text: err.response?.data?.error || "Failed to remove profile picture" });
    }
  };

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.patch("/api/user", form);
      const updatedUser = res.data.data || res.data.user || res.data;

      setForm({
        firstName: updatedUser.firstName ?? "",
        lastName: updatedUser.lastName ?? "",
        username: updatedUser.username ?? "",
        email: updatedUser.email ?? "",
        avatarUrl: updatedUser.avatarUrl || ""
      });
      setUser(updatedUser);
      setMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.error?.includes("Unique constraint")
          ? "Email or username already exists"
          : err.response?.data?.error || "Failed to update profile";
      setMessage({ type: "error", text: errorMsg });
    }
  };

  const updatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match" });
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setMessage({ type: "error", text: "New password must be at least 6 characters" });
      return;
    }
    try {
      await api.post("/api/auth/password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      setMessage({ type: "success", text: "Password updated successfully!" });
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: any) {
      setMessage({ type: "error", text: err.response?.data?.error || "Failed to update password" });
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background: "linear-gradient(to right, #74ebd5, #ACB6E5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        paddingTop: "80px"
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "600px",
          backgroundColor: "#fafafa",
          padding: "2rem",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
        }}
      >
        {message && <MessageBanner type={message.type} message={message.text} />}

        <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>Profile Settings</h2>
        
        {/* Avatar Section */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ position: "relative", display: "inline-block" }}>
            <div
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                backgroundColor: avatarPreview ? "transparent" : "#e0e0e0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                border: "3px solid #1976d2",
                margin: "0 auto",
                position: "relative"
              }}
            >
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Profile"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover"
                  }}
                />
              ) : (
                <span style={{ fontSize: "2rem", color: "#666" }}>👤</span>
              )}
              {isUploading && (
                <div style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(0,0,0,0.5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%"
                }}>
                  <span style={{ color: "white" }}>Uploading...</span>
                </div>
              )}
            </div>
            
            <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem", justifyContent: "center" }}>
              <UploadImage
                onSuccess={handleAvatarUploadSuccess}
                className="upload-button"
                isIcon={false}
              >
                {avatarPreview ? "Change Photo" : "Upload Photo"}
              </UploadImage>
              
              {avatarPreview && (
                <button
                  type="button"
                  onClick={removeAvatar}
                  disabled={isUploading}
                  style={{
                    padding: "0.5rem 1rem",
                    backgroundColor: "#dc3545",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "0.9rem"
                  }}
                >
                  Remove
                </button>
              )}
            </div>
            <p style={{ fontSize: "0.8rem", color: "#666", marginTop: "0.5rem" }}>
              Upload a new profile picture (max 5MB)
            </p>
          </div>
        </div>

        {/* Profile Form */}
        <form onSubmit={updateProfile} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label htmlFor="firstName" style={{ display: "block", marginBottom: "0.25rem", fontWeight: "500" }}>
                First Name
              </label>
              <input
                id="firstName"
                name="firstName"
                placeholder="First Name"
                value={form.firstName}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "1rem"
                }}
              />
            </div>
            <div>
              <label htmlFor="lastName" style={{ display: "block", marginBottom: "0.25rem", fontWeight: "500" }}>
                Last Name
              </label>
              <input
                id="lastName"
                name="lastName"
                placeholder="Last Name"
                value={form.lastName}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "1rem"
                }}
              />
            </div>
          </div>

          <div>
            <label htmlFor="username" style={{ display: "block", marginBottom: "0.25rem", fontWeight: "500" }}>
              Username
            </label>
            <input
              id="username"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "1rem"
              }}
            />
          </div>

          <div>
            <label htmlFor="email" style={{ display: "block", marginBottom: "0.25rem", fontWeight: "500" }}>
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "1rem"
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              marginTop: "1rem",
              padding: "0.75rem 1rem",
              backgroundColor: "#1976d2",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: "500"
            }}
          >
            Save Profile
          </button>
        </form>

        {/* Password Form */}
        <div style={{ marginTop: "2.5rem", paddingTop: "2rem", borderTop: "1px solid #eee" }}>
          <h3 style={{ textAlign: "center", marginBottom: "1.5rem" }}>Change Password</h3>
          <form onSubmit={updatePassword} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label htmlFor="currentPassword" style={{ display: "block", marginBottom: "0.25rem", fontWeight: "500" }}>
                Current Password
              </label>
              <input
                id="currentPassword"
                type="password"
                name="currentPassword"
                placeholder="Current Password"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "1rem"
                }}
              />
            </div>

            <div>
              <label htmlFor="newPassword" style={{ display: "block", marginBottom: "0.25rem", fontWeight: "500" }}>
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                name="newPassword"
                placeholder="New Password"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "1rem"
                }}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" style={{ display: "block", marginBottom: "0.25rem", fontWeight: "500" }}>
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                placeholder="Confirm New Password"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "1rem"
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                marginTop: "1rem",
                padding: "0.75rem 1rem",
                backgroundColor: "#28a745",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "1rem",
                fontWeight: "500"
              }}
            >
              Change Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}