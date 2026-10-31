import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "./firebase";

const chatsCol = (uid) => collection(db, "users", uid, "chats");

export const subscribeChats = (uid, callback) =>
  onSnapshot(
    query(chatsCol(uid), orderBy("updatedAt", "desc")),
    (snap) => callback(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    (err) => console.error("Chat history error:", err)
  );
export const newChatId = (uid) => doc(chatsCol(uid)).id;

export const saveChat = (uid, chatId, messages, title) =>
  setDoc(
    doc(db, "users", uid, "chats", chatId),
    {
      ...(title ? { title } : {}),
      messages,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );

export const deleteChat = (uid, chatId) =>
  deleteDoc(doc(db, "users", uid, "chats", chatId));