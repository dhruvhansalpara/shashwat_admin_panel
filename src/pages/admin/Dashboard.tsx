import { StatsCard } from '@/components/StatsCard';
import { Package, Image as ImageIcon, MessageSquare, TrendingUp, Calendar, ArrowRight, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Package as PackageType, Inquiry } from '@/types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const chartData = [
  { name: 'Mon', value: 4 },
  { name: 'Tue', value: 7 },
  { name: 'Wed', value: 5 },
  { name: 'Thu', value: 9 },
  { name: 'Fri', value: 12 },
  { name: 'Sat', value: 8 },
  { name: 'Sun', value: 6 },
];

interface DashboardProps {
  stats: {
    totalPackages: number;
    totalBanners: number;
    totalInquiries: number;
    totalDestinations: number;
  };
  recentInquiries: Inquiry[];
  topPackages: PackageType[];
}

export function Dashboard({ stats, recentInquiries, topPackages }: DashboardProps) {
  const [dbStatus, setDbStatus] = useState<'connected' | 'disconnected' | 'loading'>('loading');

  useEffect(() => {
    const checkDb = async () => {
      try {
        const res = await fetch('/api/packages');
        if (res.ok) setDbStatus('connected');
        else setDbStatus('disconnected');
      } catch (e) {
        setDbStatus('disconnected');
      }
    };
    checkDb();
  }, []);

  return (
    <div className="space-y-10 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-4xl font-display font-bold tracking-tight text-foreground">Dashboard</h2>
            <div className={`px-3 py-1 rounded-full border flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider ${
              dbStatus === 'connected' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
              dbStatus === 'loading' ? 'bg-slate-50 text-slate-400 border-slate-100' : 
              'bg-red-50 text-red-600 border-red-100'
            }`}>
              <div className={`w-1.5 h-1.5 rounded-full ${
                dbStatus === 'connected' ? 'bg-emerald-500 animate-pulse' : 
                dbStatus === 'loading' ? 'bg-slate-300' : 
                'bg-red-500'
              }`} />
              Database: {dbStatus === 'connected' ? 'Active' : dbStatus === 'loading' ? 'Checking...' : 'Disconnected'}
            </div>
          </div>
          <p className="text-muted-foreground text-lg font-light">Welcome back, Admin. Your business performance at a glance.</p>
        </div>
        <div className="flex items-center gap-2 bg-muted/50 p-1.5 rounded-xl border border-border/50">
          <Button variant="ghost" size="sm" className="rounded-lg h-8 text-xs font-medium">Last 7 Days</Button>
          <Button variant="secondary" size="sm" className="rounded-lg h-8 shadow-sm text-xs font-medium">Last 30 Days</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Tour Packages" 
          value={stats.totalPackages} 
          icon={Package}
          description="Live tour offers"
        />
        <StatsCard 
          title="Destinations" 
          value={stats.totalDestinations} 
          icon={MapPin}
          description="Managed locations"
        />
        <StatsCard 
          title="New Inquiries" 
          value={stats.totalInquiries} 
          icon={MessageSquare}
          description="Customer leads"
          trend={{ value: 12.5, isPositive: true }}
        />
        <StatsCard 
          title="Growth" 
          value="+24%" 
          icon={TrendingUp}
          description="vs last period"
          trend={{ value: 4.2, isPositive: true }}
          className="bg-primary/5 border-primary/10"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <Card className="xl:col-span-2 border-none shadow-sm overflow-hidden bg-card">
          <CardHeader className="px-8 pt-8">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl font-display font-bold">Inquiry Traffic</CardTitle>
                <CardDescription>Daily volume of customer inquiries across the platform.</CardDescription>
              </div>
              <Badge variant="outline" className="font-mono text-[10px] tracking-widest text-primary border-primary/20 bg-primary/5 uppercase">Real-time Data</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0 pt-6">
            <div className="h-[350px] w-full pr-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(0.9 0.05 250 / 0.1)" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 11, fill: 'oklch(0.5 0.05 250)' }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 11, fill: 'oklch(0.5 0.05 250)' }} 
                  />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '12px', 
                      border: 'none', 
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                      fontSize: '12px'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="var(--color-primary)" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorValue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-card">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl font-display font-bold">Top Destinations</CardTitle>
                <CardDescription>Most viewed tour packages.</CardDescription>
              </div>
              <Link to="/admin/packages">
                <Button size="icon" variant="ghost" className="rounded-full h-8 w-8">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
             <div className="space-y-4">
               {topPackages.map((pkg) => (
                 <div key={pkg.id} className="flex items-center gap-4 group cursor-pointer transition-colors hover:bg-muted/30 p-2 rounded-xl -mx-2">
                   <div className="relative overflow-hidden w-14 h-14 rounded-xl border border-border/50">
                     <img src={pkg.image} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="" />
                   </div>
                   <div className="flex-1 min-w-0">
                     <p className="font-bold text-sm truncate">{pkg.name}</p>
                     <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1 font-bold">{pkg.days} Days • ${pkg.price}</p>
                   </div>
                   <div className="text-xs font-mono font-bold text-primary">#{Math.floor(Math.random() * 50) + 10}</div>
                 </div>
               ))}
               {topPackages.length === 0 && (
                 <div className="text-center py-12">
                   <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 opacity-50">
                     <Calendar className="w-6 h-6" />
                   </div>
                   <p className="text-muted-foreground text-sm">No destination data yet.</p>
                 </div>
               )}
             </div>
             <Button variant="outline" className="w-full rounded-xl gap-2 font-bold text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground h-11" asChild>
               <Link to="/admin/packages">View All Packages</Link>
             </Button>
          </CardContent>
        </Card>

        <Card className="xl:col-span-3 border-none shadow-sm bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-6">
            <div>
              <CardTitle className="text-xl font-display font-bold">Recent Inquiries</CardTitle>
              <CardDescription>Direct leads from the public tour catalog.</CardDescription>
            </div>
            <Link to="/admin/inquiries">
              <Button variant="secondary" size="sm" className="rounded-xl h-9 px-4 font-bold text-xs uppercase tracking-widest">See All</Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="border-t">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow className="border-none hover:bg-transparent">
                    <TableHead className="pl-8 text-[10px] font-bold uppercase tracking-widest">Customer Profile</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest">Interested Package</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest">Contact Priority</TableHead>
                    <TableHead className="text-right pr-8 text-[10px] font-bold uppercase tracking-widest">Received Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentInquiries.length > 0 ? recentInquiries.map((inquiry) => (
                    <TableRow key={inquiry.id} className="group border-none hover:bg-muted/30 transition-colors">
                      <TableCell className="pl-8 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xs uppercase">
                            {inquiry.name.substring(0, 2)}
                          </div>
                          <div>
                            <div className="font-bold text-sm tracking-tight">{inquiry.name}</div>
                            <div className="text-[11px] text-muted-foreground tabular-nums">{inquiry.phone}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="rounded-md px-2 py-0.5 font-bold text-[10px] uppercase tracking-wide bg-primary/5 text-primary border-primary/10">
                          {inquiry.packageId || "General Inquiry"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                         <div className="flex items-center gap-1.5">
                           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                           <span className="text-[11px] font-bold uppercase tracking-wide text-foreground/70">New Lead</span>
                         </div>
                      </TableCell>
                      <TableCell className="text-right pr-8 text-xs font-mono text-muted-foreground/70 tracking-tighter">
                        {format(new Date(inquiry.createdAt), 'MMM dd, HH:mm')}
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-20">
                        <div className="max-w-[200px] mx-auto opacity-50 grayscale">
                          <MessageSquare className="w-12 h-12 mx-auto mb-4" />
                          <p className="text-xs font-bold uppercase tracking-widest">Quiet in the lobby</p>
                          <p className="text-[10px] mt-1 font-medium">No recent leads to display.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
