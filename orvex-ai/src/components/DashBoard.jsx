import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Plus, ArrowUp, Sparkles, Code2, Lightbulb, PenLine, GraduationCap, History, X, Trash2, MessageSquare } from "lucide-react";
import { auth } from "../utils/firebase";
import { streamReply } from "../utils/gemini";
import Markdown from "./Markdown";
import { subscribeChats, saveChat, newChatId, deleteChat } from "../utils/chatStore";

const suggestions = [
  { icon: Code2, title: "Debug my code", prompt: "Help me debug this code and explain what went wrong." },
  { icon: Lightbulb, title: "Brainstorm ideas", prompt: "Give me 5 creative project ideas I can build this weekend." },
  { icon: PenLine, title: "Write something", prompt: "Help me write a clear, friendly email to my team." },
  { icon: GraduationCap, title: "Explain a topic", prompt: "Explain how APIs work in simple words with an example." },
];

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
};

const ModelAvatar = () => (
  <div aria-hidden="true" className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-300 to-cyan-600 text-black shadow-[0_0_18px_rgba(34,211,238,0.35)]">
    <Sparkles size={16} />
  </div>
);

const TypingDots = () => (
  <span className="flex items-center gap-1.5 py-2" aria-label="Orvex-AI is typing">
    {[0, 150, 300].map((d) => <span key={d} style={{ animationDelay: `${d}ms` }} className="h-2 w-2 rounded-full bg-cyan-400/70 motion-safe:animate-bounce" />)}
  </span>
);

const formatDate = (value) => {
  if (!value) return "";
  const date = typeof value.toDate === "function" ? value.toDate()
    : value instanceof Date ? value
    : typeof value === "number" ? new Date(value)
    : value.seconds ? new Date(value.seconds * 1000) : null;
  return date ? date.toLocaleDateString(undefined, { month: "short", day: "numeric" }) : "";
};

