const express = require("express");
const Workout = require("../models/Workout");
const WorkoutLog = require("../models/WorkoutLog");
const router = express.Router();

// Helper: strip time to midnight local
function toDateOnly(d) {
  const dt = new Date(d || Date.now());
  return new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
}

/**
 * POST /logs
 * Body:
 * {
 *   team: "Men's Basketball",
 *   athleteId: "mb-23-jdoe",
 *   athleteName: "John Doe",
 *   dayNumber: 1,
 *   date: "2025-08-26",               // optional; defaults today
 *   attended: true,
 *   injuryNotes: "",
 *   entries: [{ exerciseCode, exerciseName, weight, reps, rpe, notes }]
 * }
 */
router.post("/", async (req, res) => {
  try {
    const { team, athleteId, athleteName, dayNumber } = req.body;
    if (!team || !athleteId || !athleteName || !dayNumber) {
      return res.status(400).json({ error: "team, athleteId, athleteName, dayNumber required" });
    }
    const date = toDateOnly(req.body.date);

    // optional: link to workout doc if it exists
    const workout = await Workout.findOne({ team, dayNumber: Number(dayNumber) }).select("_id");

    const log = await WorkoutLog.create({
      team,
      athleteId,
      athleteName,
      dayNumber: Number(dayNumber),
      date,
      entries: req.body.entries || [],
      attended: req.body.attended !== false,
      injuryNotes: req.body.injuryNotes || "",
      workoutId: workout?._id
    });

    res.status(201).json({ ok: true, id: log._id });
  } catch (err) {
    console.error("POST /logs error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * GET /logs/athlete/:athleteId?from=YYYY-MM-DD&to=YYYY-MM-DD
 * Returns all logs for an athlete (optionally within a date range)
 */
router.get("/athlete/:athleteId", async (req, res) => {
  try {
    const { athleteId } = req.params;
    const from = req.query.from ? toDateOnly(req.query.from) : null;
    const to = req.query.to ? toDateOnly(req.query.to) : null;

    const q = { athleteId };
    if (from || to) {
      q.date = {};
      if (from) q.date.$gte = from;
      if (to) q.date.$lte = to;
    }

    const logs = await WorkoutLog.find(q).sort({ date: -1 }).lean();
    res.json({ athleteId, count: logs.length, logs });
  } catch (err) {
    console.error("GET /logs/athlete error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * GET /logs/team-summary?team=Women's%20Volleyball&from=YYYY-MM-DD&to=YYYY-MM-DD
 * Returns per-day attendance counts and simple volume totals.
 */
router.get("/team-summary", async (req, res) => {
  try {
    const { team } = req.query;
    if (!team) return res.status(400).json({ error: "team required" });

    const from = req.query.from ? toDateOnly(req.query.from) : new Date(Date.now() - 14 * 864e5);
    const to = req.query.to ? toDateOnly(req.query.to) : new Date();

    const agg = await WorkoutLog.aggregate([
      { $match: { team, date: { $gte: from, $lte: to } } },
      {
        $project: {
          date: 1,
          attended: 1,
          dayNumber: 1,
          totalReps: { $sum: "$entries.reps" },
          totalWeight: { $sum: "$entries.weight" }
        }
      },
      {
        $group: {
          _id: "$date",
          sessions: { $sum: 1 },
          attended: { $sum: { $cond: ["$attended", 1, 0] } },
          totalReps: { $sum: "$totalReps" },
          totalWeight: { $sum: "$totalWeight" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({ team, from, to, days: agg });
  } catch (err) {
    console.error("GET /logs/team-summary error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
