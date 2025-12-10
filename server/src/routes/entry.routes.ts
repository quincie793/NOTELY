import { Router } from "express";
import { authRequired } from "../middleware/authentication";
import { createEntry, listEntries, deleteEntry,getEntry,toggleBookmark, listPinned,listBookmarks,togglePin,updateEntry,listTrash ,restoreEntry } from "../controllers/entry.controller";

const r = Router();
r.use(authRequired);

r.post("/entries", createEntry);
r.get("/entries", listEntries);
r.get("/entry/:id", getEntry);  
r.patch("/entry/:id", updateEntry); // 🆕 Update entry
r.get("/entries/trash", listTrash); // 🆕 List deleted entries
r.patch("/entry/restore/:id", restoreEntry); // 🆕 Restore entry
r.delete("/entry/:id", deleteEntry);
r.patch("/entry/:id/pin", togglePin);
r.patch("/entry/:id/bookmark", toggleBookmark);
r.get("/entries/bookmarks", listBookmarks);
r.get("/entries/pinned", listPinned);



export default r;
