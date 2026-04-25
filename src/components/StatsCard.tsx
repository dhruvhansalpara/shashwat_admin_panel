import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function StatsCard({ title, value, icon: Icon, description, trend, className }: StatsCardProps) {
  return (
    <Card className={cn("relative overflow-hidden border-none shadow-sm bg-card hover:shadow-md transition-all duration-300", className)}>
      <div className="absolute top-0 right-0 p-8 opacity-[0.03] scale-[3] pointer-events-none">
        <Icon className="w-12 h-12" />
      </div>
      <CardHeader className="flex flex-row items-center justify-between pb-2 pt-6 px-6">
        <CardTitle className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em]">
          {title}
        </CardTitle>
        <div className="w-8 h-8 flex items-center justify-center bg-primary/5 rounded-lg border border-primary/10">
          <Icon className="w-4 h-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent className="px-6 pb-6 pt-0">
        <div className="text-3xl font-display font-bold tabular-nums tracking-tight">{value}</div>
        {(description || trend) && (
          <div className="flex items-center gap-2 mt-2">
            {trend && (
              <div className={cn(
                "flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded",
                trend.isPositive ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600"
              )}>
                {trend.isPositive ? "↑" : "↓"} {trend.value}%
              </div>
            )}
            <p className="text-[11px] text-muted-foreground leading-none">
              {description}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
