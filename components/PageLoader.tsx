'use client'
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';

export default function PageLoader() {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        // Delay before starting the "hide" animation
        const timer = setTimeout(() => {
            setVisible(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    if (!visible) return null;

    return (
        <motion.div
            className="fixed top-0 left-0 h-1 bg-blue-600 z-[9999]"
            initial={{ width: "0%" }}
            animate={{ width: "100%", opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
        />
    );
}
