import { useMemo, useState } from "react";
import {
  Search,
  PanelLeftClose,
  SquarePen,
  Library,
  Compass,
  Clock,
  Trash2,
  Check,
  X,
  MessageSquare,
} from "lucide-react";
import { useSelector } from "react-redux";

import Logout from "../pages/Logout";

const navItems = [
  { label: "Library", icon: Library },
  { label: "Explore", icon: Compass },
  { label: "Scheduled", icon: Clock },
];

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-400";

const iconBtn = `flex h-9 w-9 items-center justify-center rounded-lg text-neutral-400 transition hover:bg-white/[0.07] hover:text-white ${focusRing}`;

const navRow = `flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-neutral-300 transition hover:bg-white/[0.07] hover:text-white ${focusRing}`;

/* ---------- helpers ---------- */

// Works with Firestore Timestamp, Date, or a number
const toMillis = (v) => {
  if (!v) return null;
  if (typeof v === "number") return v;
  if (v instanceof Date) return v.getTime();
  if (typeof v.toMillis === "function") return v.toMillis();
  if (typeof v.seconds === "number") return v.seconds * 1000;
  return null;
};

const getTime = (chat) => toMillis(chat.updatedAt) ?? toMillis(chat.createdAt);

const groupChats = (chats) => {
  const startOfToday = new Date().setHours(0, 0, 0, 0);
  const DAY = 86400000;

  const groups = [
    { label: "Today", items: [] },
    { label: "Yesterday", items: [] },
    { label: "Previous 7 days", items: [] },
    { label: "Older", items: [] },
  ];
  const undated = [];

  chats.forEach((chat) => {
    const t = getTime(chat);
    if (t == null) return undated.push(chat);
    const diff = startOfToday - t;
    if (diff <= 0) groups[0].items.push(chat);
    else if (diff <= DAY) groups[1].items.push(chat);
    else if (diff <= 7 * DAY) groups[2].items.push(chat);
    else groups[3].items.push(chat);
  });

  if (undated.length) groups.push({ label: "Recents", items: undated });
  return groups.filter((g) => g.items.length > 0);
};

/* ---------- component ---------- */

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

  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [confirmId, setConfirmId] = useState(null);

  const closeSearch = () => {
    setSearchOpen(false);
    setQuery("");
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return chats;
    return chats.filter(
      (c) =>
        (c.title || "").toLowerCase().includes(q) ||
        (c.messages || []).some((m) => (m.text || "").toLowerCase().includes(q))
    );
  }, [chats, query]);

  const groups = useMemo(() => groupChats(filtered), [filtered]);

  return (
    <div className="flex h-full w-full flex-col">
      {/* Brand + actions */}
      <div className="flex items-center justify-between px-4 py-4">
        <span className="text-xl font-bold tracking-tight text-white">
          Orvex<span className="text-cyan-400">-AI</span>
        </span>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => (searchOpen ? closeSearch() : setSearchOpen(true))}
            aria-label="Search chats"
            aria-pressed={searchOpen}
            className={`${iconBtn} ${searchOpen ? "bg-white/[0.07] text-cyan-300" : ""}`}
          >
            <Search size={19} />
          </button>
          <button
            type="button"
            onClick={onToggle}
            aria-label="Close sidebar"
            className={iconBtn}
          >
            <PanelLeftClose size={19} />
          </button>
        </div>
      </div>

      {/* Search */}
      {searchOpen && (
        <div className="px-3 pb-2">
          <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 transition focus-within:border-cyan-400/50">
            <Search size={16} className="shrink-0 text-neutral-500" />
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Escape" && closeSearch()}
              placeholder="Search your chats"
              aria-label="Search your chats"
              className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-neutral-500"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="text-neutral-500 transition hover:text-white"
              >
                <X size={15} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* New chat + nav */}
      <div className="space-y-1 px-3">
        <button
          type="button"
          onClick={onNewChat}
          className={`mb-2 flex w-full items-center gap-3 rounded-xl bg-cyan-400/10 px-3 py-2.5 text-sm font-medium text-cyan-200 ring-1 ring-inset ring-cyan-400/20 transition hover:bg-cyan-400/15 ${focusRing}`}
        >
          <SquarePen size={18} className="text-cyan-400" />
          New chat
        </button>

        {!searchOpen &&
          navItems.map(({ label, icon: Icon }) => (
            <button key={label} type="button" className={navRow}>
              <Icon size={18} className="shrink-0 text-neutral-400" />
              {label}
            </button>
          ))}
      </div>

      {/* Scrollable chat history */}
      <nav
        aria-label="Chat history"
        className="mt-4 min-h-0 flex-1 overflow-y-auto px-3 pb-4 [scrollbar-color:rgba(255,255,255,0.15)_transparent] [scrollbar-width:thin]"
      >
        {chats.length === 0 ? (
          <div className="mt-6 flex flex-col items-center gap-2 px-4 text-center">
            <MessageSquare size={22} className="text-neutral-600" />
            <p className="text-sm text-neutral-400">No chats yet</p>
            <p className="text-xs text-neutral-600">
              Send a message and it will show up here.
            </p>
          </div>
        ) : groups.length === 0 ? (
          <p className="mt-6 px-3 text-center text-sm text-neutral-500">
            No chats match “{query}”.
          </p>
        ) : (
          groups.map((group) => (
            <section key={group.label} className="mb-4">
              <h2 className="mb-1 px-3 text-xs font-medium text-neutral-500">
                {group.label}
              </h2>

              <ul className="space-y-0.5">
                {group.items.map((chat) => {
                  const active = chat.id === activeId;
                  const confirming = confirmId === chat.id;
                  const title = chat.title || "New chat";

                  return (
                    <li key={chat.id} className="group relative">
                      {active && (
                        <span
                          aria-hidden="true"
                          className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-cyan-400"
                        />
                      )}

                      <button
                        type="button"
                        onClick={() => onSelectChat(chat)}
                        aria-current={active ? "true" : undefined}
                        title={title}
                        className={`flex w-full items-center rounded-lg py-2 pl-3 pr-10 text-left text-sm transition ${focusRing} ${
                          active
                            ? "bg-white/[0.09] text-white"
                            : "text-neutral-400 hover:bg-white/[0.06] hover:text-white"
                        }`}
                      >
                        <span className="truncate">{title}</span>
                      </button>

                      {confirming ? (
                        <div className="absolute right-1.5 top-1/2 flex -translate-y-1/2 items-center gap-0.5 rounded-md bg-neutral-900 p-0.5 ring-1 ring-white/10">
                          <button
                            type="button"
                            onClick={() => {
                              setConfirmId(null);
                              onDeleteChat(chat);
                            }}
                            aria-label={`Confirm delete ${title}`}
                            className="flex h-7 w-7 items-center justify-center rounded text-red-400 transition hover:bg-red-500/15"
                          >
                            <Check size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmId(null)}
                            aria-label="Cancel delete"
                            className="flex h-7 w-7 items-center justify-center rounded text-neutral-400 transition hover:bg-white/10 hover:text-white"
                          >
                            <X size={15} />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmId(chat.id)}
                          aria-label={`Delete ${title}`}
                          className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-neutral-500 opacity-0 transition hover:bg-white/10 hover:text-red-400 focus-visible:opacity-100 group-hover:opacity-100 [@media(hover:none)]:opacity-100"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          ))
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