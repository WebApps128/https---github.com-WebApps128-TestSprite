import { Sparkles } from "lucide-react";

export function AppHeader() {
  return (
    <header className="flex items-center flex-shrink-0 gap-3 px-6 py-4 border-b border-border">
      <Sparkles className="w-8 h-8 text-primary" />
      <h1 className="text-2xl font-bold text-foreground">GenAI App</h1>
    </header>
  );
}
