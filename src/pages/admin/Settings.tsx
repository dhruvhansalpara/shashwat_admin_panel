import { Settings } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { MessageCircle, Save, Info as InfoIcon, Database, RefreshCw, AlertCircle, CheckCircle2, Globe, Shield, Mail, ShieldCheck } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAdmin } from '@/context/AdminContext';
import { cn } from '@/lib/utils';

interface SettingsPageProps {
  settings: Settings;
  onUpdate: (settings: Partial<Settings>) => void;
}

export function SettingsPage({ settings, onUpdate }: SettingsPageProps) {
  const { token } = useAdmin();
  const [localSettings, setLocalSettings] = useState<Settings>(settings);
  const [dbHealth, setDbHealth] = useState<any>(null);
  const [isChecking, setIsChecking] = useState(false);

  const [dbConfig, setDbConfig] = useState({
    host: '',
    user: '',
    password: '',
    database: '',
    port: '3306'
  });
  const [isSavingDb, setIsSavingDb] = useState(false);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const checkDb = async () => {
    setIsChecking(true);
    try {
      const res = await fetch('/api/db-health', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setDbHealth(data);
      if (data.config) {
        setDbConfig({
          host: data.config.host || '',
          user: data.config.user || '',
          password: '', 
          database: data.config.database || '',
          port: data.config.port || '3306'
        });
      }
    } catch (e) {
      setDbHealth({ status: 'error', error: 'Failed to reach API' });
    } finally {
      setIsChecking(false);
    }
  };

  const handleSaveDb = async () => {
    setIsSavingDb(true);
    try {
      const res = await fetch('/api/db-config', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dbConfig)
      });
      if (res.ok) {
        toast.success("Database configuration updated");
        checkDb();
      } else {
        toast.error("Failed to update database configuration");
      }
    } catch (e) {
      toast.error("Error saving database configuration");
    } finally {
      setIsSavingDb(false);
    }
  };

  useEffect(() => {
    checkDb();
  }, [token]);

  const handleSave = () => {
    onUpdate(localSettings);
    toast.success("Settings saved successfully");
  };

  const previewLink = `https://wa.me/${localSettings.whatsappNumber}?text=${encodeURIComponent(localSettings.defaultMessage)}`;

  return (
    <div className="space-y-12 pb-20 font-display">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="space-y-1">
          <h2 className="text-4xl font-black tracking-tighter text-slate-800 uppercase leading-none">System Parameters</h2>
          <p className="text-slate-400 font-medium text-sm opacity-80 pl-1">Configuration and technical endpoint management.</p>
        </div>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-12 p-1.5 bg-slate-50 border-2 border-slate-50 rounded-3xl h-auto flex flex-wrap max-w-fit shadow-inner">
          <TabsTrigger value="general" className="gap-3 rounded-2xl px-10 py-4 font-black text-[10px] uppercase tracking-[0.2em] data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:shadow-slate-200/30 transition-all data-[state=active]:text-[#009688]">
            <Globe className="w-4 h-4" /> Identity
          </TabsTrigger>
          <TabsTrigger value="access" className="gap-3 rounded-2xl px-10 py-4 font-black text-[10px] uppercase tracking-[0.2em] data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:shadow-slate-200/30 transition-all data-[state=active]:text-[#009688]">
            <Shield className="w-4 h-4" /> Security
          </TabsTrigger>
          <TabsTrigger value="database" className="gap-3 rounded-2xl px-10 py-4 font-black text-[10px] uppercase tracking-[0.2em] data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:shadow-slate-200/30 transition-all data-[state=active]:text-[#009688]">
            <Database className="w-4 h-4" /> Engine
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="max-w-4xl space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className="border-2 border-slate-50 shadow-[0_8px_40px_rgba(0,0,0,0.02)] rounded-[32px] overflow-hidden bg-white">
            <CardHeader className="p-12 pb-6 border-b border-slate-50">
              <div className="flex items-center gap-6 mb-2">
                <div className="w-14 h-14 rounded-2xl bg-[#e0f2f1] text-[#009688] flex items-center justify-center shadow-inner">
                  <Globe className="w-7 h-7" strokeWidth={3} />
                </div>
                <div>
                  <CardTitle className="text-3xl font-black tracking-tighter text-slate-800 uppercase leading-none">Platform Branding</CardTitle>
                  <CardDescription className="font-bold text-slate-400 uppercase text-[10px] tracking-widest mt-2 mt-2">Public identity and metadata architecture.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-12 pt-10 space-y-10">
              <div className="space-y-3">
                <Label htmlFor="site_name" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Platform Identification</Label>
                <Input 
                  id="site_name" 
                  value={localSettings.siteName}
                  onChange={(e) => setLocalSettings({ ...localSettings, siteName: e.target.value })}
                  className="rounded-2xl h-16 px-8 border-slate-100 bg-slate-50/50 font-black text-xl shadow-sm focus:ring-[#009688]/20 transition-all"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-slate-50 shadow-[0_8px_40px_rgba(0,0,0,0.02)] rounded-[32px] overflow-hidden bg-white">
            <CardHeader className="p-12 pb-6 border-b border-slate-50">
              <div className="flex items-center gap-6 mb-2">
                <div className="w-14 h-14 rounded-2xl bg-[#e0f2f1] text-[#009688] flex items-center justify-center shadow-inner">
                  <MessageCircle className="w-7 h-7" strokeWidth={3} />
                </div>
                <div>
                  <CardTitle className="text-3xl font-black tracking-tighter text-slate-800 uppercase leading-none">WhatsApp Protocol</CardTitle>
                  <CardDescription className="font-bold text-slate-400 uppercase text-[10px] tracking-widest mt-2 mt-2">Channel direct communication with visitors.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-12 pt-10 space-y-10">
              <div className="space-y-4">
                <Label htmlFor="whatsapp" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Communications Port (Number)</Label>
                <div className="flex gap-4">
                  <div className="flex items-center px-8 rounded-2xl border border-slate-100 bg-slate-100 text-slate-400 font-black text-base italic">
                    +Registry
                  </div>
                  <Input 
                    id="whatsapp" 
                    placeholder="919876543210" 
                    value={localSettings.whatsappNumber}
                    onChange={(e) => setLocalSettings({ ...localSettings, whatsappNumber: e.target.value })}
                    className="rounded-2xl h-16 px-8 border-slate-100 bg-slate-50/50 font-black text-xl flex-1 shadow-sm focus:ring-[#009688]/20 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label htmlFor="message" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Transmission Header (Default Msg)</Label>
                <Textarea 
                  id="message" 
                  placeholder="e.g. Hello Shashwat Holidays," 
                  className="min-h-[160px] rounded-[32px] p-8 border-slate-100 bg-slate-50/50 font-bold text-lg leading-relaxed shadow-sm focus:ring-[#009688]/20 transition-all"
                  value={localSettings.defaultMessage}
                  onChange={(e) => setLocalSettings({ ...localSettings, defaultMessage: e.target.value })}
                />
              </div>

              <div className="p-10 rounded-[32px] border-2 bg-emerald-50/20 border-emerald-500/5 flex flex-col md:flex-row gap-10">
                <div className="w-14 h-14 rounded-[20px] bg-white flex items-center justify-center text-emerald-500 shadow-sm shrink-0">
                  <InfoIcon className="w-8 h-8" strokeWidth={3} />
                </div>
                <div className="space-y-6 flex-1 min-w-0">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-800">Protocol Preview Link</p>
                    <div className="group relative">
                      <p className="text-xs text-emerald-600/80 font-black break-all leading-relaxed bg-white p-6 rounded-2xl border border-emerald-100/50 italic">
                        {previewLink}
                      </p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" asChild className="h-12 px-10 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] bg-[#009688] border-none text-white hover:bg-[#00796b] transition-all hover:scale-105 active:scale-95 shadow-lg shadow-[#009688]/20">
                    <a href={previewLink} target="_blank" rel="noopener noreferrer">Test Protocol Sequence</a>
                  </Button>
                </div>
              </div>
            </CardContent>
            <div className="p-12 pt-0 flex justify-end">
              <Button onClick={handleSave} className="rounded-2xl h-16 px-12 bg-slate-800 hover:bg-slate-900 text-white font-black text-[12px] uppercase tracking-[0.2em] shadow-xl shadow-slate-200/50 transition-all hover:scale-[1.02]">
                <Save className="w-5 h-5 mr-3" strokeWidth={3} /> Commit Branding Assets
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="access" className="max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className="border-2 border-slate-50 shadow-[0_8px_40px_rgba(0,0,0,0.02)] rounded-[32px] overflow-hidden bg-white">
            <CardHeader className="p-12 pb-6 border-b border-slate-50">
              <div className="flex items-center gap-6 mb-2">
                <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center shadow-inner">
                  <Shield className="w-7 h-7" strokeWidth={3} />
                </div>
                <div>
                  <CardTitle className="text-3xl font-black tracking-tighter text-slate-800 uppercase leading-none">Security Architecture</CardTitle>
                  <CardDescription className="font-bold text-slate-400 uppercase text-[10px] tracking-widest mt-2 mt-2">Whitelist parameters and portal restrictions.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-12 pt-10 space-y-12">
              <div className="flex items-center justify-between p-10 bg-slate-50/50 rounded-[40px] border border-slate-100 shadow-inner">
                <div className="space-y-1.5">
                  <p className="text-xl font-black text-slate-800 tracking-tight leading-none uppercase italic">Portal Interface Status</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black opacity-60">Global activation of administrative sign-in nodes</p>
                </div>
                <Switch 
                  checked={localSettings.allowLogin} 
                  onCheckedChange={(val) => setLocalSettings({...localSettings, allowLogin: val})} 
                  className="data-[state=checked]:bg-[#009688] scale-125"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-2 pl-1">
                  <Mail className="w-5 h-5 text-[#009688]" strokeWidth={3} />
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Restricted Identity Registry (Allowed Emails)</Label>
                </div>
                <Textarea 
                  placeholder="admin@shashwa.in&#10;manager@shashwa.in" 
                  className="min-h-[240px] rounded-[32px] p-10 border-slate-100 bg-slate-50/50 font-black text-base leading-relaxed shadow-sm font-mono focus:ring-[#009688]/20 transition-all text-slate-700"
                  value={localSettings.allowedEmails ? 
                    (Array.isArray(localSettings.allowedEmails) ? localSettings.allowedEmails.join('\n') : localSettings.allowedEmails) 
                    : ''}
                  onChange={(e) => setLocalSettings({ ...localSettings, allowedEmails: e.target.value.split('\n').filter(Boolean) })}
                />
                <div className="flex items-center gap-3 pl-4">
                   <div className="w-2 h-2 rounded-full bg-[#009688] animate-ping" />
                   <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] opacity-40">Separate entries with carriage returns</p>
                </div>
              </div>
            </CardContent>
            <div className="p-12 pt-0 flex justify-end">
              <Button onClick={handleSave} className="rounded-2xl h-16 px-12 bg-rose-500 hover:bg-rose-600 text-white font-black text-[12px] uppercase tracking-[0.2em] shadow-xl shadow-rose-500/20 transition-all hover:scale-[1.02]">
                <Save className="w-5 h-5 mr-3" strokeWidth={3} /> Deploy Security Policies
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="database" className="max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className="border-2 border-slate-50 shadow-[0_8px_40px_rgba(0,0,0,0.02)] rounded-[32px] overflow-hidden bg-white">
            <CardHeader className="p-12 pb-6 border-b border-slate-50">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-6 mb-2">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center shadow-inner">
                    <Database className="w-7 h-7" strokeWidth={3} />
                  </div>
                  <div>
                    <CardTitle className="text-3xl font-black tracking-tighter text-slate-800 uppercase leading-none">Logical Connectivity</CardTitle>
                    <CardDescription className="font-bold text-slate-400 uppercase text-[10px] tracking-widest mt-2 mt-2">Core data engine endpoints and node status.</CardDescription>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={checkDb} 
                  disabled={isChecking}
                  className={cn(
                    "rounded-2xl h-12 px-8 gap-3 border-2 border-slate-100 font-black text-[10px] uppercase tracking-[0.2em] transition-all",
                    dbHealth?.status === 'connected' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400'
                  )}
                >
                  <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} /> Ping Registry
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-12 pt-10 space-y-12">
              {dbHealth && (
                <div className={cn(
                  "p-10 rounded-[40px] flex flex-col gap-8 shadow-sm transition-all border-2",
                  dbHealth.status === 'connected' ? 'bg-emerald-50/30 border-emerald-500/5' : 'bg-rose-50/30 border-rose-500/5'
                )}>
                  <div className="flex items-center gap-6">
                    <div className={cn(
                      "w-16 h-16 rounded-[24px] flex items-center justify-center shadow-inner group",
                      dbHealth.status === 'connected' ? 'bg-white text-emerald-500' : 'bg-white text-rose-500'
                    )}>
                      {dbHealth.status === 'connected' ? (
                        <CheckCircle2 className="w-8 h-8 group-hover:scale-110 transition-transform" strokeWidth={3} />
                      ) : (
                        <AlertCircle className="w-8 h-8 group-hover:scale-110 transition-transform" strokeWidth={3} />
                      )}
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Logical Heartbeat</p>
                      <p className="text-2xl font-black uppercase tracking-tighter italic">
                        {dbHealth.status === 'connected' ? 'Sync Established' : 'Critical Disconnect'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-10 py-10 border-y border-white/50">
                    <div className="space-y-2">
                       <p className="text-[10px] uppercase font-black text-slate-400 tracking-[0.2em]">Node Address</p>
                       <p className="text-sm font-black font-mono text-slate-700 italic">{dbHealth.config?.host || '--'}</p>
                    </div>
                    <div className="space-y-2">
                       <p className="text-[10px] uppercase font-black text-slate-400 tracking-[0.2em]">Registry ID</p>
                       <p className="text-sm font-black font-mono text-slate-700 uppercase">{dbHealth.config?.database || '--'}</p>
                    </div>
                    <div className="space-y-2">
                       <p className="text-[10px] uppercase font-black text-slate-400 tracking-[0.2em]">Access ID</p>
                       <p className="text-sm font-black font-mono text-slate-700">{dbHealth.config?.user || '--'}</p>
                    </div>
                    <div className="space-y-2">
                       <p className="text-[10px] uppercase font-black text-slate-400 tracking-[0.2em]">Logical Port</p>
                       <p className="text-sm font-black font-mono text-slate-700">{dbHealth.config?.port || '3306'}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-3">
                  <Label htmlFor="db-host" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Registry Host</Label>
                  <Input 
                    id="db-host" 
                    placeholder="e.g. 1.2.3.4" 
                    value={dbConfig.host}
                    onChange={(e) => setDbConfig({ ...dbConfig, host: e.target.value })}
                    className="rounded-2xl h-16 px-8 border-slate-100 bg-slate-50/50 font-black text-lg focus:ring-[#009688]/20 transition-all shadow-sm"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="db-name" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Catalog Identifier</Label>
                  <Input 
                    id="db-name" 
                    placeholder="e.g. travel_db" 
                    value={dbConfig.database}
                    onChange={(e) => setDbConfig({ ...dbConfig, database: e.target.value })}
                    className="rounded-2xl h-16 px-8 border-slate-100 bg-slate-50/50 font-black text-lg focus:ring-[#009688]/20 transition-all shadow-sm"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="db-user" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Authorized ID</Label>
                  <Input 
                    id="db-user" 
                    placeholder="e.g. root" 
                    value={dbConfig.user}
                    onChange={(e) => setDbConfig({ ...dbConfig, user: e.target.value })}
                    className="rounded-2xl h-16 px-8 border-slate-100 bg-slate-50/50 font-black text-lg focus:ring-[#009688]/20 transition-all shadow-sm"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="db-password" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Security Key</Label>
                  <Input 
                    id="db-password" 
                    type="password"
                    placeholder="••••••••" 
                    value={dbConfig.password}
                    onChange={(e) => setDbConfig({ ...dbConfig, password: e.target.value })}
                    className="rounded-2xl h-16 px-8 border-slate-100 bg-slate-50/50 font-black text-lg focus:ring-[#009688]/20 transition-all shadow-sm"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="db-port" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Protocol Port</Label>
                  <Input 
                    id="db-port" 
                    placeholder="3306" 
                    value={dbConfig.port}
                    onChange={(e) => setDbConfig({ ...dbConfig, port: e.target.value })}
                    className="rounded-2xl h-16 px-8 border-slate-100 bg-slate-50/50 font-black text-lg focus:ring-[#009688]/20 transition-all shadow-sm"
                  />
                </div>
                <div className="flex items-end">
                  <Button 
                    onClick={handleSaveDb} 
                    className="w-full h-16 rounded-2xl bg-slate-900 hover:bg-slate-950 text-white shadow-xl shadow-slate-200/50 font-black text-[12px] uppercase tracking-[0.2em] transition-all hover:scale-[1.02]"
                    disabled={isSavingDb}
                  >
                    {isSavingDb ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    Initialize & Sync Node
                  </Button>
                </div>
              </div>

              <div className="p-10 rounded-[32px] border-2 bg-slate-50/50 border-slate-100/50 flex gap-10">
                <div className="w-14 h-14 rounded-[20px] bg-white flex items-center justify-center text-slate-300 shadow-sm shrink-0">
                  <ShieldCheck className="w-8 h-8" strokeWidth={3} />
                </div>
                <div className="space-y-2 flex-1">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-800">Binary Protocol Assurance</p>
                  <p className="text-xs text-slate-500 leading-relaxed font-bold uppercase tracking-widest opacity-60">
                    Host parameters are encrypted in transition. Destination endpoints must be whitelisted for entry from origin: {window.location.hostname}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
