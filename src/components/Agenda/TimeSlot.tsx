
import React from 'react';
import { cn } from '@/lib/utils';

interface TimeSlotProps {
  time: string;
  isDropTarget?: boolean;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
}

export const TimeSlot = ({ time, isDropTarget, onDragOver, onDrop }: TimeSlotProps) => {
  return (
    <div
      className={cn(
        "h-[60px] border-b border-gray-100 relative group transition-colors",
        isDropTarget && "bg-gray-50"
      )}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <span className="absolute -left-16 top-1/2 -translate-y-1/2 text-sm text-gray-400 select-none w-12 text-right">
        {time}
      </span>
    </div>
  );
};
