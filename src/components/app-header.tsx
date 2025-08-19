import { BarChart3 } from "lucide-react";

export function AppHeader() {
  return (
    <header className="flex items-center flex-shrink-0 gap-3 px-6 py-4 border-b border-border">
      <BarChart3 className="w-8 h-8 text-primary" />
      <h1 className="text-2xl font-bold text-foreground">ChartFlow AI</h1>
    </header>
  );
}
