import { useState } from "react";
import axios from "axios";

function WorkoutView({ workout }) {
  if (!workout) return null;

  return (
    <div className="space-y-6">
      <header className="bg-white shadow rounded p-4">
        <div className="text-sm text-gray-600">
          <div>
            Team: <b>{workout.team}</b>
          </div>
          {"dayNumber" in workout && (
            <div>
              Day: <b>{workout.dayNumber}</b>
            </div>
          )}
        </div>
      </header>

      {workout.blocks?.map((block, i) => (
        <section key={i} className="bg-white rounded shadow p-4">
          <h3 className="text-lg font-semibold text-glccBlue mb-3">{block.label}</h3>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2 pr-4">Code</th>
                  <th className="py-2 pr-4">Exercise</th>
                  <th className="py-2 pr-4">Sets x Reps</th>
                  <th className="py-2 pr-4">Rest</th>
                  <th className="py-2 pr-4">Notes</th>
                  <th className="py-2 pr-4">Warm-Up?</th>
                </tr>
              </thead>
              <tbody>
                {block.items?.map((it, idx) => (
                  <tr key={idx} className="border-b align-top">
                    <td className="py-2 pr-4 whitespace-nowrap">{it.code || "-"}</td>
                    <td className="py-2 pr-4">{it.name}</td>
                    <td className="py-2 pr-4 whitespace-nowrap">{it.setsReps || "-"}</td>
                    <td className="py-2 pr-4 whitespace-nowrap">{it.rest || "-"}</td>
                    <td className="py-2 pr-4">{it.notes || "-"}</td>
                    <td className="py-2 pr-4">{it.isWarmup ? "Yes" : "No"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </div>
  );
}

const TEAMS = ["Men's Basketball", "Women's Volleyball"];
const DAYS = [1, 2, 3, 4]; // adjust if you have more

export default function Coach() {
  const [team, setTeam] = useState("Men's Basketball");
  const [day, setDay] = useState(1);
  const [useToday, setUseToday] = useState(false);
  const [workout, setWorkout] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function loadWorkout() {
    try {
      setLoading(true);
      setError(null);
      setWorkout(null);

      const url = useToday
        ? "http://localhost:5000/workouts/today"
        : "http://localhost:5000/workouts/by";

      const params = useToday ? { team } : { team, day };
      const res = await axios.get(url, { params });

      // /today returns { date, team, weekday, dayNumber, workout }
      // /by returns the workout directly
      const data = res.data.workout ? res.data.workout : res.data;
      setWorkout(data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data || { error: "Request failed" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-glccBlue mb-4">Coach Dashboard</h2>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">Team</label>
          <select
            className="border rounded px-3 py-2 w-full"
            value={team}
            onChange={(e) => setTeam(e.target.value)}
          >
            {TEAMS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {!useToday && (
          <div>
            <label className="block text-sm font-medium mb-1">Day</label>
            <select
              className="border rounded px-3 py-2 w-full"
              value={day}
              onChange={(e) => setDay(Number(e.target.value))}
            >
              {DAYS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex items-center gap-2">
          <input
            id="useToday"
            type="checkbox"
            className="h-4 w-4"
            checked={useToday}
            onChange={(e) => setUseToday(e.target.checked)}
          />
          <label htmlFor="useToday" className="text-sm">
            Use today’s schedule
          </label>
        </div>

        <div>
          <button
            onClick={loadWorkout}
            disabled={loading}
            className="bg-glccBlue text-white px-4 py-2 rounded hover:opacity-95 disabled:opacity-60"
          >
            {loading ? "Loading…" : useToday ? "Load Today" : `Load Day ${day}`}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 text-red-700 border border-red-200 rounded p-3 mb-4">
          <pre className="whitespace-pre-wrap text-sm">
            {JSON.stringify(error, null, 2)}
          </pre>
        </div>
      )}

      {/* Result */}
      {workout && <WorkoutView workout={workout} />}
    </div>
  );
}
