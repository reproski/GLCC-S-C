const mongoose = require("mongoose");

const ExerciseSchema = new mongoose.Schema({
  code: String,                    // e.g., A1, Warm-Up
  name: { type: String, required: true },
  setsReps: String,                // "3 x 8-10 reps" or "30s per group"
  rest: String,                    // "60-90s", "---"
  notes: String,                   // coaching notes
  videoUrl: String,                // link you’ll add later
  isWarmup: { type: Boolean, default: false }
}, { _id: false });

const BlockSchema = new mongoose.Schema({
  label: String,                   // "Warm-Up", "Superset", "Accessory"
  items: [ExerciseSchema]
}, { _id: false });

const WorkoutSchema = new mongoose.Schema({
  team: { 
    type: String, 
    enum: ["Men's Basketball", "Women's Volleyball"], 
    required: true 
  },
  dayNumber: { type: Number, required: true },   // Day 1, Day 2, Day 3...
  title: String,                                  // e.g., "Lower Body Strength & Stability"
  blocks: [BlockSchema],
  monthTag: String                                // optional: "2025-09" for monthly programs
}, { timestamps: true });

WorkoutSchema.index({ team: 1, dayNumber: 1 }, { unique: true });

module.exports = mongoose.model("Workout", WorkoutSchema);
