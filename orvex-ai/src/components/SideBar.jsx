import {
  Search,
  PanelLeftClose,
  SquarePen,
  Library,
  Compass,
  Clock,
  Trash2,
} from "lucide-react";
import { useSelector } from "react-redux";

import Logout from "../pages/Logout";

const navItems = [
  { label: "Library", icon: Library },
  { label: "Explore", icon: Compass },
  { label: "Scheduled", icon: Clock },
];

const rowClass =
  "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-neutral-300 transition hover:bg-white/[0.07] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-400";

const SideBar = ({
  chats = [],
  activeId = null,
  onToggle,
  onNewChat,
  onSelectChat,
  onDeleteChat,
}) => {
  const user = useSelector((store) => store.user);
  const name = user?.displayName || user?.email || "Guest";
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex h-full w-full flex-col">
      {/* Brand + actions */}
      <div className="flex items-center justify-between px-4 py-4">
        <span className="text-xl font-bold tracking-tight text-white">
          Orvex<span className="text-cyan-400">-AI</span>
        </span>

        <div className="flex items-center gap-1 text-neutral-400">
          <button
            type="button"
            aria-label="Search chats"
            className="flex h-9 w-9 items-center justify-center rounded-lg transition hover:bg-white/[0.07] hover:text-white"
          >
            <Search size={19} />
          </button>
          <button
            type="button"
            onClick={onToggle}
            aria-label="Close sidebar"
            className="flex h-9 w-9 items-center justify-center rounded-lg transition hover:bg-white/[0.07] hover:text-white"
          >
            <PanelLeftClose size={19} />
          </button>
        </div>
      </div>

      {/* New chat + nav */}
      <div className="space-y-1 px-3">
        <button
          type="button"
          onClick={onNewChat}
          className="mb-2 flex w-full items-center gap-3 rounded-xl bg-white/[0.08] px-3 py-2.5 text-sm font-medium text-white transition hover:bg-white/[0.12] focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-400"
        >
          <SquarePen size={18} className="text-cyan-400" />
          New chat
        </button>

        {navItems.map(({ label, icon: Icon }) => (
          <button key={label} type="button" className={rowClass}>
            <Icon size={18} className="shrink-0 text-neutral-400" />
            {label}
          </button>
        ))}
      </div>

      {/* Scrollable chat history */}
      <nav className="mt-4 min-h-0 flex-1 overflow-y-auto px-3 pb-4">
        <h2 className="mb-1 px-3 text-sm font-medium text-neutral-500">
          Recents
        </h2>

        {chats.length === 0 ? (
          <p className="px-3 text-sm text-neutral-600">
            No conversations yet.
          </p>
        ) : (
          <ul>
            {chats.map((chat) => (
              <li key={chat.id} className="group relative">
                <button
                  type="button"
                  onClick={() => onSelectChat(chat)}
                  className={`${rowClass} pr-10 ${
                    chat.id === activeId ? "bg-white/[0.1] text-white" : ""
                  }`}
                >
                  <span className="truncate">{chat.title || "New chat"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => onDeleteChat(chat)}
                  aria-label={`Delete ${chat.title || "chat"}`}
                  className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-neutral-500 opacity-0 transition hover:bg-white/10 hover:text-red-400 focus-visible:opacity-100 group-hover:opacity-100"
                >
                  <Trash2 size={15} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </nav>

      {/* Profile */}
      <div className="flex items-center gap-3 border-t border-white/10 px-4 py-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cyan-400/15 text-xs font-semibold text-cyan-300">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-white">{name}</p>
          {user?.email && user?.displayName && (
            <p className="truncate text-xs text-neutral-500">{user.email}</p>
          )}
        </div>
        <Logout />
      </div>
    </div>
  );
};

export default SideBar;