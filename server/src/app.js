import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.routes.js";
import { notFound, errorHandler } from "./middleware/error.js";
import bugRoutes from "./routes/bug.routes.js";
import submissionRoutes from "./routes/submission.routes.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("Bug Bounty API ✅"));

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/bugs", bugRoutes);
app.use("/api/bugs/:bugId/submissions", submissionRoutes);
app.use(notFound);
app.use(errorHandler);

export default app;