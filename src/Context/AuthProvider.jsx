import React, { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "../Firebase/firebase.config";
import axios from "axios";
const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // const [role, setRole] = useState("");
  // console.log(user?.data?.role);
  // Google sign in
  const googleSignIn = () => {
    return signInWithPopup(auth, googleProvider);
  };

  // Register
  const createUser = (email, password) => {
    setLoading(true)
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // Login
  const signInUser = (email, password) => {
    setLoading(true)
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Update profile
  const updateUserProfile = async (name, photoURL) => {
    const img = {
      displayName: name,
      photoURL: photoURL,
    };
    const res = await updateProfile(auth.currentUser, img);
    setUser(auth.currentUser);
    console.log(res, img);
  };

  // Logout
  const logOut = () => {
    return signOut(auth);
  };

  // Auth state observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        if (currentUser?.photoURL) {
          const user = await axios.post(
            "http://localhost:3000/users",
            currentUser
          );
          setUser(user);
          console.log(user);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth.currentUser]);

  const authInfo = {
    signInUser,
    logOut,
    updateUserProfile,
    createUser,
    googleSignIn,
    user,
    loading,
    setUser
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
