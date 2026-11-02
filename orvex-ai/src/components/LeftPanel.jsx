
import { useMemo, useState } from "react";
import {
  Search,
  PanelLeftClose,
  SquarePen,
  Trash2,
  Check,
  X,
} from "lucide-react";
import { useSelector } from "react-redux";
import Logout from "../pages/Logout";

const LeftPanel = ({
  chats = [],
  activeId,
  onToggle,
  onNewChat,
  onSelectChat,
  onDeleteChat,
}) => {
  const user = useSelector((store) => store.user);

  const [search, setSearch] = useState("");
  const [confirmId, setConfirmId] = useState(null);

  const name = user?.displayName || user?.email || "Guest";
  const initials = name.slice(0, 2).toUpperCase();

  const filteredChats = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return chats;

    return chats.filter(
      (chat) =>
        chat.title?.toLowerCase().includes(query) ||
        chat.messages?.some((message) =>
          message.text?.toLowerCase().includes(query)
        )
    );
  }, [chats, search]);

  const groupedChats = useMemo(() => {
    const today = new Date().setHours(0, 0, 0, 0);
    const day = 86400000;

    const groups = {
      Today: [],
      Yesterday: [],
      "Previous 7 days": [],
      Older: [],
    };

    filteredChats.forEach((chat) => {
      const timestamp =
        chat.updatedAt?.toMillis?.() ||
        chat.updatedAt?.seconds * 1000 ||
        chat.createdAt?.toMillis?.() ||
        0;

      const diff = today - timestamp;

      if (!timestamp || diff > 7 * day) {
        groups.Older.push(chat);
      } else if (diff > day) {
        groups.Yesterday.push(chat);
      } else if (diff > 0) {
        groups["Previous 7 days"].push(chat);
      } else {
        groups.Today.push(chat);
      }
    });

    return Object.entries(groups).filter(([, items]) => items.length);
  }, [filteredChats]);

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        
        <h1 className="text-xl font-bold text-white">
          Orvex<span className="text-cyan-400">-AI</span>
        </h1>
        
        <button onClick={onToggle} aria-label="Close sidebar">
          <PanelLeftClose size={19} />
        </button>
      </div>

      {/* Search */}
      <div className="px-3">
        <div className="flex items-center gap-2 rounded-lg bg-white/[0.05] px-3 py-2">
          <Search size={17} className="text-neutral-400" />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search chats..."
            className="w-full bg-transparent text-sm text-white outline-none"
          />

          {search && (
            <button onClick={() => setSearch("")} aria-label="Clear search">
              <X size={15} />
            </button>
          )}
        </div>
      </div>

      {/* New Chat */}
      <div className="p-3">
        <button
          onClick={onNewChat}
          className="flex w-full items-center gap-3 rounded-lg bg-cyan-400/10 px-3 py-2.5 text-sm font-medium text-cyan-300 transition hover:bg-cyan-400/20"
        >
          <SquarePen size={18} />
          New chat
        </button>
      </div>

      {/* History */}
      <nav className="min-h-0 flex-1 overflow-y-auto px-3 pb-3">
        {chats.length === 0 ? (
          <p className="mt-6 text-center text-sm text-neutral-500">
            No chats yet
          </p>
        ) : groupedChats.length === 0 ? (
          <p className="mt-6 text-center text-sm text-neutral-500">
            No matching chats
          </p>
        ) : (
          groupedChats.map(([label, items]) => (
            <section key={label} className="mb-4">
              <h2 className="mb-2 px-2 text-xs text-neutral-500">
                {label}
              </h2>

              {items.map((chat) => {
                const active = chat.id === activeId;
                const title = chat.title || "New chat";

                return (
                  <div key={chat.id} className="group relative">
                    <button
                      onClick={() => onSelectChat?.(chat)}
                      title={title}
                      className={`w-full truncate rounded-lg py-2 pl-3 pr-16 text-left text-sm transition ${
                        active
                          ? "bg-white/10 text-white"
                          : "text-neutral-400 hover:bg-white/[0.06] hover:text-white"
                      }`}
                    >
                      {title}
                    </button>

                    {confirmId === chat.id ? (
                      <div className="absolute right-1 top-1/2 flex -translate-y-1/2 gap-1">
                        <button
                          onClick={() => {
                            setConfirmId(null);
                            onDeleteChat?.(chat);
                          }}
                          aria-label="Confirm delete"
                          className="text-red-400"
                        >
                          <Check size={16} />
                        </button>

                        <button
                          onClick={() => setConfirmId(null)}
                          aria-label="Cancel delete"
                          className="text-neutral-400"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmId(chat.id)}
                        aria-label={`Delete ${title}`}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-500 opacity-0 transition hover:text-red-400 group-hover:opacity-100 focus:opacity-100"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                );
              })}
            </section>
          ))
        )}
      </nav>

      {/* Profile */}
      <div className="flex items-center gap-3 border-t border-white/10 p-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-400/15 text-sm font-semibold text-cyan-300">
          {initials}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm text-white">{name}</p>
          {user?.displayName && (
            <p className="truncate text-xs text-neutral-500">
              {user.email}
            </p>
          )}
        </div>

        <Logout />
      </div>
    </div>
  );
};

export default LeftPanel;
