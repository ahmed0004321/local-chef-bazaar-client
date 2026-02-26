import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";

const Error404 = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      {/* Animated 404 Text */}
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={styles.errorCode}
      >
        404
      </motion.h1>

      {/* Subtle Floating Animation for the Subtext */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <h2 style={styles.message}>Oops! Page Not Found</h2>
        <p style={styles.description}>
          The page you are looking for might have been removed or is temporarily
          unavailable.
        </p>
      </motion.div>

      {/* Back Button with Hover Effects */}
      <motion.button
        whileHover={{ scale: 1.05, backgroundColor: "#2563eb" }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate(-1)}
        style={styles.button}
      >
        Go Back Home
      </motion.button>
    </div>
  );
};

// Simple inline styles for a quick setup
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#f0f4f8",
    fontFamily: "system-ui, sans-serif",
    textAlign: "center",
    padding: "20px",
  },
  errorCode: {
    fontSize: "8rem",
    margin: 0,
    color: "#3b82f6", // Your requested blue
    fontWeight: "900",
    letterSpacing: "-2px",
  },
  message: {
    fontSize: "2rem",
    color: "#1e293b",
    marginBottom: "10px",
  },
  description: {
    color: "#64748b",
    maxWidth: "400px",
    marginBottom: "30px",
    lineHeight: "1.5",
  },
  button: {
    backgroundColor: "#3b82f6",
    color: "white",
    border: "none",
    padding: "12px 30px",
    fontSize: "1rem",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    boxShadow: "0 4px 6px -1px rgba(59, 130, 246, 0.5)",
    transition: "background-color 0.2s",
  },
};

export default Error404;
