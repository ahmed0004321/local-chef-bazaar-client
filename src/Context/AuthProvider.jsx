import React, { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import {
    createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { auth } from "../Firebase/firebase.config";
const googleProvider = new GoogleAuthProvider();
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const googleSignIn = () => {
    return signInWithPopup(auth, googleProvider);
  };
  //register
  const createUser = (email, password) => {
      setLoading(true);
      return createUserWithEmailAndPassword(auth, email, password);
  }
  const updateUserProfile = (profile) => {
    return updateProfile(auth.currentUser, profile);
}
  //observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const authInfo = {
    updateUserProfile,
    createUser,
    googleSignIn,
    user,
    loading
  };
  return <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
