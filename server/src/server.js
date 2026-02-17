import dotenv from "dotenv";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import { seedDevDatabase } from "./seed/devSeed.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

await connectDB(process.env.MONGO_URI);

const shouldSeed =
  process.env.NODE_ENV !== "production" &&
  (process.env.SEED_ON_START ?? "true").toLowerCase() === "true";

const server = app.listen(PORT, async () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);

  // Seed ONLY after a successful listen, so we don't wipe data when the port is already in use.
  if (shouldSeed) {
    try {
      const result = await seedDevDatabase();
      console.log(
        `🌱 Seeded dev data: ${result.bugsSeeded} bugs, ${result.usersSeeded} demo users`
      );
    } catch (err) {
      console.error("❌ Dev seed failed:", err?.message || err);
    }
  }
});

server.on("error", (err) => {
  if (err?.code === "EADDRINUSE") {
    console.error(`❌ Port ${PORT} is already in use. Stop the other server or set PORT to a new value.`);
    process.exit(1);
  }
  console.error("❌ Server error:", err);
  process.exit(1);
});