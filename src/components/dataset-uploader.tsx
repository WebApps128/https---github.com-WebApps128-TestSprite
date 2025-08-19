'use client';

import { useState, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UploadCloud, FileJson, FileText, Loader2 } from 'lucide-react';

interface DatasetUploaderProps {
  onUpload: (data: any[], dataString: string, description: string) => void;
  isLoading: boolean;
}

function parseCsv(csv: string): { data: any[], headers: string[] } {
  const lines = csv.split('\n').filter(line => line.trim() !== '');
  if (lines.length < 2) return { data: [], headers: [] };
  
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  const data = lines.slice(1).map(line => {
    // This is a simple parser, for more complex CSVs a library would be needed
    const values = line.split(',');
    return headers.reduce((obj, header, index) => {
      const value = values[index]?.trim().replace(/"/g, '') || '';
      const numValue = parseFloat(value);
      obj[header] = isNaN(numValue) || !isFinite(numValue) ? value : numValue;
      return obj;
    }, {} as any);
  });
  return { data, headers };
}

export function DatasetUploader({ onUpload, isLoading }: DatasetUploaderProps) {
  const [fileName, setFileName] = useState('');
  const { toast } = useToast();

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        let data: any[];
        let headers: string[];
        let description: string;

        if (file.type === 'application/json') {
          data = JSON.parse(content);
          if (!Array.isArray(data) || data.length === 0) {
            throw new Error('JSON must be an array of objects.');
          }
          headers = Object.keys(data[0]);
          description = `A JSON dataset with columns: ${headers.join(', ')}.`;
        } else { // Assume CSV
          const parsed = parseCsv(content);
          data = parsed.data;
          headers = parsed.headers;
          if (data.length === 0) {
            throw new Error('CSV file is empty or invalid.');
          }
          description = `A CSV dataset with columns: ${headers.join(', ')}.`;
        }
        
        onUpload(data, content, description);

      } catch (error) {
        console.error("File processing error:", error);
        toast({
          variant: "destructive",
          title: "Invalid File",
          description: error instanceof Error ? error.message : "Could not process the uploaded file.",
        });
        setFileName('');
      }
    };

    reader.readAsText(file);
  }, [onUpload, toast]);

  const fileTypeIcon = fileName.endsWith('.json') ? <FileJson className="w-4 h-4" /> : <FileText className="w-4 h-4" />;

  return (
    <Card className="bg-card/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UploadCloud className="text-primary" />
          Upload Dataset
        </CardTitle>
        <CardDescription>Upload a CSV or JSON file to get started.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input id="file-upload" type="file" accept=".csv, .json" onChange={handleFileChange} className="text-sm" />
          {fileName && (
            <div className="flex items-center justify-between text-sm text-muted-foreground p-2 bg-muted/50 rounded-md">
              <div className="flex items-center gap-2 truncate">
                {fileTypeIcon}
                <span className="truncate">{fileName}</span>
              </div>
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
