const express = require("express");
const Workout = require("../models/Workout");
const router = express.Router();

// GET /workouts/by?team=Women's%20Volleyball&day=1
router.get("/by", async (req, res) => {
  try {
    const { team, day } = req.query;
    if (!team || !day) return res.status(400).json({ error: "team and day are required" });

    const workout = await Workout.findOne({ team, dayNumber: Number(day) }).lean();
    if (!workout) return res.status(404).json({ error: "Workout not found" });

    res.json(workout);
  } catch (err) {
    console.error("GET /workouts/by error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;


// ===== TODAY'S WORKOUT =====

// Map each team to which dayNumber runs on which weekday (0=Sun ... 6=Sat)
const SCHEDULE = {
  "Men's Basketball": {
    1: [2],       // Tues -> Day 1
    3: [4],       // Wed -> Day 2
    5: [6]        // Sat -> Day 3
  },
  "Women's Volleyball": {
    2: [1],       // Mon -> Day 1
    4: [2]        // Wed -> Day 2
    // add more as needed (e.g., 6: [3] for Saturday Day 3)
  }
};

// Helper to normalize a date string or use today
function toDateOnly(d) {
  const dt = d ? new Date(d) : new Date();
  return new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
}

// GET /workouts/today?team=Men%27s%20Basketball[&date=YYYY-MM-DD]
router.get("/today", async (req, res) => {
  try {
    const { team } = req.query;
    if (!team) return res.status(400).json({ error: "team required" });

    const date = toDateOnly(req.query.date);
    const weekday = date.getDay(); // 0..6

    const teamMap = SCHEDULE[team];
    if (!teamMap) return res.status(404).json({ error: `No schedule for team ${team}` });

    // Find the dayNumber that matches today's weekday
    let dayNumber = null;
    for (const [dayNumStr, weekdays] of Object.entries(teamMap)) {
      if (weekdays.includes(weekday)) {
        dayNumber = Number(dayNumStr);
        break;
      }
    }
    if (!dayNumber) {
      return res.status(404).json({ error: `No workout scheduled for this weekday (${weekday})` });
    }

    const workout = await Workout.findOne({ team, dayNumber }).lean();
    if (!workout) return res.status(404).json({ error: `Workout not found for ${team} Day ${dayNumber}` });

    res.json({ date, team, weekday, dayNumber, workout });
  } catch (err) {
    console.error("GET /workouts/today error:", err);
    res.status(500).json({ error: "Server error" });
  }
});
