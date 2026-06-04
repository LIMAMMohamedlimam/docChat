import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { chat } from "../controllers/chat.controller";

const router = Router();

router.use(authenticate);
router.post("/", chat);

export default router;
