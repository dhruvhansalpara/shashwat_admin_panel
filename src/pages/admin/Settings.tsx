import { Settings } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { MessageCircle, Save, Info, Database, RefreshCw, AlertCircle, CheckCircle2, Globe, Shield, Mail } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAdmin } from '@/context/AdminContext';

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
    <div className="space-y-8 pb-10">
      <div>
        <h2 className="text-3xl font-display font-bold tracking-tight">System Settings</h2>
        <p className="text-muted-foreground mt-1">Configure global platform behavior and database connectivity.</p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-8 p-1 bg-muted/50 rounded-xl h-auto">
          <TabsTrigger value="general" className="gap-2 rounded-lg px-6 py-2.5 font-bold text-xs uppercase tracking-widest">
            <Globe className="w-4 h-4" /> General
          </TabsTrigger>
          <TabsTrigger value="access" className="gap-2 rounded-lg px-6 py-2.5 font-bold text-xs uppercase tracking-widest">
            <Shield className="w-4 h-4" /> Login Control
          </TabsTrigger>
          <TabsTrigger value="database" className="gap-2 rounded-lg px-6 py-2.5 font-bold text-xs uppercase tracking-widest">
            <Database className="w-4 h-4" /> Database
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="max-w-2xl space-y-6">
          <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
            <CardHeader className="p-8 pb-4">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-emerald-600" />
                </div>
                <CardTitle className="text-xl font-bold">Site Branding</CardTitle>
              </div>
              <CardDescription>Configure the public identity of your platform.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-4 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="site_name" className="text-xs uppercase tracking-widest font-bold ml-1">Platform Name</Label>
                <Input 
                  id="site_name" 
                  value={localSettings.siteName}
                  onChange={(e) => setLocalSettings({ ...localSettings, siteName: e.target.value })}
                  className="rounded-xl h-12"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
            <CardHeader className="p-8 pb-4">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-emerald-600" />
                </div>
                <CardTitle className="text-xl font-bold">WhatsApp Integration</CardTitle>
              </div>
              <CardDescription>Connect with customers directly via WhatsApp chat.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-4 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="whatsapp" className="text-xs uppercase tracking-widest font-bold ml-1">WhatsApp Number</Label>
                <div className="flex gap-2 group">
                  <span className="flex items-center px-4 rounded-xl border bg-muted text-muted-foreground font-mono text-sm">
                    +/
                  </span>
                  <Input 
                    id="whatsapp" 
                    placeholder="e.g. 919876543210" 
                    value={localSettings.whatsappNumber}
                    onChange={(e) => setLocalSettings({ ...localSettings, whatsappNumber: e.target.value })}
                    className="rounded-xl h-12"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-xs uppercase tracking-widest font-bold ml-1">Default Greeting</Label>
                <Textarea 
                  id="message" 
                  placeholder="e.g. Hello Shashwat Holidays," 
                  className="min-h-[100px] rounded-2xl"
                  value={localSettings.defaultMessage}
                  onChange={(e) => setLocalSettings({ ...localSettings, defaultMessage: e.target.value })}
                />
              </div>

              <div className="p-5 rounded-2xl border bg-emerald-50/30 border-emerald-100/50 flex gap-4">
                <Info className="w-5 h-5 text-emerald-600 mt-1 shrink-0" />
                <div className="space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-900">Live API Link</p>
                  <p className="text-[11px] text-emerald-700 font-mono break-all opacity-80 leading-relaxed bg-white/50 p-2 rounded-lg">
                    {previewLink}
                  </p>
                  <Button size="sm" variant="outline" asChild className="h-9 px-4 rounded-xl text-[11px] font-bold uppercase tracking-widest bg-white border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                    <a href={previewLink} target="_blank" rel="noopener noreferrer">Verify Connection</a>
                  </Button>
                </div>
              </div>
            </CardContent>
            <div className="p-8 pt-0 flex justify-end">
              <Button onClick={handleSave} className="rounded-xl h-12 px-8 shadow-lg shadow-primary/20 font-bold text-xs uppercase tracking-widest gap-2">
                <Save className="w-4 h-4" /> Save General Settings
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="access" className="max-w-2xl">
          <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
            <CardHeader className="p-8 pb-4">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-orange-600" />
                </div>
                <CardTitle className="text-xl font-bold">Access Control</CardTitle>
              </div>
              <CardDescription>Manage who can log in to the administrative portal.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-4 space-y-8">
              <div className="flex items-center justify-between p-4 bg-muted/40 rounded-2xl border-none">
                <div className="space-y-1">
                  <p className="text-sm font-bold">Portal Access</p>
                  <p className="text-[11px] text-muted-foreground uppercase tracking-widest font-bold">Allow administrators to sign in</p>
                </div>
                <Switch 
                  checked={localSettings.allowLogin} 
                  onCheckedChange={(val) => setLocalSettings({...localSettings, allowLogin: val})} 
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="w-4 h-4 text-primary" />
                  <Label className="text-xs uppercase tracking-widest font-bold">Whitelisted Emails</Label>
                </div>
                <Textarea 
                  placeholder="admin@shashwa.in&#10;manager@shashwa.in" 
                  className="min-h-[150px] rounded-2xl font-mono text-sm leading-relaxed"
                  value={localSettings.allowedEmails ? 
                    (Array.isArray(localSettings.allowedEmails) ? localSettings.allowedEmails.join('\n') : localSettings.allowedEmails) 
                    : ''}
                  onChange={(e) => setLocalSettings({ ...localSettings, allowedEmails: e.target.value.split('\n').filter(Boolean) })}
                />
                <p className="text-[10px] text-muted-foreground italic font-medium">Enter one email address per line. Only these emails will be allowed to log in.</p>
              </div>
            </CardContent>
            <div className="p-8 pt-0 flex justify-end">
              <Button onClick={handleSave} className="rounded-xl h-12 px-8 shadow-lg shadow-primary/20 font-bold text-xs uppercase tracking-widest gap-2">
                <Save className="w-4 h-4" /> Update Access Rules
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="database" className="max-w-2xl">
          <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
            <CardHeader className="p-8 pb-4">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                      <Database className="w-5 h-5 text-blue-600" />
                    </div>
                    <CardTitle className="text-xl font-bold">Database Connectivity</CardTitle>
                  </div>
                  <CardDescription>
                    Live health report of your structural data connection.
                  </CardDescription>
                </div>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={checkDb} 
                  disabled={isChecking}
                  className="rounded-xl h-10 px-4 gap-2 hover:bg-muted font-bold text-[10px] uppercase tracking-widest"
                >
                  <RefreshCw className={`w-3 h-3 ${isChecking ? 'animate-spin' : ''}`} /> Sync Check
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-8 pt-4 space-y-8">
              {dbHealth && (
                <div className={`p-6 rounded-2xl border-none flex flex-col gap-4 ${
                  dbHealth.status === 'connected' ? 'bg-emerald-50 text-emerald-900 shadow-sm' : 'bg-red-50 text-red-900 shadow-sm'
                }`}>
                  <div className="flex items-center gap-3">
                    {dbHealth.status === 'connected' ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                    ) : (
                      <AlertCircle className="w-6 h-6 text-red-500" />
                    )}
                    <div className="flex-grow">
                      <p className="text-sm font-bold uppercase tracking-wider">
                        {dbHealth.status === 'connected' ? 'Engine ONLINE' : 'System OFFLINE'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-y-4 mt-2">
                    <div className="space-y-1">
                       <p className="text-[10px] uppercase font-bold opacity-60 tracking-widest">Hostname</p>
                       <p className="text-xs font-mono font-bold">{dbHealth.config?.host || '--'}</p>
                    </div>
                    <div className="space-y-1">
                       <p className="text-[10px] uppercase font-bold opacity-60 tracking-widest">Storage Root</p>
                       <p className="text-xs font-mono font-bold">{dbHealth.config?.database || '--'}</p>
                    </div>
                    <div className="space-y-1">
                       <p className="text-[10px] uppercase font-bold opacity-60 tracking-widest">Identified User</p>
                       <p className="text-xs font-mono font-bold">{dbHealth.config?.user || '--'}</p>
                    </div>
                    <div className="space-y-1">
                       <p className="text-[10px] uppercase font-bold opacity-60 tracking-widest">Port Protocol</p>
                       <p className="text-xs font-mono font-bold">{dbHealth.config?.port || '3306'}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="db-host" className="text-xs uppercase tracking-widest font-bold ml-1">Database Host</Label>
                  <Input 
                    id="db-host" 
                    placeholder="e.g. 1.2.3.4" 
                    value={dbConfig.host}
                    onChange={(e) => setDbConfig({ ...dbConfig, host: e.target.value })}
                    className="rounded-xl h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="db-name" className="text-xs uppercase tracking-widest font-bold ml-1">Database Name</Label>
                  <Input 
                    id="db-name" 
                    placeholder="e.g. travel_db" 
                    value={dbConfig.database}
                    onChange={(e) => setDbConfig({ ...dbConfig, database: e.target.value })}
                    className="rounded-xl h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="db-user" className="text-xs uppercase tracking-widest font-bold ml-1">Username</Label>
                  <Input 
                    id="db-user" 
                    placeholder="e.g. root" 
                    value={dbConfig.user}
                    onChange={(e) => setDbConfig({ ...dbConfig, user: e.target.value })}
                    className="rounded-xl h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="db-password" className="text-xs uppercase tracking-widest font-bold ml-1">Password</Label>
                  <Input 
                    id="db-password" 
                    type="password"
                    placeholder="••••••••" 
                    value={dbConfig.password}
                    onChange={(e) => setDbConfig({ ...dbConfig, password: e.target.value })}
                    className="rounded-xl h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="db-port" className="text-xs uppercase tracking-widest font-bold ml-1">Access Port</Label>
                  <Input 
                    id="db-port" 
                    placeholder="3306" 
                    value={dbConfig.port}
                    onChange={(e) => setDbConfig({ ...dbConfig, port: e.target.value })}
                    className="rounded-xl h-11"
                  />
                </div>
                <div className="flex items-end">
                  <Button 
                    onClick={handleSaveDb} 
                    className="w-full gap-2 bg-blue-600 hover:bg-blue-700 rounded-xl h-11 shadow-lg shadow-blue-500/20 font-bold text-xs uppercase tracking-widest"
                    disabled={isSavingDb}
                  >
                    {isSavingDb ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Store credentials
                  </Button>
                </div>
              </div>

              <div className="p-5 rounded-2xl border bg-slate-50/50 border-slate-200/50 flex gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                  <Info className="w-4 h-4 text-slate-500" />
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-slate-900">Security Note</p>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    New credentials will be verified immediately upon saving. Ensure your MySQL server allows remote connections from this environment's IP.
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

