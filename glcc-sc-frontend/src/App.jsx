import { Routes, Route, Link, Navigate } from "react-router-dom";
import Coach from "./pages/Coach.jsx";
import Log from "./pages/Log.jsx";

export default function App() {
  return (
    <>
      <nav className="p-4 border-b bg-white mb-6">
        <div className="max-w-6xl mx-auto flex gap-4">
          <Link className="text-glccBlue font-semibold" to="/coach">Coach</Link>
          <Link className="text-glccBlue font-semibold" to="/log">Athlete Log</Link>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Navigate to="/coach" replace />} />
        <Route path="/coach" element={<Coach />} />
        <Route path="/log" element={<Log />} />
      </Routes>
    </>
  );
}