import * as React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from 'lucide-react';

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
}

export function StatsCard({ title, value, description, icon: Icon, trend, className }: StatsCardProps) {
  return (
    <div className={cn(
      "relative overflow-hidden border border-slate-200/60 bg-white p-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover-card group",
      className
    )}>
      <div className="flex items-center justify-between">
        <div className="space-y-1.5 relative z-10">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">{title}</p>
          <h3 className="text-3xl font-display font-extrabold text-slate-900 leading-none">{value}</h3>
        </div>
        <div className="p-4 bg-primary/10 rounded-2xl group-hover:bg-primary group-hover:text-white transition-colors duration-300">
          <Icon className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
        </div>
      </div>
      <div className="mt-6 flex items-center gap-3 relative z-10">
        {trend && (
          <div className={cn(
            "flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold uppercase",
            trend.isPositive ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
          )}>
            {trend.isPositive ? "+" : "-"}{trend.value}%
          </div>
        )}
        <p className="text-[11px] text-slate-500 font-semibold">{description}</p>
      </div>
      {/* Subtle background flair */}
      <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
    </div>
  );
}
