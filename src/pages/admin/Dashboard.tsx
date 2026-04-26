import { StatsCard } from '@/components/StatsCard';
import { Package, TrendingUp, ArrowRight, MapPin, MessageSquare, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Package as PackageType, Inquiry } from '@/types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { motion } from 'motion/react';

const chartData = [
  { name: 'Mon', value: 4 },
  { name: 'Tue', value: 7 },
  { name: 'Wed', value: 5 },
  { name: 'Thu', value: 9 },
  { name: 'Fri', value: 12 },
  { name: 'Sat', value: 8 },
  { name: 'Sun', value: 6 },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

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
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-12 pb-20"
    >
      <motion.div variants={item} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="space-y-3">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-[#009688]/10 rounded-[20px] text-[#009688] shadow-[0_4px_20px_rgba(0,150,136,0.1)]">
              <Sparkles className="w-7 h-7 animate-pulse" strokeWidth={2.5} />
            </div>
            <div className="space-y-0.5">
               <h2 className="text-5xl font-black tracking-tight text-slate-800 uppercase font-display leading-none italic">Admin Dashboard</h2>
               <div className="flex items-center gap-3">
                 <p className="text-[#009688] text-[10px] font-black uppercase tracking-[0.3em] opacity-100 pl-0.5">Shashwat Holidays Overview</p>
                 {dbStatus === 'connected' && (
                   <span className="flex items-center gap-1.5 px-3 py-0.5 bg-emerald-500/10 text-emerald-600 rounded-full text-[8px] font-black uppercase tracking-tighter ring-1 ring-emerald-500/20 shadow-[0_2px_10px_rgba(16,185,129,0.1)]">
                     <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                     ONLINE
                   </span>
                 )}
               </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 bg-white p-6 rounded-[32px] border-2 border-slate-50 shadow-sm">
           <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none">Last Synchronization</p>
           <div className="text-xl font-black text-[#009688] font-display italic leading-none">
             {format(new Date(), 'HH:mm:ss')} <span className="text-[10px] text-slate-400 not-italic ml-1">GMT</span>
           </div>
        </div>
      </motion.div>

      <motion.div variants={container} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <motion.div variants={item} className="xl:col-span-2 border-2 border-slate-50 bg-white p-12 rounded-[48px] shadow-[0_24px_80px_rgba(0,0,0,0.03)] relative group overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.03] overflow-hidden">
             <div className="absolute inset-0 bg-[radial-gradient(circle,#009688_1px,transparent_1px)] bg-[size:32px_32px]" />
          </div>
          <div className="flex justify-between items-start mb-16 relative z-10">
            <div className="space-y-2">
              <h3 className="text-4xl font-black text-slate-800 tracking-tighter uppercase font-display leading-none italic">Inquiry Trends</h3>
              <p className="text-[10px] font-black text-[#009688] uppercase tracking-[0.4em] opacity-80 pl-0.5">Daily inquiry activity and guest reach</p>
            </div>
            <div className="px-6 py-3 bg-[#e0f2f1] text-[#009688] rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border-2 border-[#009688]/10 shadow-[0_4px_20px_rgba(0,150,136,0.1)] flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#009688] animate-ping" />
               LIVE STREAMING
            </div>
          </div>
          <div className="h-[460px] w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#009688" stopOpacity={0.2}/>
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
                    borderRadius: '24px', 
                    border: 'none',
                    boxShadow: '0 40px 80px -12px rgb(0 150 136 / 0.15)',
                    padding: '20px 24px',
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
                  strokeWidth={5} 
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div variants={item} className="bg-white p-10 rounded-[40px] shadow-[0_8px_40px_rgba(0,0,0,0.02)] border-2 border-slate-50 flex flex-col h-full relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16" />
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-black text-slate-800 tracking-tighter uppercase font-display leading-none">Top Tours</h3>
              <Link to="/admin/packages" className="text-[9px] font-black text-[#009688] hover:opacity-80 transition-all uppercase tracking-[0.2em] font-display">
                BROWSE ALL
              </Link>
            </div>
            <div className="space-y-6 flex-1">
               {topPackages.slice(0, 5).map((pkg, idx) => (
                 <motion.div 
                   key={pkg.id} 
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: 0.5 + (idx * 0.1) }}
                   className="flex items-center gap-4 group/item cursor-pointer hover:translate-x-1 transition-all duration-300 border-b border-white hover:border-slate-50 pb-2"
                 >
                   <div className="relative w-12 h-12 rounded-2xl overflow-hidden shadow-sm">
                     <img src={pkg.image} className="w-full h-full object-cover transition-transform group-hover/item:scale-110" alt="" />
                   </div>
                   <div className="flex-1 min-w-0">
                     <p className="font-black text-slate-800 text-sm leading-tight tracking-tight truncate group-hover/item:text-[#009688] transition-colors">{pkg.name}</p>
                     <div className="flex items-center gap-2 mt-0.5">
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{pkg.days} Days</span>
                       <span className="w-1 h-1 rounded-full bg-slate-200" />
                       <span className="text-[#E91E63] font-black text-[10px] uppercase tracking-widest">₹{pkg.price}</span>
                     </div>
                   </div>
                   <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover/item:bg-[#009688]/10 group-hover/item:text-[#009688] transition-all">
                     <ArrowRight className="w-3.5 h-3.5" strokeWidth={3} />
                   </div>
                 </motion.div>
               ))}
               {topPackages.length === 0 && (
                 <div className="flex flex-col items-center justify-center h-full text-slate-200">
                   <Package className="w-12 h-12 mb-4 opacity-10" />
                   <p className="text-[9px] font-black uppercase tracking-widest">No Active Packages</p>
                 </div>
               )}
            </div>
          </div>
        </motion.div>

        <motion.div variants={item} className="xl:col-span-3 border border-slate-50 bg-white p-12 rounded-[40px] shadow-[0_8px_40px_rgba(0,0,0,0.02)] border-2">
           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-10">
             <div className="space-y-1.5">
               <h3 className="text-3xl font-black text-slate-800 tracking-tighter uppercase font-display leading-none">Recent Inquiries</h3>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] opacity-60">The latest customer leads from the portal.</p>
             </div>
             <Button variant="ghost" asChild className="rounded-2xl border border-slate-100 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] h-12 px-8 hover:bg-slate-50 hover:text-[#009688] transition-all font-display hover:shadow-sm">
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
                  {recentInquiries.map((inquiry, idx) => (
                    <motion.tr 
                      key={inquiry.id} 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + (idx * 0.05) }}
                      className="border-b border-slate-50/50 hover:bg-slate-50/30 transition-all group/row"
                    >
                      <td className="px-6 py-6 font-display">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 rounded-2xl bg-[#e0f2f1] flex items-center justify-center text-sm font-black text-[#009688] uppercase italic shadow-sm group-hover/row:scale-105 transition-transform">
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
                           <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover/row:text-emerald-600 transition-colors">Active</span>
                         </div>
                      </td>
                      <td className="px-6 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest font-display">
                        {format(new Date(inquiry.createdAt), 'MMM dd, yyyy')}
                      </td>
                    </motion.tr>
                  ))}
                  {recentInquiries.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="h-64 text-center">
                         <div className="flex flex-col items-center justify-center gap-6">
                            <div className="w-24 h-24 rounded-[40px] bg-slate-50/50 flex items-center justify-center text-slate-100 group">
                              <MessageSquare className="w-10 h-10 group-hover:scale-110 transition-transform duration-500" strokeWidth={1} />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-200 font-display">No Inquiry Records Yet</p>
                         </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
             </Table>
           </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
