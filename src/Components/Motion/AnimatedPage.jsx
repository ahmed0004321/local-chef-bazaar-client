import { motion } from "framer-motion";

// Page transition variants
export const pageVariants = {
    initial: {
        opacity: 0,
        y: 20,
        scale: 0.98,
    },
    animate: {
        opacity: 1,
        y: 0,
        scale: 1,
    },
    exit: {
        opacity: 0,
        y: -20,
        scale: 0.98,
    },
};

export const pageTransition = {
    type: "spring",
    stiffness: 100,
    damping: 20,
    mass: 0.8,
};

// Stagger children animation
export const staggerContainer = {
    initial: {},
    animate: {
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.1,
        },
    },
};

export const staggerItem = {
    initial: { opacity: 0, y: 20 },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 15,
        },
    },
};

// Fade in animation
export const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 },
};

// Slide up animation
export const slideUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { type: "spring", stiffness: 100, damping: 15 },
};

// Scale animation for cards/buttons
export const scaleOnHover = {
    whileHover: { scale: 1.02, y: -2 },
    whileTap: { scale: 0.98 },
    transition: { type: "spring", stiffness: 400, damping: 17 },
};

// Button press animation
export const buttonTap = {
    whileHover: { scale: 1.03 },
    whileTap: { scale: 0.97 },
};

// Card hover effect
export const cardHover = {
    whileHover: {
        y: -8,
        boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.25)",
    },
    transition: { type: "spring", stiffness: 300, damping: 20 },
};

// Animated Page Wrapper Component
const AnimatedPage = ({ children, className = "" }) => {
    return (
        <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            transition={pageTransition}
            className={className}
        >
            {children}
        </motion.div>
    );
};

// Stagger Container Component
export const StaggerContainer = ({ children, className = "" }) => {
    return (
        <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className={className}
        >
            {children}
        </motion.div>
    );
};

// Stagger Item Component
export const StaggerItem = ({ children, className = "" }) => {
    return (
        <motion.div variants={staggerItem} className={className}>
            {children}
        </motion.div>
    );
};

// Motion Card Component
export const MotionCard = ({ children, className = "", ...props }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -6, boxShadow: "0 16px 32px -8px rgba(0, 0, 0, 0.2)" }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={className}
            {...props}
        >
            {children}
        </motion.div>
    );
};

// Motion Button Component
export const MotionButton = ({ children, className = "", ...props }) => {
    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className={className}
            {...props}
        >
            {children}
        </motion.button>
    );
};

export default AnimatedPage;
