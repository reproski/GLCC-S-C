import { useState } from "react";
import api from "../api";

export default function Athlete() {
  const [athleteName, setAthleteName] = useState("");
  const [team, setTeam] = useState("Men's Basketball");
  const [dayNumber, setDayNumber] = useState(1);
  const [entries, setEntries] = useState([{ exerciseCode: "", exerciseName: "", weight: "", reps: "", rpe: "" }]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Handle change for each entry row
  function handleEntryChange(idx, field, value) {
    const copy = [...entries];
    copy[idx][field] = value;
    setEntries(copy);
  }

  function addEntry() {
    setEntries([...entries, { exerciseCode: "", exerciseName: "", weight: "", reps: "", rpe: "" }]);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError(null);
      setResult(null);

      const res = await api.post("/logs", {
        athleteName,
        team,
        dayNumber,
        attended: true,
        entries,
      });

      setResult(res.data);
    } catch (err) {
      setError(err.response?.data || { error: "Request failed" });
    }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-glccBlue mb-4">Athlete Log</h2>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white shadow rounded p-4">
        <div>
          <label className="block text-sm font-medium">Athlete Name</label>
          <input
            className="border rounded px-3 py-2 w-full"
            value={athleteName}
            onChange={(e) => setAthleteName(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Team</label>
          <select
            className="border rounded px-3 py-2 w-full"
            value={team}
            onChange={(e) => setTeam(e.target.value)}
          >
            <option>Men's Basketball</option>
            <option>Women's Volleyball</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Day Number</label>
          <input
            type="number"
            className="border rounded px-3 py-2 w-full"
            value={dayNumber}
            onChange={(e) => setDayNumber(Number(e.target.value))}
          />
        </div>

        <div>
          <h3 className="font-semibold mb-2">Entries</h3>
          {entries.map((entry, idx) => (
            <div key={idx} className="grid grid-cols-5 gap-2 mb-2">
              <input
                className="border rounded px-2 py-1"
                placeholder="Code"
                value={entry.exerciseCode}
                onChange={(e) => handleEntryChange(idx, "exerciseCode", e.target.value)}
              />
              <input
                className="border rounded px-2 py-1"
                placeholder="Exercise"
                value={entry.exerciseName}
                onChange={(e) => handleEntryChange(idx, "exerciseName", e.target.value)}
              />
              <input
                className="border rounded px-2 py-1"
                placeholder="Weight"
                value={entry.weight}
                onChange={(e) => handleEntryChange(idx, "weight", e.target.value)}
              />
              <input
                className="border rounded px-2 py-1"
                placeholder="Reps"
                value={entry.reps}
                onChange={(e) => handleEntryChange(idx, "reps", e.target.value)}
              />
              <input
                className="border rounded px-2 py-1"
                placeholder="RPE"
                value={entry.rpe}
                onChange={(e) => handleEntryChange(idx, "rpe", e.target.value)}
              />
            </div>
          ))}
          <button type="button" onClick={addEntry} className="text-sm text-blue-600">
            + Add Another
          </button>
        </div>

        <button
          type="submit"
          className="bg-glccBlue text-white px-4 py-2 rounded hover:opacity-90"
        >
          Submit Log
        </button>
      </form>

      {result && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded text-green-700">
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-700">
          <pre>{JSON.stringify(error, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
