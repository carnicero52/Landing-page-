'use client'
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Inicio', href: '#hero' },
        { name: 'Beneficios', href: '#benefits' },
        { name: 'Soluciones', href: '#services' },
        { name: 'Historias', href: '#testimonials' },
        { name: 'Planes', href: '#pricing' },
        { name: 'Contacto', href: '#contacto' },
    ];

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 dark:bg-slate-950/80 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}>
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                <div className={`text-2xl font-bold ${isScrolled ? 'text-slate-950 dark:text-white' : 'text-white'}`}>
                    NexusCore Tech
                </div>
                
                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <a 
                            key={link.name} 
                            href={link.href}
                            className={`font-medium transition ${isScrolled ? 'text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400' : 'text-slate-200 hover:text-white'}`}
                        >
                            {link.name}
                        </a>
                    ))}
                    <ThemeToggle />
                </div>

                {/* Mobile Hamburger */}
                <div className="md:hidden flex items-center gap-4">
                  <ThemeToggle />
                  <button onClick={() => setIsMenuOpen(!isMenuOpen)} className={`${isScrolled ? 'text-slate-950 dark:text-white' : 'text-white'}`}>
                      {isMenuOpen ? <X /> : <Menu />}
                  </button>
                </div>
            </div>

            {/* Mobile Menu Panel */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800"
                    >
                        <div className="flex flex-col gap-4 p-6">
                            {navLinks.map((link) => (
                                <a 
                                    key={link.name} 
                                    href={link.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="text-lg font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400"
                                >
                                    {link.name}
                                </a>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
