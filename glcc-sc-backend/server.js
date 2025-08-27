// server.js — minimal, no .env, uses the same URI that worked in connect-test.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

console.log("RUNNING FILE:", __filename);

// 1) PASTE THE EXACT SAME URI THAT WORKED IN connect-test.js:
const MONGO_URI = "mongodb+srv://glccapp:GlccSc2025@glcc-sc.vtpcweg.mongodb.net/GLCC-SC?retryWrites=true&w=majority";

async function start() {
  try {
    console.log("Connecting to:", MONGO_URI.replace(/:\/\/.*@/, "://<redacted>@"));
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 15000 });
    console.log("✅ MongoDB connected");

    // ---- Express app setup ----
    const app = express();
    app.use(express.json());
    app.use(cors());

    // ============= STEP 6 GOES HERE =============
    // Mount the workouts router you created in routes/workouts.js
    const workoutsRouter = require("./routes/workouts");
    app.use("/workouts", workoutsRouter);
    const logsRouter = require("./routes/logs");
    app.use("/logs", logsRouter);

    // ============================================

    // (Optional) simple test routes
    app.get("/", (_req, res) => res.send("GLCC-SC API is running..."));
    app.get("/workouts/test", (_req, res) => res.json({ ok: true }));

    // Start server
    const PORT = 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (err) {
    console.error("❌ MongoDB error:", err);
    process.exit(1);
  }
}

start();
