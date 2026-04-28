'use client';
import { Share2, Mail, Twitter, Facebook, Linkedin } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

export default function SocialShare() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className="py-10 text-center min-h-[150px]" />;
  }

  const url = window.location.href;
  const title = "NexusCore Tech - Transformando negocios";

  const shareLinks = [
    { name: 'Twitter', icon: <Twitter size={20} />, url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}` },
    { name: 'Facebook', icon: <Facebook size={20} />, url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` },
    { name: 'LinkedIn', icon: <Linkedin size={20} />, url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}` },
    { name: 'Email', icon: <Mail size={20} />, url: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}` },
  ];

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    }
  };

  return (
    <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="py-10 text-center"
    >
      <h3 className="text-xl font-bold mb-6">¿Te gusta nuestro trabajo? ¡Compártelo!</h3>
      <div className="flex justify-center gap-4">
        {shareLinks.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-slate-100 rounded-full hover:bg-slate-200 transition dark:bg-slate-800 dark:hover:bg-slate-700"
          >
            {link.icon}
          </a>
        ))}
        {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
          <button
            onClick={handleShare}
            className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
          >
            <Share2 size={20} />
          </button>
        )}
      </div>
    </motion.div>
  );
}
