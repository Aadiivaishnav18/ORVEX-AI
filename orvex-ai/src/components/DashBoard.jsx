import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  PanelLeftOpen,
  Plus,
  ArrowUp,
  Sparkles,
  Code2,
  Lightbulb,
  PenLine,
  GraduationCap,
} from "lucide-react";

import SideBar from "./Sidebar";
import { auth } from "../utils/firebase";
import { streamReply } from "../utils/gemini";
import Markdown from "./Markdown";
import {
  subscribeChats,
  saveChat,
  newChatId,
  deleteChat,
} from "../utils/chatStore";

const suggestions = [
  {
    icon: Code2,
    title: "Debug my code",
    prompt: "Help me debug this code and explain what went wrong.",
  },
  {
    icon: Lightbulb,
    title: "Brainstorm ideas",
    prompt: "Give me 5 creative project ideas I can build this weekend.",
  },
  {
    icon: PenLine,
    title: "Write something",
    prompt: "Help me write a clear, friendly email to my team.",
  },
  {
    icon: GraduationCap,
    title: "Explain a topic",
    prompt: "Explain how APIs work in simple words with an example.",
  },
];

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
};

const ModelAvatar = () => (
  <div
    aria-hidden="true"
    className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-300 to-cyan-600 text-black shadow-[0_0_18px_rgba(34,211,238,0.35)]"
  >
    <Sparkles size={16} />
  </div>
);

const TypingDots = () => (
  <span className="flex items-center gap-1.5 py-2" aria-label="Orvex-AI is typing">
    {[0, 150, 300].map((d) => (
      <span
        key={d}
        style={{ animationDelay: `${d}ms` }}
        className="h-2 w-2 rounded-full bg-cyan-400/70 motion-safe:animate-bounce"
      />
    ))}
  </span>
);

