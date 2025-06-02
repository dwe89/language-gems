'use client';

import { useState } from 'react';
import { Button } from "../../../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "../../../../components/ui/alert";
import { Loader2 } from 'lucide-react';

export default function MigrateUsersPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  const runMigration = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/migrate-users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      setResults(data);
      
      if (!response.ok) {
        setError(data.error || 'Failed to run migration');
      }
    } catch (err) {
      console.error('Error running migration:', err);
      setError('An error occurred while running the migration');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Migrate Users</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>User Migration Tool</CardTitle>
          <CardDescription>
            This tool will update all student accounts with missing usernames, passwords, or teacher assignments.
            This process assigns you as the teacher for these accounts.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <Button 
            onClick={runMigration} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Running Migration...
              </>
            ) : 'Run Migration'}
          </Button>
          
          {results && (
            <div className="mt-6 space-y-4">
              <div className="text-lg font-medium">
                Migration Results
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-md">
                <p className="font-medium">Processed {results.processed} accounts</p>
              </div>
              
              {results.results && results.results.length > 0 && (
                <div className="border rounded-md overflow-hidden">
                  <div className="bg-muted p-4 font-medium">Updated Accounts</div>
                  <div className="divide-y max-h-80 overflow-y-auto">
                    {results.results.map((result: any, index: number) => (
                      <div key={index} className="p-4 hover:bg-muted/50">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{result.display_name}</p>
                            <p className="text-sm text-muted-foreground">ID: {result.id}</p>
                          </div>
                          {result.error ? (
                            <div className="text-red-500">Error: {result.error}</div>
                          ) : (
                            <div className="space-y-1">
                              {result.updates?.username && (
                                <div className="text-sm bg-blue-100 dark:bg-blue-800/30 px-2 py-1 rounded">Username: {result.updates.username}</div>
                              )}
                              {result.updates?.initial_password && (
                                <div className="text-sm bg-gray-100 dark:bg-gray-800/30 px-2 py-1 rounded">Password set</div>
                              )}
                              {result.updates?.teacher_id && (
                                <div className="text-sm bg-green-100 dark:bg-green-800/30 px-2 py-1 rounded">Teacher assigned</div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 