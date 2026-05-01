import { Settings } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { MessageCircle, Save, Info as InfoIcon, Database, RefreshCw, AlertCircle, CheckCircle2, Globe, Shield, Mail, ShieldCheck } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
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

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-10 pb-20 max-w-6xl mx-auto"
    >
      <motion.div variants={item} className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-1">
          <h2 className="text-4xl font-black tracking-tight text-slate-900 uppercase font-display leading-none">
            Settings <span className="text-primary">&</span> Configuration
          </h2>
          <p className="text-[#009688] font-bold uppercase tracking-[0.3em] text-[9px] pl-0.5 opacity-80 flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            System Identity & Security Protocol
          </p>
        </div>
        <Button 
          onClick={handleSave} 
          className="rounded-2xl h-14 px-10 bg-[#009688] hover:bg-[#00796b] text-white font-black uppercase tracking-[0.2em] text-[11px] shadow-xl shadow-[#009688]/20 transition-all hover:scale-[1.02] active:scale-95"
        >
          <Save className="w-5 h-5 mr-3" strokeWidth={3} /> Save All Changes
        </Button>
      </motion.div>

      <Tabs defaultValue="general" className="w-full">
        <motion.div variants={item}>
          <TabsList className="mb-10 p-1.5 bg-white border border-slate-100 rounded-[24px] h-auto flex flex-wrap max-w-fit shadow-sm">
            <TabsTrigger value="general" className="gap-3 rounded-2xl px-10 py-4 font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-[#009688] data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-[#009688]/20 transition-all">
              <Globe className="w-4 h-4" /> Identity
            </TabsTrigger>
            <TabsTrigger value="access" className="gap-3 rounded-2xl px-10 py-4 font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-[#009688] data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-[#009688]/20 transition-all">
              <Shield className="w-4 h-4" /> Security
            </TabsTrigger>
            <TabsTrigger value="database" className="gap-3 rounded-2xl px-10 py-4 font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-[#009688] data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-[#009688]/20 transition-all">
              <Database className="w-4 h-4" /> Database
            </TabsTrigger>
          </TabsList>
        </motion.div>

        <AnimatePresence mode="wait">
          <TabsContent key="general" value="general" className="space-y-8 focus-visible:outline-none">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              <div className="lg:col-span-2 space-y-8">
                <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[40px] overflow-hidden bg-white/90 backdrop-blur-md">
                  <CardHeader className="p-10 pb-6">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-[24px] bg-[#009688]/10 text-[#009688] flex items-center justify-center">
                        <Globe className="w-8 h-8" strokeWidth={2.5} />
                      </div>
                      <div>
                        <CardTitle className="text-2xl font-black tracking-tight text-slate-800 uppercase">Public Identity</CardTitle>
                        <CardDescription className="font-bold text-slate-400 uppercase text-[9px] tracking-[0.2em] mt-1">Configuring how users see your brand.</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-10 pt-4 space-y-10">
                    <div className="space-y-4">
                      <Label htmlFor="site_name" className="text-[10px] font-black uppercase tracking-widest text-[#009688] pl-1">Website Brand Name</Label>
                      <Input 
                        id="site_name" 
                        value={localSettings.siteName}
                        onChange={(e) => setLocalSettings({ ...localSettings, siteName: e.target.value })}
                        className="rounded-2xl h-16 px-8 border-slate-100 bg-slate-50/50 font-bold text-xl shadow-inner focus:bg-white transition-all"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[40px] overflow-hidden bg-white/90 backdrop-blur-md">
                  <CardHeader className="p-10 pb-6">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-[24px] bg-[#e91e63]/10 text-[#e91e63] flex items-center justify-center">
                        <MessageCircle className="w-8 h-8" strokeWidth={2.5} />
                      </div>
                      <div>
                        <CardTitle className="text-2xl font-black tracking-tight text-slate-800 uppercase">Communication</CardTitle>
                        <CardDescription className="font-bold text-slate-400 uppercase text-[9px] tracking-[0.2em] mt-1">WhatsApp and direct engagement channels.</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-10 pt-4 space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <Label htmlFor="whatsapp" className="text-[10px] font-black uppercase tracking-widest text-[#e91e63] pl-1">WhatsApp Business No.</Label>
                        <Input 
                          id="whatsapp" 
                          placeholder="9876543210" 
                          value={localSettings.whatsappNumber}
                          onChange={(e) => setLocalSettings({ ...localSettings, whatsappNumber: e.target.value })}
                          className="rounded-2xl h-16 px-8 border-slate-100 bg-slate-50/50 font-bold text-xl shadow-inner focus:bg-white transition-all"
                        />
                      </div>
                      <div className="space-y-4">
                        <Label htmlFor="message" className="text-[10px] font-black uppercase tracking-widest text-[#e91e63] pl-1">Greeting Prefix</Label>
                        <Input 
                          id="message" 
                          placeholder="Hello Shashwat," 
                          value={localSettings.defaultMessage}
                          onChange={(e) => setLocalSettings({ ...localSettings, defaultMessage: e.target.value })}
                          className="rounded-2xl h-16 px-8 border-slate-100 bg-slate-50/50 font-bold text-xl shadow-inner focus:bg-white transition-all"
                        />
                      </div>
                    </div>

                    <div className="p-8 rounded-[32px] bg-slate-50 border border-slate-100 space-y-4 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-[#e91e63]/5 rounded-full blur-2xl -mr-12 -mt-12 transition-transform duration-700 group-hover:scale-150" />
                      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#e91e63]">Live Click-to-Chat Preview</p>
                      <div className="bg-white p-5 rounded-2xl border border-[#e91e63]/10 font-bold text-sm text-slate-500 italic break-all leading-relaxed shadow-sm">
                        {previewLink}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-8">
                <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[40px] overflow-hidden bg-white/90 backdrop-blur-md">
                   <CardContent className="p-10 space-y-6">
                      <div className="w-14 h-14 rounded-2xl bg-[#fbc02d]/10 text-[#fbc02d] flex items-center justify-center">
                        <InfoIcon className="w-8 h-8" />
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-xl font-black uppercase tracking-tight text-slate-800">Quick Help</h4>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed opacity-80">
                          Changes to Identity affect the public-facing portal branding immediately after saving.
                        </p>
                      </div>
                      <div className="pt-4 border-t border-slate-50">
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#009688]">PRO TIP</p>
                        <p className="text-[11px] font-bold text-slate-400 mt-1 uppercase leading-tight tracking-wide">Use international format for WhatsApp (e.g. 9198...)</p>
                      </div>
                   </CardContent>
                </Card>
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent key="access" value="access" className="space-y-8 focus-visible:outline-none">
             <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-4xl"
              >
                <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[40px] overflow-hidden bg-white/90 backdrop-blur-md">
                  <CardHeader className="p-10 pb-6">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-[24px] bg-[#e91e63]/10 text-[#e91e63] flex items-center justify-center">
                        <ShieldCheck className="w-8 h-8" strokeWidth={2.5} />
                      </div>
                      <div>
                        <CardTitle className="text-2xl font-black tracking-tight text-slate-800 uppercase">Security Layer</CardTitle>
                        <CardDescription className="font-bold text-slate-400 uppercase text-[9px] tracking-[0.2em] mt-1">Access control and authentication protocols.</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-10 pt-4 space-y-10">
                    <div className="flex items-center justify-between p-8 bg-slate-50/50 rounded-[32px] border border-white shadow-inner">
                      <div className="space-y-1">
                        <p className="text-xl font-black text-slate-800 uppercase italic leading-none">Master Access</p>
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Toggle administrative login portal</p>
                      </div>
                      <Switch 
                        checked={localSettings.allowLogin} 
                        onCheckedChange={(val) => setLocalSettings({...localSettings, allowLogin: val})} 
                        className="data-[state=checked]:bg-[#009688] scale-125"
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between px-1">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-[#009688]">Whitelisted Administrators (Emails)</Label>
                        <Badge variant="outline" className="rounded-full px-3 py-0.5 border-[#009688]/20 text-[#009688] font-black text-[8px] uppercase tracking-widest">Case Insensitive</Badge>
                      </div>
                      <Textarea 
                        placeholder="admin@shashwa.in&#10;manager@shashwa.in" 
                        className="min-h-[280px] rounded-[32px] p-8 border-slate-100 bg-slate-50/50 font-bold text-lg leading-relaxed shadow-inner font-mono focus:bg-white transition-all"
                        value={localSettings.allowedEmails ? 
                          (Array.isArray(localSettings.allowedEmails) ? localSettings.allowedEmails.join('\n') : localSettings.allowedEmails) 
                          : ''}
                        onChange={(e) => setLocalSettings({ ...localSettings, allowedEmails: e.target.value.split('\n').filter(Boolean) })}
                      />
                      <p className="text-[9px] font-black text-slate-300 uppercase px-4 tracking-[0.2em]">Add one email address per line</p>
                    </div>
                  </CardContent>
                </Card>
             </motion.div>
          </TabsContent>

          <TabsContent key="database" value="database" className="space-y-8 focus-visible:outline-none">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-4 gap-8"
            >
              <div className="lg:col-span-3">
                <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[40px] overflow-hidden bg-white/90 backdrop-blur-md">
                  <CardHeader className="p-10 pb-6 border-b border-slate-50/50">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-[24px] bg-[#fbc02d]/10 text-[#fbc02d] flex items-center justify-center">
                          <Database className="w-8 h-8" strokeWidth={2.5} />
                        </div>
                        <div>
                          <CardTitle className="text-2xl font-black tracking-tight text-slate-800 uppercase">Data Server</CardTitle>
                          <CardDescription className="font-bold text-slate-400 uppercase text-[9px] tracking-[0.2em] mt-1">MySQL Cloud Node Configuration.</CardDescription>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={checkDb} 
                        disabled={isChecking}
                        className={cn(
                          "rounded-xl h-12 px-6 gap-3 font-black text-[9px] uppercase tracking-widest transition-all",
                          dbHealth?.status === 'connected' ? 'bg-[#009688] text-white border-none' : 'bg-white text-slate-400 border-slate-100 hover:bg-slate-50'
                        )}
                      >
                        <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} /> 
                        {isChecking ? 'Syncing...' : 'Sync Check'}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-10 pt-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <Label htmlFor="db-host" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Host Node</Label>
                          <Input 
                            id="db-host" 
                            value={dbConfig.host}
                            onChange={(e) => setDbConfig({ ...dbConfig, host: e.target.value })}
                            className="rounded-2xl h-14 px-6 border-slate-100 bg-slate-50/50 font-bold text-base focus:bg-white transition-all shadow-inner"
                          />
                        </div>
                        <div className="space-y-3">
                          <Label htmlFor="db-name" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Database Schema</Label>
                          <Input 
                            id="db-name" 
                            value={dbConfig.database}
                            onChange={(e) => setDbConfig({ ...dbConfig, database: e.target.value })}
                            className="rounded-2xl h-14 px-6 border-slate-100 bg-slate-50/50 font-bold text-base focus:bg-white transition-all shadow-inner"
                          />
                        </div>
                        <div className="space-y-3">
                          <Label htmlFor="db-user" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Username</Label>
                          <Input 
                            id="db-user" 
                            value={dbConfig.user}
                            onChange={(e) => setDbConfig({ ...dbConfig, user: e.target.value })}
                            className="rounded-2xl h-14 px-6 border-slate-100 bg-slate-50/50 font-bold text-base focus:bg-white transition-all shadow-inner"
                          />
                        </div>
                        <div className="space-y-3">
                          <Label htmlFor="db-password" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Password</Label>
                          <Input 
                            id="db-password" 
                            type="password"
                            value={dbConfig.password}
                            onChange={(e) => setDbConfig({ ...dbConfig, password: e.target.value })}
                            className="rounded-2xl h-14 px-6 border-slate-100 bg-slate-50/50 font-bold text-base focus:bg-white transition-all shadow-inner"
                          />
                        </div>
                    </div>
                    <div className="mt-10 pt-8 border-t border-slate-50 flex justify-end">
                        <Button 
                          onClick={handleSaveDb} 
                          className="h-14 px-10 rounded-2xl bg-slate-900 hover:bg-black text-white font-black text-[11px] uppercase tracking-[0.2em] transition-all hover:scale-105"
                          disabled={isSavingDb}
                        >
                          {isSavingDb ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-3" strokeWidth={3} />}
                          Commit DB Config
                        </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <AnimatePresence mode="popLayout">
                  {dbHealth && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={cn(
                        "p-10 rounded-[40px] text-white shadow-2xl relative overflow-hidden",
                        dbHealth.status === 'connected' ? 'bg-[#009688] shadow-[#009688]/20' : 'bg-[#e91e63] shadow-[#e91e63]/20'
                      )}
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16" />
                      <div className="relative z-10 space-y-8">
                        <div className="flex items-center justify-between">
                          <p className="text-[9px] font-black uppercase tracking-[0.3em] opacity-60">Status</p>
                          <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-4xl font-black uppercase tracking-tighter italic">{dbHealth.status === 'connected' ? 'LIVE' : 'DOWN'}</h4>
                          <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">{dbHealth.status === 'connected' ? 'SYNCED' : 'OFFLINE'}</p>
                        </div>
                        <div className="pt-6 border-t border-white/20 space-y-4">
                          <div className="space-y-0.5">
                            <p className="text-[8px] font-black uppercase tracking-widest opacity-40">Host</p>
                            <p className="text-[10px] font-black truncate italic">{dbHealth.config?.host || 'N/A'}</p>
                          </div>
                          <div className="space-y-0.5">
                            <p className="text-[8px] font-black uppercase tracking-widest opacity-40">Database</p>
                            <p className="text-[10px] font-black truncate uppercase">{dbHealth.config?.database || 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </TabsContent>
        </AnimatePresence>
      </Tabs>
    </motion.div>
  );
}
