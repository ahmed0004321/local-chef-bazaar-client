import { motion } from "framer-motion";
import Container from "./Container";

export const SuspenseLoader = () => {
    return (
        <Container className="min-h-screen flex flex-col items-center justify-center bg-base-100">
            <motion.div
                className="relative w-24 h-24 mb-6"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
                <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
                <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent" />
            </motion.div>
            <motion.h2
                className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
                Loading...
            </motion.h2>
            <p className="text-base-content/60 mt-2 font-medium">Getting things ready for you</p>
        </Container>
    );
};
