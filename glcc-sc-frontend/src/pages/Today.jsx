import { useState } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Today() {
  const [team, setTeam] = useState("Men's Basketball");
  const [day, setDay] = useState(1);
  const [loading, setLoading] = useState(false);
  const [workout, setWorkout] = useState(null);
  const [error, setError] = useState("");

  const loadWorkout = async () => {
    setLoading(true);
    setError("");
    setWorkout(null);
    try {
      const url = `${API}/workouts/by?team=${encodeURIComponent(team)}&day=${day}`;
      const res = await fetch(url);
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || `HTTP ${res.status}`);
      }
      const data = await res.json();
      setWorkout(data);
    } catch (e) {
      setError(String(e.message || e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold text-glccBlue">Today</h2>

      <div className="flex flex-wrap items-end gap-3">
        <div>
          <label className="block text-sm mb-1">Team</label>
          <select
            className="border rounded px-3 py-2"
            value={team}
            onChange={(e) => setTeam(e.target.value)}
          >
            <option>Men&apos;s Basketball</option>
            <option>Women&apos;s Volleyball</option>
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1">Day</label>
          <select
            className="border rounded px-3 py-2"
            value={day}
            onChange={(e) => setDay(Number(e.target.value))}
          >
            {[1, 2, 3].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={loadWorkout}
          className="px-4 py-2 rounded bg-glccBlue text-white"
          disabled={loading}
        >
          {loading ? "Loading..." : "Load workout"}
        </button>
      </div>

      {error && <div className="text-red-600 text-sm">{error}</div>}

      {workout && (
        <div className="rounded-xl bg-white shadow p-4">
          <div className="mb-2 text-sm opacity-70">
            {workout.team} — Day {workout.dayNumber}
          </div>
          <h3 className="text-lg font-semibold mb-3">
            {workout.title || "Workout"}
          </h3>

          <div className="space-y-3">
            {workout.blocks?.map((block, i) => (
              <div key={i} className="border rounded p-3">
                <div className="font-medium mb-2">
                  {block.name || `Block ${i + 1}`}
                </div>
                <ul className="list-disc pl-5 space-y-1">
                  {block.exercises?.map((ex, j) => (
                    <li key={j}>
                      <div className="font-medium">{ex.exerciseName}</div>
                      {ex.setsReps && (
                        <div className="text-sm opacity-80">{ex.setsReps}</div>
                      )}
                    </li>
                  ))}
                </ul>
