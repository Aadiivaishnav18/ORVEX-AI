
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

const chatsCol = (uid) =>
  collection(db, "users", uid, "chats");

// Listen to logged-in user's chat history
export const subscribeChats = (uid, callback, onError) => {
  if (!uid) return () => {};

  const chatsQuery = query(
    chatsCol(uid),
    orderBy("updatedAt", "desc")
  );

  return onSnapshot(
    chatsQuery,
    (snapshot) => {
      callback(
        snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }))
      );
    },
    (error) => {
      console.error("Firestore chat history error:", error);
      onError?.(error);
    }
  );
};

// Generate unique chat ID
export const newChatId = (uid) => doc(chatsCol(uid)).id;

// Save or update chat
export const saveChat = async (
  uid,
  chatId,
  messages,
  title
) => {
  if (!uid || !chatId) {
    throw new Error("User ID and Chat ID are required");
  }

  const chatRef = doc(
    db,
    "users",
    uid,
    "chats",
    chatId
  );

  const data = {
    messages,
    updatedAt: serverTimestamp(),
  };

  if (title) {
    data.title = title;
    data.createdAt = serverTimestamp();
  }

  await setDoc(chatRef, data, { merge: true });
};

// Delete selected chat
export const deleteChat = async (uid, chatId) => {
  if (!uid || !chatId) return;

  await deleteDoc(
    doc(db, "users", uid, "chats", chatId)
  );
};
