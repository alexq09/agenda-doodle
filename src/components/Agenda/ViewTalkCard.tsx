
import React from 'react';
import { Talk } from '@/types/agenda';
import { cn } from '@/lib/utils';

interface ViewTalkCardProps {
  talk: Talk;
}

export const ViewTalkCard = ({ talk }: ViewTalkCardProps) => {
  // Calculate height: each 30 minutes = 60px
  const height = `${(talk.duration / 30) * 60}px`;

  return (
    <div
      className={cn(
        "absolute left-0 right-0 mx-4 rounded-lg bg-white p-3 shadow-sm border border-gray-100",
      )}
      style={{
        height,
        top: 0,
        backgroundColor: talk.color || 'white',
        zIndex: 10
      }}
    >
      <div className="flex flex-col h-full overflow-y-auto">
        <h3 className="font-medium text-sm break-words">{talk.title}</h3>
        <p className="text-xs text-gray-500 mt-1 break-words">{talk.speaker}</p>
        <div className="mt-auto text-xs text-gray-400">
          {talk.duration} mins
        </div>
      </div>
    </div>
  );
};
