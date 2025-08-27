// scripts/seed.js
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const Workout = require("../models/Workout");

// *** Use the SAME URI that works in your server.js ***
const MONGO_URI = "mongodb+srv://glccapp:GlccSc2025@glcc-sc.vtpcweg.mongodb.net/GLCC-SC?retryWrites=true&w=majority";

async function run() {
  try {
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 15000 });
    console.log("✅ Connected for seeding");

    const dataPath = path.join(__dirname, "..", "data", "workouts.json");
    const raw = fs.readFileSync(dataPath, "utf-8");
    const workouts = JSON.parse(raw);

    let upserts = 0;
    for (const w of workouts) {
      await Workout.updateOne(
        { team: w.team, dayNumber: w.dayNumber },
        { $set: w },
        { upsert: true }
      );
      upserts++;
    }

    console.log(`✅ Seed complete. Upserted ${upserts} workouts.`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed error:", err);
    process.exit(1);
  }
}

run();
