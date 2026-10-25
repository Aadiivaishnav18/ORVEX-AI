
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useDispatch } from "react-redux";

import { auth } from "../utils/firebase";
import { addUser, removeUser } from "../utils/userSlice";

const AuthListener = ({ children }) => {
  const dispatch = useDispatch();
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
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

      setInitializing(false);
    });

    return unsubscribe;
  }, [dispatch]);

  if (initializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-cyan-400">
        Loading Orvex-AI...
      </div>
    );
  }

  return children;
};

export default AuthListener;
