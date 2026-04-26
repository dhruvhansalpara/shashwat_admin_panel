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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <h2 className="text-5xl font-display font-black tracking-tight text-slate-900">Dashboard</h2>
            <div className={`px-4 py-1.5 rounded-full border flex items-center gap-2.5 text-[10px] font-bold uppercase tracking-widest ${
              dbStatus === 'connected' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
              dbStatus === 'loading' ? 'bg-slate-50 text-slate-400 border-slate-100' : 
              'bg-rose-50 text-rose-600 border-rose-100'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                dbStatus === 'connected' ? 'bg-emerald-500 animate-pulse' : 
                dbStatus === 'loading' ? 'bg-slate-300' : 
                'bg-rose-500'
              }`} />
              System: {dbStatus === 'connected' ? 'Operational' : dbStatus === 'loading' ? 'Syncing...' : 'Offline'}
            </div>
          </div>
          <p className="text-slate-500 text-lg font-medium">Monitoring your holiday business performance and inquiries.</p>
        </div>
        <div className="flex items-center gap-2 bg-white shadow-sm p-1.5 rounded-2xl border border-slate-100">
          <Button variant="ghost" size="sm" className="rounded-xl h-9 text-xs font-bold px-4">Weekly</Button>
          <Button variant="default" size="sm" className="rounded-xl h-9 shadow-md text-xs font-bold px-4">Monthly</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatsCard 
          title="Active Packages" 
          value={stats.totalPackages} 
          icon={Package}
          description="Live on website"
        />
        <StatsCard 
          title="Destinations" 
          value={stats.totalDestinations} 
          icon={MapPin}
          description="Managed regions"
        />
        <StatsCard 
          title="Recent Inquiries" 
          value={stats.totalInquiries} 
          icon={MessageSquare}
          description="Past 30 days"
          trend={{ value: 18.2, isPositive: true }}
        />
        <StatsCard 
          title="Conversion" 
          value="4.8%" 
          icon={TrendingUp}
          description="Inquiry to lead"
          trend={{ value: 0.5, isPositive: true }}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 border border-slate-200/60 bg-white p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover-card">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-2xl font-display font-bold text-slate-900">Traffic Analysis</h3>
              <p className="text-sm font-medium text-slate-500">Inquiry volume trends over the last week.</p>
            </div>
            <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">Live Sync</Badge>
          </div>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#26C2B9" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#26C2B9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }} 
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                    padding: '12px'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#26C2B9" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="border border-slate-200/60 bg-white p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover-card">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-display font-bold text-slate-900">Top Tours</h3>
            <Link to="/admin/packages">
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/5 font-bold uppercase tracking-widest text-[10px]">
                Browse All
              </Button>
            </Link>
          </div>
          <div className="space-y-6">
             {topPackages.map((pkg) => (
                <div key={pkg.id} className="flex items-center gap-4 group cursor-pointer p-2 rounded-2xl transition-all hover:bg-slate-50">
                  <div className="relative overflow-hidden rounded-2xl w-14 h-14">
                    <img src={pkg.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm text-slate-900 group-hover:text-primary transition-colors">{pkg.name}</p>
                    <p className="text-[11px] font-bold text-slate-400 mt-0.5">{pkg.duration} • <span className="text-secondary">₹{pkg.price}</span></p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
             ))}
          </div>
        </div>

        <div className="xl:col-span-3 border border-slate-200/60 bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover-card overflow-hidden">
           <div className="p-8 flex justify-between items-center border-b border-slate-50">
             <div>
               <h3 className="text-2xl font-display font-bold text-slate-900">Recent Inquiries</h3>
               <p className="text-sm font-medium text-slate-500">The latest customer leads from the portal.</p>
             </div>
             <Link to="/admin/inquiries">
               <Button variant="outline" className="rounded-xl font-bold uppercase tracking-widest text-[10px]">View Analytics</Button>
             </Link>
           </div>
           <div className="overflow-x-auto">
             <table className="w-full text-left text-sm">
               <thead className="bg-slate-50/50 text-slate-400 uppercase text-[10px] font-bold tracking-[0.2em]">
                 <tr>
                   <th className="px-8 py-5">Customer Details</th>
                   <th className="px-8 py-5">Interest</th>
                   <th className="px-8 py-5 text-center">Status</th>
                   <th className="px-8 py-5 text-right">Date Received</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                 {recentInquiries.map((inquiry) => (
                   <tr key={inquiry.id} className="hover:bg-slate-50/30 transition-colors">
                     <td className="px-8 py-5 font-bold text-slate-900">{inquiry.name}</td>
                     <td className="px-8 py-5 font-semibold text-slate-500">{inquiry.packageId || 'General Inquiry'}</td>
                     <td className="px-8 py-5 text-center">
                       <Badge className="bg-emerald-50 text-emerald-600 border-none shadow-none">New Lead</Badge>
                     </td>
                     <td className="px-8 py-5 text-right text-slate-400 font-bold">{format(new Date(inquiry.createdAt), 'MMM dd, HH:mm')}</td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </div>
      </div>
    </div>
  );
}
