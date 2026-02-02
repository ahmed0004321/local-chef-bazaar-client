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
        try {
          // Get fresh token
          const token = await currentUser.getIdToken();

          const res = await axios.post(
            "https://local-chef-bazaar-server-nine.vercel.app/users",
            currentUser
          );

          // Create a clean user object with all needed properties
          const userData = {
            uid: currentUser.uid,
            email: currentUser.email,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
            accessToken: token,
            data: res.data // Database profile (role, status, etc.)
          };

          setUser(userData);
        } catch (err) {
          console.error("Error fetching user data:", err);
          setUser(currentUser);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

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
