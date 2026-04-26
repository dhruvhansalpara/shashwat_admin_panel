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
    <div className={cn("border bg-white border-slate-200 p-5 rounded-lg hover:border-slate-300 transition-colors", className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-semibold text-slate-800">{value}</h3>
        </div>
        <div className="p-2 bg-slate-100 rounded-md">
          <Icon className="w-5 h-5 text-slate-600" />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2">
        {trend && (
          <span className={cn(
            "text-[11px] font-bold px-1.5 py-0.5 rounded",
            trend.isPositive ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
          )}>
            {trend.isPositive ? "+" : "-"}{trend.value}%
          </span>
        )}
        <p className="text-[11px] text-slate-400 font-medium">{description}</p>
      </div>
    </div>
  );
}
