import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  showText?: boolean;
  variant?: 'light' | 'dark';
}

export function Logo({ className, showText = true, variant = 'dark' }: LogoProps) {
  const logoUrl = "https://shashwatholidays.com/wp-content/uploads/2023/12/Shashwat-Logo-1.png";

  return (
    <div className={cn("flex items-center gap-4", className)}>
      <div className="relative w-14 h-14 flex items-center justify-center">
         <img 
          src={logoUrl} 
          alt="Shashwat Holidays Logo" 
          className="w-full h-full object-contain"
          referrerPolicy="no-referrer"
         />
      </div>
      {showText && (
        <div className="flex flex-col items-start leading-[0.8] pt-1">
          <span className={cn(
            "font-display font-black text-2xl tracking-tighter italic uppercase",
            variant === 'light' ? "text-white" : "text-slate-800"
          )}>
            शाश्वत
          </span>
          <span className={cn(
            "text-[10px] font-black uppercase tracking-[0.4em] mt-1.5",
            variant === 'light' ? "text-white/80" : "text-primary"
          )}>
            HOLIDAYS
          </span>
        </div>
      )}
    </div>
  );
}
