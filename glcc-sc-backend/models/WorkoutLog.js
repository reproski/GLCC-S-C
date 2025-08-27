const mongoose = require("mongoose");

const EntrySchema = new mongoose.Schema({
  exerciseCode: String,          // e.g., A1, B2 (optional but handy)
  exerciseName: { type: String, required: true },
  weight: Number,                 // lbs or kg (your choice)
  reps: Number,
  rpe: Number,                    // optional
  notes: String
}, { _id: false });

const WorkoutLogSchema = new mongoose.Schema({
  team: { type: String, enum: ["Men's Basketball", "Women's Volleyball"], required: true },
  athleteId: { type: String, required: true },    // your internal id (email, student id, etc.)
  athleteName: { type: String, required: true },  // display name

  // tie to the program
  dayNumber: { type: Number, required: true },    // which day of the program (1/2/3…)
  workoutId: { type: mongoose.Schema.Types.ObjectId, ref: "Workout" }, // optional link

  // when it happened
  date: { type: Date, required: true },           // submit date (YYYY-MM-DD is fine)

  // what happened
  entries: [EntrySchema],                         // one per exercise the athlete logs
  attended: { type: Boolean, default: true },
  injuryNotes: String
}, { timestamps: true });

WorkoutLogSchema.index({ team: 1, date: 1 });
WorkoutLogSchema.index({ athleteId: 1, date: 1 });
WorkoutLogSchema.index({ athleteId: 1, team: 1, dayNumber: 1, date: 1 });

module.exports = mongoose.model("WorkoutLog", WorkoutLogSchema);
