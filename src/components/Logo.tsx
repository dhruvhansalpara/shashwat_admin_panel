import { cn } from '@/lib/utils';
import { motion } from 'motion/react';
import logoUrl from '@/assets/logo.png';

interface LogoProps {
  className?: string;
  showText?: boolean;
  variant?: 'light' | 'dark';
}

export function Logo({ className }: LogoProps) {
  return (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      className={cn("flex items-center cursor-pointer", className)}
    >
      <div className="relative h-14 md:h-16 lg:h-20 w-auto flex items-center justify-center">
         <img 
          src={logoUrl} 
          alt="Shashwat Holidays Logo" 
          className="h-full w-auto object-contain"
         />
      </div>
    </motion.div>
  );
}
