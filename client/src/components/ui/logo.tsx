import { Circle } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <Circle className="h-6 w-6 text-green-500" strokeWidth={3} />
        <div className="absolute -bottom-0.5 -right-0.5 h-2 w-2 bg-green-500 rounded-full" />
      </div>
      <span className="text-lg font-semibold text-black-100">
        LaTexNotes
      </span>
    </div>
  );
}
