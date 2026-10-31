import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { PanelLeftOpen, Plus, ArrowUp } from "lucide-react";

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

const DashBoard = () => {
  const user = useSelector((store) => store.user);
  const uid = user?.uid ?? auth.currentUser?.uid;

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = input.trim();
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

  const inputBar = (
    <form
      onSubmit={handleSubmit}
      className="flex w-full items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] py-2 pl-3 pr-2 transition focus-within:border-cyan-400/50"
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
        placeholder="Ask Orvex-AI"
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
      className="mb-3 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400"
    >
      {error}
    </p>
  );

  return (
    <div className="relative isolate flex h-dvh w-full overflow-hidden bg-black text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -left-24 top-10 h-96 w-96 rounded-full bg-cyan-500/25 blur-[110px]" />
        <div className="absolute bottom-0 left-40 h-80 w-80 rounded-full bg-white/10 blur-[110px]" />
        <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-cyan-400/10 blur-[130px]" />
      </div>

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
        className={`fixed inset-y-0 left-0 z-40 shrink-0 overflow-hidden border-r border-white/20 bg-black/40 backdrop-blur-2xl transition-all duration-300 md:static md:z-auto ${
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

      {/* CHAT */}
      <main className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-14 shrink-0 items-center px-3">
          {!sidebarOpen && (
            <button
              type="button"
              onClick={toggleSidebar}
              aria-label="Open sidebar"
              className="flex h-10 w-10 items-center justify-center rounded-lg text-neutral-400 transition hover:bg-white/[0.07] hover:text-white"
            >
              <PanelLeftOpen size={20} />
            </button>
          )}
        </div>

        <div
          className={
            messages.length === 0
              ? "flex flex-1 flex-col items-center justify-center overflow-y-auto px-4 pb-20"
              : "flex min-h-0 flex-1 flex-col"
          }
        >
          {messages.length === 0 ? (
            <h1 key="heading" className="mb-8 text-center text-2xl font-medium sm:text-3xl">
              What’s on your mind today?
            </h1>
          ) : (
            <div key="messages" className="flex-1 overflow-y-auto px-4">
              <div className="mx-auto w-full max-w-3xl space-y-6 py-6">
                {messages.map((m, i) =>
                  m.role === "user" ? (
                    <div key={i} className="flex justify-end">
                      <p className="max-w-[85%] whitespace-pre-wrap break-words rounded-2xl bg-white/10 px-4 py-2.5 text-[15px] leading-7">
                        {m.text}
                      </p>
                    </div>
                  ) : (
                    <div key={i} className="min-w-0 max-w-full">
                      {m.text ? (
                        <Markdown>{m.text}</Markdown>
                      ) : (
                        <span className="text-neutral-500">Thinking…</span>
                      )}
                    </div>
                  )
                )}
                <div ref={bottomRef} />
              </div>
            </div>
          )}

          <div
            key="input"
            className={
              messages.length === 0
                ? "w-full max-w-3xl"
                : "w-full shrink-0 px-4 pb-4 pt-2"
            }
          >
            <div className="mx-auto w-full max-w-3xl">
              {errorBox}
              {inputBar}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashBoard;