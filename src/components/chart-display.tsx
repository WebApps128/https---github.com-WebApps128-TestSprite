'use client';

import React, { useState, useEffect, forwardRef, useMemo } from 'react';
import { Bar, BarChart, Line, LineChart, Pie, PieChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Skeleton } from './ui/skeleton';
import { BarChart3, TrendingUp, PieChart as PieChartIcon, AlertTriangle } from 'lucide-react';

export interface ChartResult {
  chartData: any[];
  chartType: string;
  chartDescription: string;
}

interface ChartDisplayProps {
  chartResult: ChartResult | null;
  chartConfig: { title: string };
  isLoading: boolean;
}

const CHART_COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

const ChartDisplay = forwardRef<HTMLDivElement, ChartDisplayProps>(({ chartResult, chartConfig, isLoading }, ref) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { dataKeys, stringKey } = useMemo(() => {
    if (!chartResult?.chartData || chartResult.chartData.length === 0) {
      return { dataKeys: [], stringKey: null };
    }
    const firstItem = chartResult.chartData[0];
    const keys = Object.keys(firstItem);
    const dataKeys = keys.filter(key => typeof firstItem[key] === 'number');
    const stringKey = keys.find(key => typeof firstItem[key] === 'string');
    return { dataKeys, stringKey };
  }, [chartResult?.chartData]);

  const renderChart = () => {
    if (!chartResult || !stringKey || dataKeys.length === 0) {
        return <ErrorMessage message="AI returned data in an unsupported format." />;
    }
    const { chartData, chartType } = chartResult;

    switch (chartType.toLowerCase().replace(' ', '')) {
      case 'barchart':
        return (
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey={stringKey} stroke="hsl(var(--foreground))" />
            <YAxis stroke="hsl(var(--foreground))" />
            <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}/>
            <Legend />
            {dataKeys.map((key, index) => (
                <Bar key={key} dataKey={key} fill={CHART_COLORS[index % CHART_COLORS.length]} />
            ))}
          </BarChart>
        );
      case 'linechart':
        return (
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey={stringKey} stroke="hsl(var(--foreground))" />
            <YAxis stroke="hsl(var(--foreground))" />
            <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}/>
            <Legend />
            {dataKeys.map((key, index) => (
              <Line key={key} type="monotone" dataKey={key} stroke={CHART_COLORS[index % CHART_COLORS.length]} />
            ))}
          </LineChart>
        );
      case 'piechart':
        return (
          <PieChart>
            <Pie data={chartData} dataKey={dataKeys[0]} nameKey={stringKey} cx="50%" cy="50%" outerRadius={120} label>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} />
            <Legend />
          </PieChart>
        );
      default:
        return <ErrorMessage message={`Chart type "${chartType}" is not supported.`} />;
    }
  };

  if (isLoading) {
    return <LoadingPlaceholder />;
  }

  return (
    <Card ref={ref} className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>{chartConfig.title || chartResult?.chartDescription || 'Generated Chart'}</CardTitle>
        {chartResult && <CardDescription>Chart type: {chartResult.chartType}</CardDescription>}
      </CardHeader>
      <CardContent className="flex-1 pb-6">
        {isClient ? (
          chartResult ? (
            <ResponsiveContainer width="100%" height="100%">
              {renderChart()}
            </ResponsiveContainer>
          ) : (
            <EmptyState />
          )
        ) : (
          <LoadingPlaceholder />
        )}
      </CardContent>
    </Card>
  );
});
ChartDisplay.displayName = 'ChartDisplay';

const EmptyState = () => (
  <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground p-8 space-y-4">
    <div className="flex -space-x-4">
      <BarChart3 className="w-16 h-16 text-primary/30 p-2 bg-muted rounded-full" />
      <TrendingUp className="w-16 h-16 text-primary/50 p-2 bg-muted rounded-full translate-y-4" />
      <PieChartIcon className="w-16 h-16 text-primary/40 p-2 bg-muted rounded-full" />
    </div>
    <h3 className="text-xl font-semibold text-foreground">Your chart will appear here</h3>
    <p>Upload a dataset and ask the AI to generate a visualization.</p>
  </div>
);

const LoadingPlaceholder = () => (
  <div className="p-6 h-full">
    <Skeleton className="h-8 w-3/4 mb-4" />
    <Skeleton className="h-4 w-1/2 mb-8" />
    <Skeleton className="w-full h-[calc(100%-100px)]" />
  </div>
);

const ErrorMessage = ({ message }: { message: string }) => (
    <div className="h-full flex flex-col items-center justify-center text-destructive p-4">
        <AlertTriangle className="w-12 h-12 mb-4" />
        <h3 className="text-lg font-semibold">Chart Error</h3>
        <p className="text-sm">{message}</p>
    </div>
);

export { ChartDisplay };
