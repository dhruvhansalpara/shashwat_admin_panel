import * as React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { MessageCircle, Menu, X, Package as PackageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Logo } from './Logo';

interface NavbarProps {
  whatsappNumber: string;
}

export function Navbar({ whatsappNumber }: NavbarProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Destinations', path: '/destinations' },
    { label: 'Car Rental', path: '/car-rental' },
  ];

  return (
    <nav className="fixed top-0 inset-x-0 bg-white/80 backdrop-blur-md z-50 border-b border-border/50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <Logo />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <NavLink 
              key={link.path}
              to={link.path}
              className={({ isActive }) => cn(
                "text-sm font-bold uppercase tracking-widest transition-colors relative py-1",
                isActive ? "text-primary after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {link.label}
            </NavLink>
          ))}
          <Button asChild className="rounded-full px-6 bg-emerald-500 hover:bg-emerald-600 font-bold gap-2">
            <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="w-4 h-4" /> WhatsApp
            </a>
          </Button>
        </div>

        {/* Mobile toggle */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 inset-x-0 bg-white border-b shadow-xl md:hidden"
          >
            <div className="flex flex-col p-6 gap-4">
              {navLinks.map(link => (
                <Link 
                  key={link.path} 
                  to={link.path} 
                  onClick={() => setIsOpen(false)}
                  className="font-bold uppercase tracking-widest text-sm text-foreground py-2"
                >
                  {link.label}
                </Link>
              ))}
              <Button asChild className="rounded-xl w-full h-12 bg-emerald-500 hover:bg-emerald-600 font-bold mt-2">
                <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-4 h-4" /> WhatsApp Us
                </a>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
