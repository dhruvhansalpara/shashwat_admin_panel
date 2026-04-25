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
    <Card className={cn("overflow-hidden border-none shadow-sm transition-all hover:shadow-md", className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-4">
            <div className="p-2.5 bg-primary/10 rounded-xl w-fit">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground tracking-tight">{title}</p>
              <h3 className="text-3xl font-display font-bold tracking-tight mt-1">{value}</h3>
            </div>
          </div>
          {trend && (
            <div className={cn(
              "px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1",
              trend.isPositive ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
            )}>
              {trend.isPositive ? "+" : "-"}{trend.value}%
            </div>
          )}
        </div>
        <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between">
          <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
