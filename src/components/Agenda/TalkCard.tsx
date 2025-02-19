
import React from 'react';
import { Talk } from '@/types/agenda';
import { cn } from '@/lib/utils';

interface TalkCardProps {
  talk: Talk;
  onEdit: (talk: Talk) => void;
  onDelete: (id: string) => void;
}

export const TalkCard = ({ talk, onEdit, onDelete }: TalkCardProps) => {
  // Calculate height: each 30 minutes = 60px
  const height = `${(talk.duration / 30) * 60}px`;

  return (
    <div
      draggable
      className={cn(
        "absolute left-0 right-0 mx-4 rounded-lg bg-white p-3 shadow-sm border border-gray-100",
        "hover:shadow-md transition-shadow cursor-move select-none"
      )}
      style={{
        height,
        top: 0,
        backgroundColor: talk.color || 'white',
        zIndex: 10
      }}
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', JSON.stringify({
          id: talk.id,
          type: 'talk',
          startTime: talk.startTime,
          duration: talk.duration,
        }));
      }}
    >
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-sm line-clamp-2">{talk.title}</h3>
          <div className="flex gap-1">
            <button
              onClick={() => onEdit(talk)}
              className="p-1 hover:bg-gray-100 rounded-md transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
              </svg>
            </button>
            <button
              onClick={() => onDelete(talk.id)}
              className="p-1 hover:bg-gray-100 rounded-md transition-colors text-red-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18"/>
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
              </svg>
            </button>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1">{talk.speaker}</p>
        <div className="mt-auto text-xs text-gray-400">
          {talk.duration} mins
        </div>
      </div>
    </div>
  );
};
