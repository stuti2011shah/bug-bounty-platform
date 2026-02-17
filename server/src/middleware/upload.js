import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const ALLOWED_IMAGE = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const ALLOWED_VIDEO = ["video/mp4", "video/webm", "video/quicktime"];
const ALLOWED = [...ALLOWED_IMAGE, ...ALLOWED_VIDEO];

const MAX_SIZE = 10 * 1024 * 1024; // 10MB per file
const MAX_FILES = 5;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const mimeExt = { "image/jpeg": ".jpg", "image/png": ".png", "image/gif": ".gif", "image/webp": ".webp", "video/mp4": ".mp4", "video/webm": ".webm", "video/quicktime": ".mov" };
    const ext = path.extname(file.originalname) || mimeExt[file.mimetype] || ".bin";
    const base = Date.now() + "-" + Math.random().toString(36).slice(2);
    cb(null, base + ext.toLowerCase());
  },
});

const fileFilter = (req, file, cb) => {
  if (ALLOWED.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type: ${file.mimetype}. Allowed: images (jpg, png, gif, webp), videos (mp4, webm)`));
  }
};

export const uploadProof = multer({
  storage,
  limits: { fileSize: MAX_SIZE },
  fileFilter,
}).array("proofFiles", MAX_FILES);
