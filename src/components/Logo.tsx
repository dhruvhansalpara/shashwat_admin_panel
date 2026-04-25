import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  showText?: boolean;
  variant?: 'light' | 'dark';
}

export function Logo({ className, showText = true, variant = 'dark' }: LogoProps) {
  // Placeholder URL for the logo provided by the user
  // Please replace this with your actual logo file path (e.g., /logo.png)
  const logoUrl = "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2070&auto=format&fit=crop"; // Placeholder

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="relative w-12 h-12 overflow-hidden rounded-xl bg-white shadow-sm flex items-center justify-center">
         {/* Using an img tag for the logo */}
         <img 
          src="https://img.freepik.com/premium-vector/travel-logo-design-template-vector_18099-232.jpg" 
          alt="Shashwat Holidays Logo" 
          className="w-full h-full object-contain"
          referrerPolicy="no-referrer"
         />
      </div>
      {showText && (
        <div className="flex flex-col leading-tight">
          <span className={cn(
            "font-display font-bold text-xl tracking-tight italic",
            variant === 'light' ? "text-white" : "text-slate-800"
          )}>
            शाश्वत
          </span>
          <span className={cn(
            "text-[10px] font-bold uppercase tracking-[0.2em]",
            variant === 'light' ? "text-white/60" : "text-slate-500"
          )}>
            Holidays
          </span>
        </div>
      )}
    </div>
  );
}
