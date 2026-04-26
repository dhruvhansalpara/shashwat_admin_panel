import { StatsCard } from '@/components/StatsCard';
import { Package, TrendingUp, ArrowRight, MapPin, MessageSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Package as PackageType, Inquiry } from '@/types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

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
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="space-y-1">
          <div className="flex items-center gap-4">
            <h2 className="text-4xl font-black tracking-tighter text-slate-800 uppercase font-display leading-none">Dashboard</h2>
            {dbStatus === 'connected' && (
              <Badge className="bg-emerald-500/10 text-emerald-600 border-none rounded-full px-4 text-[9px] font-black uppercase tracking-widest ring-1 ring-emerald-500/20">System Online</Badge>
            )}
          </div>
          <p className="text-slate-400 text-sm font-medium opacity-80 pl-1">Monitoring real-time agency performance metrics.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatsCard 
          title="Active Packages" 
          value={stats.totalPackages} 
          icon={Package}
          description="Live on website"
          variant="primary"
        />
        <StatsCard 
          title="Destinations" 
          value={stats.totalDestinations} 
          icon={MapPin}
          description="Managed regions"
          variant="secondary"
        />
        <StatsCard 
          title="Recent Inquiries" 
          value={stats.totalInquiries} 
          icon={MessageSquare}
          description="Awaiting response"
          trend={{ value: 18.2, isPositive: true }}
          variant="accent"
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
        <div className="xl:col-span-2 border border-slate-50 bg-white p-12 rounded-[32px] shadow-[0_8px_40px_rgba(0,0,0,0.02)] relative group border-2">
          <div className="flex justify-between items-start mb-12">
            <div className="space-y-1.5">
              <h3 className="text-3xl font-black text-slate-800 tracking-tighter uppercase font-display leading-none">Traffic Analysis</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] opacity-60">Inquiry volume trends over the last week.</p>
            </div>
            <div className="px-4 py-2 bg-[#e0f2f1] text-[#009688] rounded-xl text-[9px] font-black uppercase tracking-[0.2em] border border-[#009688]/10 shadow-sm animate-pulse">
              Live Sync
            </div>
          </div>
          <div className="h-[420px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#009688" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#009688" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="10 10" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 900 }} 
                  dy={20}
                  className="font-display uppercase tracking-widest"
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 900 }} 
                  className="font-display"
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none',
                    boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.1)',
                    padding: '16px 20px',
                    fontWeight: 700,
                    textTransform: 'none',
                    fontSize: '13px',
                    backgroundColor: 'white'
                  }}
                  itemStyle={{ color: '#009688', fontWeight: 900 }}
                  labelStyle={{ color: '#64748b', marginBottom: '4px', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}
                  cursor={{ stroke: '#009688', strokeWidth: 2, strokeDasharray: '6 6' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#009688" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[32px] shadow-[0_8px_40px_rgba(0,0,0,0.02)] border-2 border-slate-50 flex flex-col h-full">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-2xl font-black text-slate-800 tracking-tighter uppercase font-display leading-none">Top Tours</h3>
            <Link to="/admin/packages" className="text-[9px] font-black text-[#009688] hover:opacity-80 transition-all uppercase tracking-[0.2em] font-display">
              BROWSE ALL
            </Link>
          </div>
          <div className="space-y-6 flex-1">
             {topPackages.slice(0, 5).map((pkg) => (
               <div key={pkg.id} className="flex items-center gap-4 group cursor-pointer hover:translate-x-1 transition-all duration-300 border-b border-white hover:border-slate-50 pb-2">
                 <div className="relative w-12 h-12 rounded-full overflow-hidden shadow-sm">
                   <img src={pkg.image} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="" />
                 </div>
                 <div className="flex-1 min-w-0">
                   <p className="font-black text-slate-800 text-sm leading-tight tracking-tight truncate group-hover:text-[#009688] transition-colors">{pkg.name}</p>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                     {pkg.days} Days • <span className="text-[#E91E63] font-black">₹{pkg.price}</span>
                   </p>
                 </div>
                 <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[#009688]/10 group-hover:text-[#009688] transition-all">
                   <ArrowRight className="w-3.5 h-3.5" strokeWidth={3} />
                 </div>
               </div>
             ))}
             {topPackages.length === 0 && (
               <div className="flex flex-col items-center justify-center h-full text-slate-200">
                 <Package className="w-12 h-12 mb-4 opacity-10" />
                 <p className="text-[9px] font-black uppercase tracking-widest">No Active Packages</p>
               </div>
             )}
          </div>
        </div>

        <div className="xl:col-span-3 border border-slate-50 bg-white p-12 rounded-[32px] shadow-[0_8px_40px_rgba(0,0,0,0.02)] border-2">
           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-10">
             <div className="space-y-1.5">
               <h3 className="text-3xl font-black text-slate-800 tracking-tighter uppercase font-display leading-none">Recent Inquiries</h3>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] opacity-60">The latest customer leads from the portal.</p>
             </div>
             <Button variant="ghost" asChild className="rounded-xl border border-slate-100 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] h-11 px-8 hover:bg-slate-50 hover:text-[#009688] transition-all font-display">
               <Link to="/admin/inquiries">VIEW ANALYTICS</Link>
             </Button>
           </div>
           
           <div className="overflow-x-auto">
             <Table>
                <TableHeader>
                  <TableRow className="border-b border-slate-50 hover:bg-transparent">
                    <TableHead className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 font-display">Customer Details</TableHead>
                    <TableHead className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 font-display">Interest</TableHead>
                    <TableHead className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 font-display">Status</TableHead>
                    <TableHead className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 text-right font-display">Date Received</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentInquiries.map((inquiry) => (
                    <TableRow key={inquiry.id} className="border-b border-slate-50/50 hover:bg-slate-50/30 transition-all group">
                      <td className="px-6 py-6 font-display">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-xl bg-[#e0f2f1] flex items-center justify-center text-xs font-black text-[#009688] uppercase italic">
                             {inquiry.name.charAt(0)}
                           </div>
                           <div>
                             <p className="text-sm font-black text-slate-800">{inquiry.name}</p>
                             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{inquiry.email}</p>
                           </div>
                        </div>
                      </td>
                      <td className="px-6 py-6 font-display">
                        <Badge variant="secondary" className="bg-slate-50 text-slate-400 border-none text-[9px] font-black uppercase tracking-widest px-1">
                          {inquiry.packageId?.substring(0, 8) || 'GENERAL'}
                        </Badge>
                      </td>
                      <td className="px-6 py-6 font-display">
                         <div className="flex items-center gap-2.5">
                           <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                           <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-slate-800 transition-colors">Active</span>
                         </div>
                      </td>
                      <td className="px-6 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest font-display">
                        {format(new Date(inquiry.createdAt), 'MMM dd, yyyy')}
                      </td>
                    </TableRow>
                  ))}
                  {recentInquiries.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="h-64 text-center">
                         <div className="flex flex-col items-center justify-center gap-6">
                            <div className="w-24 h-24 rounded-[40px] bg-slate-50/50 flex items-center justify-center text-slate-100 group">
                              <MessageSquare className="w-10 h-10 group-hover:scale-110 transition-transform duration-500" strokeWidth={1} />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-200 font-display">No Intelligence Records</p>
                         </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
             </Table>
           </div>
        </div>
      </div>
    </div>
  );
}
