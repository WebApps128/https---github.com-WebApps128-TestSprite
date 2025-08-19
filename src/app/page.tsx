'use client';

import { useState, useRef, useCallback } from 'react';
import { SidebarProvider, Sidebar, SidebarInset, SidebarContent } from "@/components/ui/sidebar";
import { AppHeader } from '@/components/app-header';
import { DatasetUploader } from '@/components/dataset-uploader';
import { VisualizationSuggestions } from '@/components/visualization-suggestions';
import { QueryForm } from '@/components/query-form';
import { ChartDisplay, type ChartResult } from '@/components/chart-display';
import { ChartConfigPanel } from '@/components/chart-config-panel';
import { useToast } from '@/hooks/use-toast';
import { suggestVisualizations } from '@/ai/flows/suggest-visualizations';
import { generateChartFromQuery } from '@/ai/flows/generate-chart-from-query';

export default function Home() {
  const [dataset, setDataset] = useState<any[] | null>(null);
  const [datasetString, setDatasetString] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [chartResult, setChartResult] = useState<ChartResult | null>(null);
  const [chartConfig, setChartConfig] = useState({ title: '' });
  const [isSuggestionsLoading, setIsSuggestionsLoading] = useState(false);
  const [isChartLoading, setIsChartLoading] = useState(false);
  const [activeQuery, setActiveQuery] = useState('');
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleDatasetUpload = useCallback(async (data: any[], dataString: string, description: string) => {
    setDataset(data);
    setDatasetString(dataString);
    setChartResult(null);
    setSuggestions([]);
    setActiveQuery('');
    setIsSuggestionsLoading(true);
    try {
      const result = await suggestVisualizations({ datasetDescription: description });
      setSuggestions(result.suggestions);
    } catch (error) {
      console.error("Error getting suggestions:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not get visualization suggestions from AI.",
      });
    } finally {
      setIsSuggestionsLoading(false);
    }
  }, [toast]);

  const handleQuerySubmit = useCallback(async (query: string) => {
    if (!datasetString) {
      toast({
        variant: "destructive",
        title: "No Dataset",
        description: "Please upload a dataset before generating a chart.",
      });
      return;
    }
    setIsChartLoading(true);
    setChartResult(null);
    try {
      const result = await generateChartFromQuery({ dataset: datasetString, query });
      const parsedData = JSON.parse(result.chartData);
      setChartResult({ ...result, chartData: parsedData });
      setChartConfig({ title: result.chartDescription });
    } catch (error) {
      console.error("Error generating chart:", error);
      toast({
        variant: "destructive",
        title: "Chart Generation Failed",
        description: "The AI could not generate a chart from your query.",
      });
    } finally {
      setIsChartLoading(false);
    }
  }, [datasetString, toast]);
  
  const handleSuggestionSelect = useCallback((suggestion: string) => {
    setActiveQuery(suggestion);
  }, []);

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex flex-col h-screen bg-background text-foreground">
        <AppHeader />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar className="border-r border-border" collapsible="icon">
            <SidebarContent className="p-4 space-y-6">
              <DatasetUploader onUpload={handleDatasetUpload} isLoading={isSuggestionsLoading} />
              <VisualizationSuggestions suggestions={suggestions} onSelect={handleSuggestionSelect} isLoading={isSuggestionsLoading} />
            </SidebarContent>
          </Sidebar>
          <SidebarInset>
            <main className="flex flex-col h-full">
              <div className="p-4 sm:p-6 border-b border-border">
                <QueryForm onSubmit={handleQuerySubmit} isLoading={isChartLoading} initialQuery={activeQuery} />
              </div>
              <div className="flex-1 p-4 sm:p-6 overflow-auto">
                <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 h-full">
                  <div className="xl:col-span-3 h-full min-h-[400px]">
                    <ChartDisplay ref={chartContainerRef} chartResult={chartResult} chartConfig={chartConfig} isLoading={isChartLoading} />
                  </div>
                  <div className="xl:col-span-1">
                    {chartResult && <ChartConfigPanel chartContainerRef={chartContainerRef} config={chartConfig} setConfig={setChartConfig} chartType={chartResult.chartType}/>}
                  </div>
                </div>
              </div>
            </main>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
