
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useDispatch } from "react-redux";

import { auth } from "../utils/firebase";
import { addUser, removeUser } from "../utils/userSlice";

const AuthListener = ({ children }) => {
  const dispatch = useDispatch();

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
    });

    return unsubscribe;
  }, [dispatch]);
  
  return children;
};

export default AuthListener;
