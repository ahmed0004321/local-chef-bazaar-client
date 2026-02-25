import { useTheme } from "../Context/ThemeProvider";
import { FaSun, FaMoon } from "react-icons/fa";

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-surface hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Toggle Theme"
        >
            {theme === "dark" ? (
                <FaSun className="text-yellow-400 text-xl" />
            ) : (
                <FaMoon className="text-blue-500 text-xl" />
            )}
        </button>
    );
};

export default ThemeToggle;
