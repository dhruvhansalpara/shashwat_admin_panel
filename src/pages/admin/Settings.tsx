import { Settings } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MessageCircle, Save, Info, Database, RefreshCw, AlertCircle, CheckCircle2, Globe } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SettingsPageProps {
  settings: Settings;
  onUpdate: (settings: Partial<Settings>) => void;
}

export function SettingsPage({ settings, onUpdate }: SettingsPageProps) {
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

  const checkDb = async () => {
    setIsChecking(true);
    try {
      const res = await fetch('/api/db-health');
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
        headers: { 'Content-Type': 'application/json' },
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
  }, []);

  const handleSave = () => {
    onUpdate(localSettings);
    toast.success("Settings saved successfully");
  };

  const previewLink = `https://wa.me/${localSettings.whatsappNumber}?text=${encodeURIComponent(localSettings.defaultMessage)}`;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">System Settings</h2>
        <p className="text-muted-foreground">Configure global integrations and database connectivity.</p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="general" className="gap-2">
            <Globe className="w-4 h-4" /> General
          </TabsTrigger>
          <TabsTrigger value="database" className="gap-2">
            <Database className="w-4 h-4" /> Database
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="max-w-2xl">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <MessageCircle className="w-5 h-5 text-emerald-500 fill-emerald-500/10" />
                <CardTitle>WhatsApp Integration</CardTitle>
              </div>
              <CardDescription>
                This number and message will be used for all "Inquire on WhatsApp" buttons across the site.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp Number</Label>
                <div className="flex gap-2">
                  <span className="flex items-center px-3 rounded-lg border bg-muted text-muted-foreground font-mono text-sm">
                    +/
                  </span>
                  <Input 
                    id="whatsapp" 
                    placeholder="e.g. 919876543210" 
                    value={localSettings.whatsappNumber}
                    onChange={(e) => setLocalSettings({ ...localSettings, whatsappNumber: e.target.value })}
                  />
                </div>
                <p className="text-[10px] text-muted-foreground italic">Enter number with country code, without + or spaces.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Default Message Prefix</Label>
                <Textarea 
                  id="message" 
                  placeholder="e.g. Hello Shashwa Holidays," 
                  className="min-h-[100px]"
                  value={localSettings.defaultMessage}
                  onChange={(e) => setLocalSettings({ ...localSettings, defaultMessage: e.target.value })}
                />
              </div>

              <div className="p-4 rounded-xl border bg-emerald-50/50 border-emerald-100 flex gap-4">
                <div className="mt-1">
                  <Info className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-emerald-900">Dynamic Link Preview</p>
                  <p className="text-[11px] text-emerald-700 font-mono break-all opacity-80 mb-2">
                    {previewLink}
                  </p>
                  <Button size="sm" variant="outline" asChild className="h-7 text-[10px] bg-white border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                    <a href={previewLink} target="_blank" rel="noopener noreferrer">Test Connection</a>
                  </Button>
                </div>
              </div>
            </CardContent>
            <div className="p-6 pt-0 flex justify-end">
              <Button onClick={handleSave} className="gap-2">
                <Save className="w-4 h-4" /> Save Configuration
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="database" className="max-w-2xl">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Database className="w-5 h-5 text-blue-500" />
                    <CardTitle>Database Connectivity</CardTitle>
                  </div>
                  <CardDescription>
                    Live status of your MySQL database connection.
                  </CardDescription>
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={checkDb} 
                  disabled={isChecking}
                  className="gap-2"
                >
                  <RefreshCw className={`w-3 h-3 ${isChecking ? 'animate-spin' : ''}`} /> Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {dbHealth && (
                <div className={`p-4 rounded-xl border flex flex-col gap-3 ${
                  dbHealth.status === 'connected' ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'
                }`}>
                  <div className="flex items-center gap-3">
                    {dbHealth.status === 'connected' ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    )}
                    <div className="flex-grow">
                      <p className={`text-sm font-bold ${dbHealth.status === 'connected' ? 'text-emerald-900' : 'text-red-900'}`}>
                        {dbHealth.status === 'connected' ? 'Connected Successfully' : 'Connection Failed'}
                      </p>
                      {dbHealth.error && (
                        <p className="text-[11px] text-red-700 font-mono mt-1 bg-white/50 p-2 rounded border border-red-200">
                          {dbHealth.error}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div className="space-y-1">
                       <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Host</p>
                       <p className="text-xs font-mono">{dbHealth.config?.host || '--'}</p>
                    </div>
                    <div className="space-y-1">
                       <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Database</p>
                       <p className="text-xs font-mono">{dbHealth.config?.database || '--'}</p>
                    </div>
                    <div className="space-y-1">
                       <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">User</p>
                       <p className="text-xs font-mono">{dbHealth.config?.user || '--'}</p>
                    </div>
                    <div className="space-y-1">
                       <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Port</p>
                       <p className="text-xs font-mono">{dbHealth.config?.port || '3306'}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-6">
                <div className="space-y-2">
                  <Label htmlFor="db-host">Database Host</Label>
                  <Input 
                    id="db-host" 
                    placeholder="e.g. 1.2.3.4 or mydb.com" 
                    value={dbConfig.host}
                    onChange={(e) => setDbConfig({ ...dbConfig, host: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="db-name">Database Name</Label>
                  <Input 
                    id="db-name" 
                    placeholder="e.g. travel_db" 
                    value={dbConfig.database}
                    onChange={(e) => setDbConfig({ ...dbConfig, database: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="db-user">Username</Label>
                  <Input 
                    id="db-user" 
                    placeholder="e.g. root" 
                    value={dbConfig.user}
                    onChange={(e) => setDbConfig({ ...dbConfig, user: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="db-password">Password</Label>
                  <Input 
                    id="db-password" 
                    type="password"
                    placeholder="••••••••" 
                    value={dbConfig.password}
                    onChange={(e) => setDbConfig({ ...dbConfig, password: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="db-port">Port</Label>
                  <Input 
                    id="db-port" 
                    placeholder="3306" 
                    value={dbConfig.port}
                    onChange={(e) => setDbConfig({ ...dbConfig, port: e.target.value })}
                  />
                </div>
                <div className="flex items-end">
                  <Button 
                    onClick={handleSaveDb} 
                    className="w-full gap-2 bg-blue-600 hover:bg-blue-700"
                    disabled={isSavingDb}
                  >
                    {isSavingDb ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Sync Database Access
                  </Button>
                </div>
              </div>

              <div className="p-4 rounded-xl border bg-slate-50 border-slate-200 flex gap-4">
                <Info className="w-4 h-4 text-slate-500 shrink-0 mt-1" />
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-slate-900">Credential Management</p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Values entered here will be saved to a local configuration file and prioritized over environment variables.
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

