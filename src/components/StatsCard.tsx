import * as React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';

interface StatsCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  variant?: 'default' | 'primary' | 'secondary' | 'accent';
}

export function StatsCard({ title, value, description, icon: Icon, trend, className, variant = 'default' }: StatsCardProps) {
  const variantStyles = {
    default: "border-slate-50",
    primary: "border-slate-50",
    secondary: "border-slate-50",
    accent: "border-slate-50",
  };

  const iconStyles = {
    default: "bg-slate-50 text-slate-400",
    primary: "bg-[#e0f2f1] text-[#009688]",
    secondary: "bg-[#e0f2f1] text-[#009688]",
    accent: "bg-[#e0f2f1] text-[#009688]",
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        y: -12, 
        scale: 1.02,
        borderColor: "rgba(0, 150, 136, 0.2)",
        transition: { duration: 0.3, ease: "easeOut" } 
      }}
      className={cn(
        "relative border-2 bg-white p-8 rounded-[32px] transition-all duration-500 hover:shadow-[0_50px_100px_rgba(0,150,136,0.08)] group overflow-hidden", 
        variantStyles[variant],
        className
      )}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors duration-500" />
      
      <div className="flex items-start justify-between relative z-10 mb-10">
        <div className="space-y-4">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] font-display leading-none mb-1 group-hover:text-slate-500 transition-colors opacity-80">{title}</p>
          <h3 className="text-5xl font-black text-slate-900 tracking-tighter leading-none font-display">{value}</h3>
        </div>
        <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:rotate-6 shadow-sm group-hover:shadow-md", iconStyles[variant])}>
          <Icon className="w-6 h-6" strokeWidth={2.5} />
        </div>
      </div>
      
      <div className="flex items-center justify-between relative z-10">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.1em] font-display opacity-80">{description}</p>
        {trend && (
          <span className={cn(
            "text-[9px] font-black px-2.5 py-1 rounded-lg border-2 font-display flex items-center gap-1",
            trend.isPositive ? "bg-emerald-50 text-emerald-600 border-emerald-500/5 shadow-sm shadow-emerald-500/10" : "bg-rose-50 text-rose-600 border-rose-500/5 shadow-sm shadow-rose-500/10"
          )}>
            <span className="text-[8px]">{trend.isPositive ? "+" : "-"}</span>{trend.value}%
            <span className="text-[8px] opacity-40 font-bold ml-1">{trend.isPositive ? "Past 30 days" : "Decrease"}</span>
          </span>
        )}
      </div>
    </motion.div>
  );
}
