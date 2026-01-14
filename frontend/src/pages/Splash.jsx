import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Leaf } from 'lucide-react';

const Splash = ({ onComplete }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onComplete();
        }, 5000); // Auto-skip after 5 seconds

        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <motion.div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-green-400 to-teal-600 text-white p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Skip Button */}
            <motion.button
                onClick={onComplete}
                className="absolute top-6 right-6 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-sm font-semibold hover:bg-white/30 transition-colors border border-white/30"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                Skip
            </motion.button>

            {/* Main Content */}
            <div className="text-center">
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                        duration: 1.5
                    }}
                    className="mb-6 inline-block"
                >
                    <Leaf className="w-24 h-24 text-white drop-shadow-lg" />
                </motion.div>

                <motion.h1
                    className="text-6xl font-extrabold mb-4 tracking-tight drop-shadow-md"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                >
                    EcoLoop
                </motion.h1>

                <motion.p
                    className="text-xl max-w-md mx-auto leading-relaxed text-green-50 font-medium"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                >
                    Gamifying environmental impact.
                    <br className="hidden sm:block" />
                    Learn, act, and earn rewards for saving the planet.
                </motion.p>
            </div>

            {/* Progress Bar (Optional visual cue for auto-skip) */}
            <motion.div
                className="absolute bottom-10 h-1 bg-white/30 rounded-full overflow-hidden w-64"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
            >
                <motion.div
                    className="h-full bg-white"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 5, ease: "linear" }}
                />
            </motion.div>
        </motion.div>
    );
};

export default Splash;
