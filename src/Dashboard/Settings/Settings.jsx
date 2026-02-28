import React from "react";
import { FaCog } from "react-icons/fa";

const Settings = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-10 animate-in fade-in duration-700">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary text-4xl mb-6">
                <FaCog className="animate-spin-slow" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Settings Page</h1>
            <p className="text-foreground/50 mt-2 max-w-md">
                The settings functionality has been removed. This page serves as a placeholder for future configurations.
            </p>
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 8s linear infinite;
                }
            `}} />
        </div>
    );
};

export default Settings;
