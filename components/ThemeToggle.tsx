'use client'
import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle() {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsMounted(true);
        const storedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const darkMode = storedTheme === 'dark' || (!storedTheme && prefersDark);
        setIsDarkMode(darkMode);
        document.documentElement.classList.toggle('dark', darkMode);
    }, []);

    const toggleTheme = () => {
        const nextDark = !isDarkMode;
        setIsDarkMode(nextDark);
        localStorage.setItem('theme', nextDark ? 'dark' : 'light');
        document.documentElement.classList.toggle('dark', nextDark);
    };

    if (!isMounted) {
        return (
            <button 
                className="p-2 rounded-full transition-colors bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-yellow-400"
                aria-label="Loading theme toggle"
            >
                <Moon className="w-5 h-5" />
            </button>
        );
    }

    return (
        <button 
            onClick={toggleTheme}
            className="p-2 rounded-full transition-colors bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-yellow-400"
            aria-label="Toggle theme"
        >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
    );
}
