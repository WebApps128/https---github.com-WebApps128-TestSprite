'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from './ui/button';
import { Download, Settings, Image as ImageIcon, FileText as SvgIcon, File as PdfIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ChartConfigPanelProps {
  config: { title: string };
  setConfig: (config: { title: string }) => void;
  chartContainerRef: React.RefObject<HTMLDivElement>;
  chartType: string;
}

export function ChartConfigPanel({ config, setConfig, chartContainerRef, chartType }: ChartConfigPanelProps) {
  const { toast } = useToast();

  const handleExport = (format: 'svg' | 'png' | 'pdf') => {
    if (!chartContainerRef.current) {
        toast({ variant: 'destructive', title: 'Export Error', description: 'Chart element not found.' });
        return;
    }

    if (format === 'svg') {
        const svgElement = chartContainerRef.current.querySelector('svg');
        if (svgElement) {
            const serializer = new XMLSerializer();
            const svgString = serializer.serializeToString(svgElement);
            const blob = new Blob([svgString], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${config.title || 'chart'}.svg`;
            a.click();
            URL.revokeObjectURL(url);
            toast({ title: 'Export Successful', description: 'Chart exported as SVG.' });
        } else {
            toast({ variant: 'destructive', title: 'Export Error', description: 'SVG element not found for export.' });
        }
    } else {
        toast({ title: 'Coming Soon', description: `${format.toUpperCase()} export is not yet available.` });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="text-accent" />
          Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="chart-title">Chart Title</Label>
          <Input
            id="chart-title"
            value={config.title}
            onChange={(e) => setConfig({ ...config, title: e.target.value })}
            placeholder="Enter chart title"
          />
        </div>

        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                    <Download className="mr-2 h-4 w-4" />
                    Export Chart
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleExport('svg')}>
                    <SvgIcon className="mr-2 h-4 w-4" />
                    <span>Export as SVG</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('png')}>
                    <ImageIcon className="mr-2 h-4 w-4" />
                    <span>Export as PNG</span>
                </DropdownMenuItem>
                 <DropdownMenuItem onClick={() => handleExport('pdf')}>
                    <PdfIcon className="mr-2 h-4 w-4" />
                    <span>Export as PDF</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
      </CardContent>
    </Card>
  );
}
