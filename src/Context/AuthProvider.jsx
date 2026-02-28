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
  updatePassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../Firebase/firebase.config";
import axios from "axios";
const googleProvider = new GoogleAuthProvider();
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("auth-user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);
  // Google sign in
  const googleSignIn = () => {
    return signInWithPopup(auth, googleProvider);
  };

  // Register
  const createUser = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // Login
  const signInUser = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Update profile
  const updateUserProfile = async (name, photoURL) => {
    const img = {
      displayName: name,
      photoURL: photoURL,
    };
    await updateProfile(auth.currentUser, img);

    // Force reload to ensure Firebase internal state is updated
    await auth.currentUser.reload();
    const updatedUser = auth.currentUser;

    // Immediately update local state
    setUser(prev => ({
      ...prev,
      displayName: updatedUser.displayName,
      photoURL: updatedUser.photoURL,
      data: {
        ...prev?.data,
        displayName: updatedUser.displayName,
        photoURL: updatedUser.photoURL
      }
    }));
  };

  // Update password
  const updateUserPassword = (newPassword) => {
    return updatePassword(auth.currentUser, newPassword);
  };

  // Reset password
  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  // Logout
  const logOut = () => {
    localStorage.removeItem("auth-user");
    return signOut(auth);
  };

  // Persist user to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem("auth-user", JSON.stringify(user));
    } else {
      localStorage.removeItem("auth-user");
    }
  }, [user]);
  console.log(user);
  // Auth state observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Get fresh token
        const token = await currentUser.getIdToken();
        console.log(token);
        const basicUser = {
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL,
          accessToken: token,
        };

        // Use functional update to avoid stale closure issues with 'user' variable
        setUser(prev => {
          // If the user hasn't changed, we might want to preserve existing 'data'
          if (prev && prev.uid === currentUser.uid) {
            return {
              ...prev,
              ...basicUser,
              // Prioritize Firebase data for core fields if they are updated
              displayName: currentUser.displayName || prev.displayName,
              photoURL: currentUser.photoURL || prev.photoURL,
              data: {
                ...prev.data,
                displayName: currentUser.displayName || prev.data?.displayName,
                photoURL: currentUser.photoURL || prev.data?.photoURL,
              }
            };
          }
          return basicUser;
        });

        try {
          const res = await axios.post(
            `${import.meta.env.VITE_API_URL}/users`,
            {
              uid: currentUser.uid,
              email: currentUser.email,
              displayName: currentUser.displayName,
              photoURL: currentUser.photoURL,
            }
          );

          // Full sync with backend data
          setUser(prev => {
            if (!prev || prev.uid !== currentUser.uid) return prev;

            return {
              ...prev,
              data: res.data,
              // Merge backend data but keep fresh optimistic values if backend is old/null
              displayName: currentUser.displayName || res.data.displayName || prev.displayName,
              photoURL: currentUser.photoURL || res.data.photoURL || prev.photoURL,
            };
          });
        } catch (err) {
          console.error("Error fetching user data:", err);
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
    setUser,
    updateUserPassword,
    resetPassword
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
