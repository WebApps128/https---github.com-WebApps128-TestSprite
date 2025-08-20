'use client';

import { useState, useCallback } from 'react';
import { AppHeader } from '@/components/app-header';
import { QueryForm } from '@/components/query-form';
import { useToast } from '@/hooks/use-toast';
import { generateText } from '@/ai/flows/generate-text';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const [response, setResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleQuerySubmit = useCallback(async (query: string) => {
    setIsLoading(true);
    setResponse('');
    try {
      const result = await generateText({ prompt: query });
      setResponse(result.response);
    } catch (error) {
      console.error("Error generating response:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "The AI could not generate a response.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  return (
      <div className="flex flex-col h-screen bg-background text-foreground">
        <AppHeader />
        <main className="flex-1 flex flex-col p-4 sm:p-6 overflow-auto">
          <div className="max-w-4xl w-full mx-auto flex flex-col gap-6">
            <QueryForm onSubmit={handleQuerySubmit} isLoading={isLoading} />
            
            {isLoading && (
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </CardContent>
              </Card>
            )}

            {response && !isLoading && (
              <Card>
                <CardContent className="p-6">
                  <p className="whitespace-pre-wrap">{response}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
  );
}
