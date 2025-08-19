'use client';

import { useState, useEffect, useCallback } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2 } from 'lucide-react';
import { Card, CardContent } from './ui/card';

interface QueryFormProps {
  onSubmit: (query: string) => void;
  isLoading: boolean;
  initialQuery?: string;
}

export function QueryForm({ onSubmit, isLoading, initialQuery = '' }: QueryFormProps) {
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSubmit(query.trim());
    }
  }, [onSubmit, query]);

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="p-4">
          <div className="grid gap-4">
            <Textarea
              placeholder="e.g., 'Show me sales by month as a bar chart' or 'What is the distribution of users by country?'"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full text-base"
              rows={2}
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading || !query.trim()} className="w-full sm:w-auto justify-self-end bg-primary hover:bg-primary/90 text-primary-foreground">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Chart
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
