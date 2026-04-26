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
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 border border-slate-200 bg-white p-6 rounded-lg">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Inquiry Traffic</h3>
              <p className="text-sm text-slate-500">Daily volume of customer inquiries.</p>
            </div>
            <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">Real-time</span>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} fill="#dbeafe" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="border border-slate-200 bg-white p-6 rounded-lg">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800">Top Destinations</h3>
            <Link to="/admin/packages">
              <span className="text-sm font-semibold text-blue-600 hover:underline">View All</span>
            </Link>
          </div>
          <div className="space-y-4">
             {topPackages.map((pkg) => (
               <div key={pkg.id} className="flex items-center gap-4 border-b border-slate-100 pb-4 last:border-b-0 last:pb-0">
                 <img src={pkg.image} className="w-12 h-12 rounded object-cover" alt="" />
                 <div className="flex-1">
                   <p className="font-semibold text-sm text-slate-800">{pkg.name}</p>
                   <p className="text-xs text-slate-500">{pkg.days} Days • ${pkg.price}</p>
                 </div>
               </div>
             ))}
          </div>
        </div>

        <div className="xl:col-span-3 border border-slate-200 bg-white p-6 rounded-lg">
           <div className="flex justify-between items-center mb-6">
             <h3 className="text-lg font-bold text-slate-800">Recent Inquiries</h3>
             <Link to="/admin/inquiries">
               <span className="text-sm font-semibold text-blue-600 hover:underline">See All</span>
             </Link>
           </div>
           <div className="border border-slate-200 rounded-lg overflow-hidden">
             <table className="w-full text-left text-sm text-slate-600">
               <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-semibold">
                 <tr>
                   <th className="px-4 py-3">Customer</th>
                   <th className="px-4 py-3">Package</th>
                   <th className="px-4 py-3">Status</th>
                   <th className="px-4 py-3">Date</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {recentInquiries.map((inquiry) => (
                   <tr key={inquiry.id}>
                     <td className="px-4 py-3 font-medium text-slate-800">{inquiry.name}</td>
                     <td className="px-4 py-3">{inquiry.packageId || 'General'}</td>
                     <td className="px-4 py-3"><span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded">New</span></td>
                     <td className="px-4 py-3">{format(new Date(inquiry.createdAt), 'MMM dd, HH:mm')}</td>
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