const DashBoard = () => {
  const reduxUser = useSelector((store) => store.user);
  const [authUser, setAuthUser] = useState(auth.currentUser);
  useEffect(() => auth.onAuthStateChanged(setAuthUser), []);

  const uid = authUser?.uid || reduxUser?.uid || null;
  const firstName = (authUser?.displayName || reduxUser?.displayName || "").split(" ")[0];

  const [chats, setChats] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const activeIdRef = useRef(null);
  const messagesRef = useRef([]);

  useEffect(() => { activeIdRef.current = activeId; }, [activeId]);
  useEffect(() => { messagesRef.current = messages; }, [messages]);

  useEffect(() => {
    if (!uid) {
      setChats([]);
      setMessages([]);
      setActiveId(null);
      setHistoryLoading(false);
      return undefined;
    }

    setHistoryLoading(true);
    let firstSnapshot = true;
    const unsubscribe = subscribeChats(uid, (savedChats) => {
      setChats(savedChats);
      setHistoryLoading(false);
      if (firstSnapshot) {
        firstSnapshot = false;
        const latest = savedChats[0];
        setActiveId(latest?.id ?? null);
        activeIdRef.current = latest?.id ?? null;
        const restored = Array.isArray(latest?.messages) ? latest.messages : [];
        setMessages(restored);
        messagesRef.current = restored;
      }
    }, (err) => {
      console.error("Chat history load failed:", err);
      setHistoryLoading(false);
      setError(err.code === "permission-denied"
        ? "Firestore permission denied. Check your Firestore security rules."
        : "Could not load chat history. Check your internet connection.");
    });

    return () => unsubscribe();
  }, [uid]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  const newChat = () => {
    setActiveId(null);
    activeIdRef.current = null;
    setMessages([]);
    messagesRef.current = [];
    setError("");
    setHistoryOpen(false);
    inputRef.current?.focus();
  };

  const openChat = (chat) => {
    const restored = Array.isArray(chat.messages) ? chat.messages : [];
    setActiveId(chat.id);
    activeIdRef.current = chat.id;
    setMessages(restored);
    messagesRef.current = restored;
    setError("");
    setHistoryOpen(false);
  };

  const removeChat = async (chatId) => {
    if (!uid || !chatId) return;
    try {
      await deleteChat(uid, chatId);
      if (activeIdRef.current === chatId) newChat();
    } catch (err) {
      console.error("Delete chat failed:", err);
      setError("Could not delete this chat. Please try again.");
    }
  };

  const send = async (raw) => {
    const text = raw.trim();
    if (!text || loading) return;
    if (!uid) {
      setError("Please sign in before starting a chat.");
      return;
    }

    setInput("");
    setError("");
    setLoading(true);

    const previous = messagesRef.current;
    const userMessage = { role: "user", text };
    const chatId = activeIdRef.current || newChatId(uid);
    const updated = [...previous, userMessage];

    setActiveId(chatId);
    activeIdRef.current = chatId;
    messagesRef.current = updated;
    setMessages([...updated, { role: "model", text: "" }]);

    let reply = "";
    try {
      // Save the user's message before waiting for the AI response.
      await saveChat(uid, chatId, updated, previous.length === 0 ? text.slice(0, 60) : undefined);

      for await (const piece of streamReply(previous, text)) {
        reply += piece;
        setMessages([...updated, { role: "model", text: reply }]);
      }
      if (!reply.trim()) throw new Error("The AI returned an empty response.");

      const completed = [...updated, { role: "model", text: reply }];
      await saveChat(uid, chatId, completed);
      messagesRef.current = completed;
      setMessages(completed);
    } catch (err) {
      console.error("Chat request/save failed:", err);
      const visible = reply ? [...updated, { role: "model", text: reply }] : updated;
      messagesRef.current = visible;
      setMessages(visible);
      if (err.code === "unavailable" || err.code === "network-request-failed") {
        setError("Firestore/network connection failed. Your latest message may not have been saved. Check your connection.");
      } else {
        setError(`Could not complete or save this chat: ${err.message || "Unknown error"}`);
      }
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    send(input);
  };

  const inputBar = (
    <form onSubmit={handleSubmit} className="flex w-full items-center gap-2 rounded-3xl border border-white/10 bg-neutral-900/70 py-2 pl-3 pr-2 shadow-[0_8px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl transition focus-within:border-cyan-400/50">
      <input ref={inputRef} type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask Orvex-AI anything" aria-label="Message" className="min-w-0 flex-1 bg-transparent py-2 text-base text-white outline-none placeholder:text-neutral-500" />
      <button type="submit" disabled={!input.trim() || loading} aria-label="Send message" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyan-400 text-black transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-neutral-500">
        <ArrowUp size={20} />
      </button>
    </form>
  );

  const errorBox = error ? <p role="alert" className="mb-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm text-red-400">{error}</p> : null;
  const empty = messages.length === 0;

  return (
    <div className="relative isolate flex h-dvh w-full overflow-hidden bg-black text-white">
      <main className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-white/10 px-4">
          <span className="text-lg font-bold tracking-tight">Orvex<span className="text-cyan-400">-AI</span></span>
          <div className="flex items-center gap-2">
            <button type="button" onClick={newChat} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-neutral-300 transition hover:bg-white/[0.07] hover:text-white"><Plus size={17} /><span className="hidden sm:inline">New chat</span></button>
            <button type="button" onClick={() => setHistoryOpen(true)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-neutral-300 transition hover:bg-white/[0.07] hover:text-white"><History size={17} /><span className="hidden sm:inline">History</span></button>
          </div>
        </header>

        {empty ? (
          <div className="flex flex-1 flex-col items-center justify-center overflow-y-auto px-4 pb-16">
            <div className="w-full max-w-2xl">
              <h1 className="text-center text-4xl font-semibold tracking-tight sm:text-5xl"><span className="bg-gradient-to-r from-white to-cyan-300 bg-clip-text text-transparent">{greeting()}{firstName ? `, ${firstName}` : ""}</span></h1>
              <p className="mb-8 mt-3 text-center text-lg text-neutral-400">What’s on your mind today?</p>
              {errorBox}
              {inputBar}
              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {suggestions.map(({ icon: Icon, title, prompt }) => (
                  <button key={title} type="button" onClick={() => send(prompt)} className="group flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-left transition hover:border-cyan-400/30 hover:bg-white/[0.06]">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300"><Icon size={18} /></span>
                    <span className="min-w-0"><span className="block text-sm font-medium text-white">{title}</span><span className="mt-0.5 line-clamp-2 block text-sm text-neutral-500">{prompt}</span></span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="flex-1 overflow-y-auto px-4 [scrollbar-color:rgba(255,255,255,0.15)_transparent] [scrollbar-width:thin]">
              <div className="mx-auto w-full max-w-3xl space-y-8 py-6">
                {messages.map((m, i) => m.role === "user" ? (
                  <div key={`${i}-user`} className="flex justify-end"><p className="max-w-[85%] whitespace-pre-wrap break-words rounded-3xl rounded-br-lg border border-cyan-400/20 bg-cyan-400/10 px-4 py-2.5 text-[15px] leading-7 text-cyan-50">{m.text}</p></div>
                ) : (
                  <div key={`${i}-model`} className="flex min-w-0 gap-3"><ModelAvatar /><div className="min-w-0 flex-1">{m.text ? <Markdown>{m.text}</Markdown> : <TypingDots />}</div></div>
                ))}
                <div ref={bottomRef} />
              </div>
            </div>
            <div className="relative w-full shrink-0 px-4 pb-3 pt-2"><div className="mx-auto w-full max-w-3xl">{errorBox}{inputBar}<p className="mt-2 text-center text-xs text-neutral-600">Orvex-AI can make mistakes. Check important info.</p></div></div>
          </div>
        )}
      </main>

      {historyOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/70">
          <button type="button" aria-label="Close chat history" onClick={() => setHistoryOpen(false)} className="absolute inset-0 cursor-default" />
          <section className="relative z-10 flex h-full w-full max-w-sm flex-col border-l border-white/10 bg-neutral-950 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
              <div><h2 className="font-semibold text-white">Chat history</h2><p className="text-xs text-neutral-500">Saved to your account</p></div>
              <button type="button" onClick={() => setHistoryOpen(false)} aria-label="Close history" className="rounded-lg p-2 text-neutral-400 hover:bg-white/10 hover:text-white"><X size={18} /></button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto p-3">
              {!uid ? <p className="px-3 py-6 text-center text-sm text-neutral-400">Sign in to view your saved chats.</p>
                : historyLoading ? <p className="px-3 py-6 text-center text-sm text-neutral-400">Loading history…</p>
                : chats.length === 0 ? <div className="flex flex-col items-center gap-2 px-4 py-10 text-center"><MessageSquare size={24} className="text-neutral-600" /><p className="text-sm text-neutral-300">No saved chats yet</p></div>
                : <ul className="space-y-1">{chats.map((chat) => (
                  <li key={chat.id} className={`flex items-center gap-2 rounded-lg ${chat.id === activeId ? "bg-white/10" : "hover:bg-white/[0.06]"}`}>
                    <button type="button" onClick={() => openChat(chat)} className="min-w-0 flex-1 px-3 py-3 text-left"><span className="block truncate text-sm text-white">{chat.title || chat.messages?.[0]?.text || "New chat"}</span><span className="mt-1 block text-xs text-neutral-500">{formatDate(chat.updatedAt)}</span></button>
                    <button type="button" onClick={() => removeChat(chat.id)} aria-label="Delete chat" className="mr-2 rounded-md p-2 text-neutral-500 hover:bg-red-500/10 hover:text-red-400"><Trash2 size={15} /></button>
                  </li>
                ))}</ul>}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default DashBoard;