const DashBoard = () => {
  const user = useSelector((store) => store.user);
  const uid = user?.uid ?? auth.currentUser?.uid;
  const firstName = (user?.displayName || "").split(" ")[0];

  const [sidebarOpen, setSidebarOpen] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(min-width: 768px)").matches
  );
  const [chats, setChats] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  const isMobile = () => !window.matchMedia("(min-width: 768px)").matches;
  const toggleSidebar = () => setSidebarOpen((open) => !open);

  // Live chat history
  useEffect(() => {
    if (!uid) return undefined;
    return subscribeChats(uid, setChats);
  }, [uid]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  const newChat = () => {
    setActiveId(null);
    setMessages([]);
    setError("");
    if (isMobile()) setSidebarOpen(false);
  };

  const openChat = (chat) => {
    setActiveId(chat.id);
    setMessages(chat.messages || []);
    setError("");
    if (isMobile()) setSidebarOpen(false);
  };

  const removeChat = async (chat) => {
    try {
      await deleteChat(uid, chat.id);
      if (chat.id === activeId) newChat();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const send = async (raw) => {
    const text = raw.trim();
    if (!text || loading) return;
    if (!uid) {
      setError("You need to be signed in to chat. Please log in again.");
      return;
    }

    setInput("");
    setError("");
    setLoading(true);

    const before = messages;
    const userMsg = { role: "user", text };
    setMessages([...before, userMsg, { role: "model", text: "" }]);

    let reply = "";

    try {
      for await (const piece of streamReply(before, text)) {
        reply += piece;
        setMessages([...before, userMsg, { role: "model", text: reply }]);
      }

      if (!reply) throw new Error("Empty reply");
      setLoading(false);

      const finalMessages = [...before, userMsg, { role: "model", text: reply }];
      const id = activeId ?? newChatId(uid);
      if (!activeId) setActiveId(id);

      saveChat(uid, id, finalMessages, activeId ? undefined : text.slice(0, 40)).catch(
        (err) => {
          console.error("Saving chat failed:", err);
          setError(
            `Reply received, but it couldn’t be saved to your history (${
              err.code || err.message
            }).`
          );
        }
      );
    } catch (err) {
      console.error("Gemini error:", err);
      setMessages([...before, userMsg]);
      setError("Couldn’t get a reply. Check your API key and connection, then try again.");
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    send(input);
  };

  const empty = messages.length === 0;

  const inputBar = (
    <form
      onSubmit={handleSubmit}
      className="flex w-full items-center gap-2 rounded-3xl border border-white/10 bg-neutral-900/70 py-2 pl-3 pr-2 shadow-[0_8px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl transition focus-within:border-cyan-400/50 focus-within:shadow-[0_0_0_4px_rgba(34,211,238,0.08),0_8px_40px_rgba(0,0,0,0.5)]"
    >
      <button
        type="button"
        aria-label="Add attachment"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-neutral-400 transition hover:bg-white/[0.08] hover:text-white"
      >
        <Plus size={22} />
      </button>

      <input
        ref={inputRef}
        autoFocus
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask Orvex-AI anything"
        aria-label="Message"
        className="min-w-0 flex-1 bg-transparent py-2 text-base text-white outline-none placeholder:text-neutral-500"
      />

      <button
        type="submit"
        disabled={!input.trim() || loading}
        aria-label="Send message"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyan-400 text-black transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-neutral-500"
      >
        <ArrowUp size={20} />
      </button>
    </form>
  );

  const errorBox = error && (
    <p
      role="alert"
      className="mb-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm text-red-400"
    >
      {error}
    </p>
  );

  return (
    <div className="relative isolate flex h-dvh w-full overflow-hidden bg-black text-white">
      {sidebarOpen && (
        <div
          onClick={toggleSidebar}
          aria-hidden="true"
          className="fixed inset-0 z-30 bg-black/70 md:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        aria-label="Sidebar"
        aria-hidden={!sidebarOpen}
        className={`fixed inset-y-0 left-0 z-40 shrink-0 overflow-hidden border-r border-white/10 bg-black/50 backdrop-blur-2xl transition-all duration-300 md:static md:z-auto ${
          sidebarOpen
            ? "w-72 max-w-[85%] translate-x-0 md:max-w-none"
            : "invisible w-72 -translate-x-full md:w-0 md:translate-x-0 md:border-r-0"
        }`}
      >
        <div className="h-full w-72 max-w-full overflow-hidden">
          <SideBar
            chats={chats}
            activeId={activeId}
            onToggle={toggleSidebar}
            onNewChat={newChat}
            onSelectChat={openChat}
            onDeleteChat={removeChat}
          />
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="flex h-14 shrink-0 items-center justify-between px-3">
          <div className="flex items-center gap-2">
            {!sidebarOpen && (
              <>
                <button
                  type="button"
                  onClick={toggleSidebar}
                  aria-label="Open sidebar"
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-neutral-400 transition hover:bg-white/[0.07] hover:text-white"
                >
                  <PanelLeftOpen size={20} />
                </button>
                <span className="text-lg font-bold tracking-tight">
                  Orvex<span className="text-cyan-400">-AI</span>
                </span>
              </>
            )}
          </div>

        </header>

        {empty ? (
          /* ---------- Empty state ---------- */
          <div className="flex flex-1 flex-col items-center justify-center overflow-y-auto px-4 pb-16">
            <div className="w-full max-w-2xl">
              <h1 className="text-center text-4xl font-semibold tracking-tight sm:text-5xl">
                <span className="bg-gradient-to-r from-white to-cyan-300 bg-clip-text text-transparent">
                  {greeting()}
                  {firstName ? `, ${firstName}` : ""}
                </span>
              </h1>
              <p className="mb-8 mt-3 text-center text-lg text-neutral-400">
                What’s on your mind today?
              </p>

              {errorBox}
              {inputBar}

              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {suggestions.map(({ icon: Icon, title, prompt }) => (
                  <button
                    key={title}
                    type="button"
                    onClick={() => send(prompt)}
                    className="group flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-left transition hover:border-cyan-400/30 hover:bg-white/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-400"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300 transition group-hover:bg-cyan-400/20">
                      <Icon size={18} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-medium text-white">
                        {title}
                      </span>
                      <span className="mt-0.5 line-clamp-2 block text-sm text-neutral-500">
                        {prompt}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* ---------- Conversation ---------- */
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="flex-1 overflow-y-auto px-4 [scrollbar-color:rgba(255,255,255,0.15)_transparent] [scrollbar-width:thin]">
              <div className="mx-auto w-full max-w-3xl space-y-8 py-6">
                {messages.map((m, i) =>
                  m.role === "user" ? (
                    <div key={i} className="flex justify-end">
                      <p className="max-w-[85%] whitespace-pre-wrap break-words rounded-3xl rounded-br-lg border border-cyan-400/20 bg-cyan-400/10 px-4 py-2.5 text-[15px] leading-7 text-cyan-50">
                        {m.text}
                      </p>
                    </div>
                  ) : (
                    <div key={i} className="flex min-w-0 gap-3">
                      <ModelAvatar />
                      <div className="min-w-0 flex-1">
                        {m.text ? <Markdown>{m.text}</Markdown> : <TypingDots />}
                      </div>
                    </div>
                  )
                )}
                <div ref={bottomRef} />
              </div>
            </div>

            <div className="relative w-full shrink-0 px-4 pb-3 pt-2">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 -top-8 h-8 bg-gradient-to-t from-black/80 to-transparent"
              />
              <div className="mx-auto w-full max-w-3xl">
                {errorBox}
                {inputBar}
                <p className="mt-2 text-center text-xs text-neutral-600">
                  Orvex-AI can make mistakes. Check important info.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DashBoard;