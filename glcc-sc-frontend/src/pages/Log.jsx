import { useState } from "react";
import axios from "axios";

const TEAMS = ["Men's Basketball", "Women's Volleyball"];

export default function Log() {
  const [team, setTeam] = useState("Men's Basketball");
  const [athleteId, setAthleteId] = useState("mb-23-jdoe");
  const [athleteName, setAthleteName] = useState("John Doe");
  const [dayNumber, setDayNumber] = useState(1);
  const [notes, setNotes] = useState("");
  const [attended, setAttended] = useState(true);

  // one or more entries; you can add a row
  const [entries, setEntries] = useState([
    { exerciseCode: "A1", exerciseName: "Trap Bar Deadlift", weight: 275, reps: 5, rpe: 8 },
  ]);

  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  function updateEntry(i, field, val) {
    setEntries((rows) => rows.map((r, idx) => (idx === i ? { ...r, [field]: val } : r)));
  }
  function addRow() {
    setEntries((rows) => [...rows, { exerciseCode: "", exerciseName: "", weight: "", reps: "", rpe: "" }]);
  }
  function removeRow(i) {
    setEntries((rows) => rows.filter((_, idx) => idx !== i));
  }

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    setResult(null);
    setError(null);

    try {
      const payload = {
        team,
        athleteId,
        athleteName,
        dayNumber: Number(dayNumber),
        injuryNotes: notes,
        attended,
        entries: entries.map((r) => ({
          exerciseCode: r.exerciseCode || "",
          exerciseName: r.exerciseName || "",
          weight: r.weight ? Number(r.weight) : null,
          reps: r.reps ? Number(r.reps) : null,
          rpe: r.rpe ? Number(r.rpe) : null,
        })),
      };

      const res = await axios.post("http://localhost:5000/logs", payload, {
        headers: { "Content-Type": "application/json" },
      });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data || { error: "Failed to save" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-glccBlue mb-4">Athlete Log</h2>

      <form onSubmit={submit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Team</label>
            <select className="border rounded px-3 py-2 w-full" value={team} onChange={(e) => setTeam(e.target.value)}>
              {TEAMS.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Day Number</label>
            <input
              type="number"
              min={1}
              className="border rounded px-3 py-2 w-full"
              value={dayNumber}
              onChange={(e) => setDayNumber(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Athlete ID</label>
            <input
              className="border rounded px-3 py-2 w-full"
              value={athleteId}
              onChange={(e) => setAthleteId(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Athlete Name</label>
            <input
              className="border rounded px-3 py-2 w-full"
              value={athleteName}
              onChange={(e) => setAthleteName(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <div>
            <label className="block text-sm mb-1">Injury Notes</label>
            <textarea
              className="border rounded px-3 py-2 w-full"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <label className="inline-flex items-center gap-2 mt-2">
            <input type="checkbox" checked={attended} onChange={(e) => setAttended(e.target.checked)} />
            Attended
          </label>
        </div>

        <div className="bg-white rounded shadow p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold">Entries</h3>
            <button type="button" className="bg-gray-100 px-3 py-1 rounded" onClick={addRow}>
              + Add Row
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2 pr-3">Code</th>
                  <th className="py-2 pr-3">Exercise</th>
                  <th className="py-2 pr-3">Weight</th>
                  <th className="py-2 pr-3">Reps</th>
                  <th className="py-2 pr-3">RPE</th>
                  <th className="py-2 pr-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((r, i) => (
                  <tr key={i} className="border-b">
                    <td className="py-2 pr-3">
                      <input
                        className="border rounded px-2 py-1 w-24"
                        value={r.exerciseCode}
                        onChange={(e) => updateEntry(i, "exerciseCode", e.target.value)}
                      />
                    </td>
                    <td className="py-2 pr-3">
                      <input
                        className="border rounded px-2 py-1 w-64"
                        value={r.exerciseName}
                        onChange={(e) => updateEntry(i, "exerciseName", e.target.value)}
                      />
                    </td>
                    <td className="py-2 pr-3">
                      <input
                        type="number"
                        className="border rounded px-2 py-1 w-24"
                        value={r.weight}
                        onChange={(e) => updateEntry(i, "weight", e.target.value)}
                      />
                    </td>
                    <td className="py-2 pr-3">
                      <input
                        type="number"
                        className="border rounded px-2 py-1 w-20"
                        value={r.reps}
                        onChange={(e) => updateEntry(i, "reps", e.target.value)}
                      />
                    </td>
                    <td className="py-2 pr-3">
                      <input
                        type="number"
                        className="border rounded px-2 py-1 w-20"
                        value={r.rpe}
                        onChange={(e) => updateEntry(i, "rpe", e.target.value)}
                      />
                    </td>
                    <td className="py-2 pr-3">
                      <button type="button" className="text-red-600" onClick={() => removeRow(i)}>
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-glccBlue text-white px-4 py-2 rounded hover:opacity-95 disabled:opacity-60"
        >
          {saving ? "Saving…" : "Submit Log"}
        </button>
      </form>

      {result && (
        <div className="mt-4 bg-green-50 border border-green-200 text-green-700 rounded p-3">
          <pre className="text-sm whitespace-pre-wrap">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 text-red-700 rounded p-3">
          <pre className="text-sm whitespace-pre-wrap">{JSON.stringify(error, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
