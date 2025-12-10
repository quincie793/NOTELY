// App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute"; 
import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import NewEntry from "./pages/NewEntry";
import EditEntry from "./pages/EditEntry";
import EntryDetail from "./pages/EntryDetail";
import Trash from "./pages/Trash";
import Profile from "./pages/Profile";
import Logout from "./pages/Logout";
import Pinned from "./pages/Pinned";
import Bookmarks  from "./pages/BookMarks";
<Route path="/logout" element={<Logout />} />


export default function App() {
  return (
    <BrowserRouter>
      {/* ✅ Full-page gradient background wrapper */}
      <div
        className="min-h-screen w-full animate-gradient"
        style={{
          background: "linear-gradient(to right, #74ebd5, #ACB6E5)", // 🌈 unified gradient
        }}
      >
        <Navbar />
        <main className="p-4 relative z-10">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/bookmarks" element={<Bookmarks />} />
            <Route path="/pinned" element={<Pinned />} />
            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/new-entry" element={<NewEntry />} />
              <Route path="/entry/:id" element={<EntryDetail />} />
              <Route path="/entry/:id/edit" element={<EditEntry />} />
              <Route path="/trash" element={<Trash />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
