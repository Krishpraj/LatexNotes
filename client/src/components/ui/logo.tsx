import { Square } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <Square className="h-6 w-6 text-blue-500" strokeWidth={3} />
        <div className="absolute -bottom-0.5 -right-0.5 h-2 w-2 bg-blue-500 rounded-full" />
      </div>
      <span className="text-lg font-semibold text-gray-100">
        Thorem
      </span>
    </div>
  );
}
