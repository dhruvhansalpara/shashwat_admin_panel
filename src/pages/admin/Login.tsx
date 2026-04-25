import * as React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, LogIn, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface LoginPageProps {
  onLogin: () => Promise<void>;
  error?: string | null;
}

export function LoginPage({ onLogin, error }: LoginPageProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await onLogin();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-6">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex w-16 h-16 bg-primary rounded-2xl items-center justify-center mb-4 shadow-xl shadow-primary/20">
            <Package className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Portal</h1>
          <p className="text-muted-foreground">Shashwa Holiday & Travels Management</p>
        </div>

        <Card className="border-none shadow-2xl">
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>Use your administrative Google account to access the dashboard.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="py-4">
              <Button 
                onClick={handleGoogleLogin} 
                className="w-full h-12 gap-3" 
                disabled={isLoading}
                variant="outline"
              >
                <LogIn className="w-5 h-5" />
                {isLoading ? "Authenticating..." : "Sign in with Google"}
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <p className="text-xs text-center text-muted-foreground">
              Only authorized administrators can access this section.
            </p>
          </CardFooter>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          Protected by enterprise-level security. Unauthorized access is prohibited.
        </p>
      </div>
    </div>
  );
}
