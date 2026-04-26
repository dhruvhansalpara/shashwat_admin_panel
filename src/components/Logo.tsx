import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  showText?: boolean;
  variant?: 'light' | 'dark';
}

export function Logo({ className, showText = true, variant = 'dark' }: LogoProps) {
  // Official logo from the reference website
  const logoUrl = "https://lightpink-termite-256807.hostingersite.com/shashwat-logo-new.png"; 

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="relative w-12 h-12 overflow-hidden rounded-xl bg-white p-1 flex items-center justify-center">
         <img 
          src={logoUrl} 
          alt="Shashwat Holidays Logo" 
          className="w-full h-full object-contain"
          referrerPolicy="no-referrer"
         />
      </div>
      {showText && (
        <div className="flex flex-col leading-tight">
          <span className={cn(
            "font-display font-extrabold text-xl tracking-tight",
            variant === 'light' ? "text-white" : "text-slate-900"
          )}>
            शाश्वत
          </span>
          <span className={cn(
            "text-[10px] font-bold uppercase tracking-[0.25em] text-primary",
            variant === 'light' ? "text-primary-foreground/80" : ""
          )}>
            Holidays
          </span>
        </div>
      )}
    </div>
  );
}
