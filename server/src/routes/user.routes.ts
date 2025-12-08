import { Router } from "express";
import { authRequired } from "../middleware/authentication";
import { updateUser } from "../controllers/user.controller";

const router = Router();
router.use(authRequired);

router.patch("/", updateUser); // PATCH /api/user

export default router;
