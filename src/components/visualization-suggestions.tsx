'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lightbulb } from 'lucide-react';
import { Skeleton } from './ui/skeleton';

interface VisualizationSuggestionsProps {
  suggestions: string[];
  onSelect: (suggestion: string) => void;
  isLoading: boolean;
}

export function VisualizationSuggestions({ suggestions, onSelect, isLoading }: VisualizationSuggestionsProps) {
  if (isLoading) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                    <Lightbulb className="text-primary" />
                    AI Suggestions
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-2/3" />
            </CardContent>
        </Card>
    );
  }

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Lightbulb className="text-primary" />
          AI Suggestions
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col space-y-2">
        {suggestions.map((suggestion, index) => (
          <Button
            key={index}
            variant="ghost"
            className="text-left justify-start"
            onClick={() => onSelect(suggestion)}
          >
            {suggestion}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
