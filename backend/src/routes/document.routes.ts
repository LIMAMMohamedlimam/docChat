import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { upload } from "../middleware/upload";
import {
  uploadDocument,
  listDocuments,
  getDocument,
  getDocumentChunks,
  removeDocument,
} from "../controllers/document.controller";

const router = Router();

router.use(authenticate);

router.post("/", upload.single("file"), uploadDocument);
router.get("/", listDocuments);
router.get("/:id", getDocument);
router.get("/:id/chunks", getDocumentChunks);
router.delete("/:id", removeDocument);

export default router;
