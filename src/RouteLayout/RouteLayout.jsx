import React, { use } from 'react';
import Navbar from '../Components/Navbar/Navbar';
import { Outlet, useLocation } from 'react-router';
import { AnimatePresence, motion } from "framer-motion";
import Footer from '../Components/Footer/Footer';
import { AuthContext } from '../Context/AuthContext';

const RouteLayout = () => {
    const { user } = use(AuthContext);
    const location = useLocation();

    React.useEffect(() => {
        const titles = {
            '/': 'Local Chef Bazaar - Home',
            '/meals': 'Local Chef Bazaar - Meals',
            '/login': 'Local Chef Bazaar - Login',
            '/register': 'Local Chef Bazaar - Register',
        };
        const defaultTitle = 'Local Chef Bazaar';

        // Handle dynamic routes like /mealDetails/123
        if (location.pathname.startsWith('/mealDetails')) {
            document.title = 'Local Chef Bazaar - Meal Details';
        } else {
            document.title = titles[location.pathname] || defaultTitle;
        }

    }, [location]);

    return (
        <div className='min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300'>
            {/* Background Pattern */}
            <div className="fixed inset-0 z-[-1] h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] dark:bg-[radial-gradient(#ffffff10_1px,transparent_1px)] opacity-50 pointer-events-none"></div>

            <Navbar />

            {/* Main Content Area - pushed down by fixed navbar */}
            <main className='flex-1 w-full pt-16 lg:pt-20'>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 30, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.98 }}
                        transition={{
                            type: "spring",
                            stiffness: 100,
                            damping: 20,
                            mass: 0.8,
                        }}
                        className="w-full h-full"
                    >
                        <Outlet />
                    </motion.div>
                </AnimatePresence>
            </main>

            <Footer />
        </div>
    );
};

export default RouteLayout;