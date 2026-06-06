import { Bell, Calendar, Menu, Search, Sparkles } from "lucide-react";

function Topbar() {
  return (
    <header className="topbar">
      <Menu />

      <div className="search">
        <Search size={16} />

        <input
          type="text"
          placeholder="Search anything..."
        />

        <kbd>Ctrl + K</kbd>
      </div>

      <div className="top-icons">
        <Bell size={19} />

        <Calendar size={19} />

        <div className="ai-dot">
          <Sparkles size={18} />
        </div>
      </div>
    </header>
  );
}

export default Topbar;