import { NavLink } from "react-router-dom";

const linkBase =
  "px-3 py-2 rounded-md text-sm font-medium hover:bg-white/10 transition";
const active = "bg-white/10 text-white";
const idle = "text-white/80";

export default function NavBar() {
  return (
    <header className="bg-glccBlue">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <div className="text-glccGold font-bold tracking-wide">
            GLCC S&C
          </div>
          <nav className="flex gap-2">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `${linkBase} ${isActive ? active : idle}`
              }
            >
              Today
            </NavLink>
            <NavLink
              to="/history"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? active : idle}`
              }
            >
              History
            </NavLink>
            <NavLink
              to="/coach"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? active : idle}`
              }
            >
              Coach
            </NavLink>
          </nav>
        </div>
      </div>
    </header>
  );
}
