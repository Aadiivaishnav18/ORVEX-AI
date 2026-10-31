import {
  collection,
  doc,
  addDoc,
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
export const saveChat = async (uid, chatId, messages, title) => {
  if (!chatId) {
    const ref = await addDoc(chatsCol(uid), {
      title,
      messages,
      updatedAt: serverTimestamp(),
    });
    return ref.id;
  }

  await setDoc(
    doc(db, "users", uid, "chats", chatId),
    { messages, updatedAt: serverTimestamp() },
    { merge: true }
  );
  return chatId;
};

export const deleteChat = (uid, chatId) =>
  deleteDoc(doc(db, "users", uid, "chats", chatId));