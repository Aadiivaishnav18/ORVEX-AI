
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useDispatch } from "react-redux";

import { auth } from "../utils/firebase";
import { addUser, removeUser } from "../utils/userSlice";

const AuthListener = ({ children }) => {
  const dispatch = useDispatch();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        if (user) {
          dispatch(
            addUser({
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL,
            })
          );
        } else {
          dispatch(removeUser());
        }

        setInitialized(true);
      },
      (error) => {
        console.error("Firebase auth error:", error);
        dispatch(removeUser());
        setInitialized(true);
      }
    );

    return unsubscribe;
  }, [dispatch]);

  if (!initialized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-cyan-400">
        Checking authentication...
      </div>
    );
  }

  return children;
};

export default AuthListener;
