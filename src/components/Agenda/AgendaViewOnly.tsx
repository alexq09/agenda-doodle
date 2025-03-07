
import React, { useState } from 'react';
import { Talk } from '@/types/agenda';
import { ViewTalkCard } from './ViewTalkCard';
import { TimeSlot } from './TimeSlot';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const timeSlots = Array.from({ length: 17 }, (_, i) => {
  const hour = Math.floor(i / 2) + 9;
  const minute = i % 2 === 0 ? '00' : '30';
  return `${hour.toString().padStart(2, '0')}:${minute}`;
});

const AGENDA_NAMES = ['Main Stage', 'Workshop Room', 'Panel Discussion'];

// Sample data to showcase the agenda view
const sampleAgendas: { [key: string]: Talk[] } = {
  'Main Stage': [
    {
      id: '1',
      title: 'Keynote Address',
      speaker: 'Jane Smith, CEO',
      startTime: '09:30',
      duration: 60 as 60, // Explicitly cast as 60
      color: '#f3f4f6'
    },
    {
      id: '2',
      title: 'Future of Technology',
      speaker: 'John Doe, CTO',
      startTime: '11:00',
      duration: 30 as 30, // Explicitly cast as 30
      color: '#f3f4f6'
    }
  ],
  'Workshop Room': [
    {
      id: '3',
      title: 'Hands-on Workshop',
      speaker: 'Alex Johnson',
      startTime: '10:00',
      duration: 60 as 60, // Explicitly cast as 60
      color: '#f3f4f6'
    }
  ],
  'Panel Discussion': [
    {
      id: '4',
      title: 'Industry Trends Panel',
      speaker: 'Various Speakers',
      startTime: '13:30',
      duration: 60 as 60, // Explicitly cast as 60
      color: '#f3f4f6'
    }
  ]
};

interface AgendaViewOnlyProps {
  agendas?: { [key: string]: Talk[] };
}

export const AgendaViewOnly = ({ agendas = sampleAgendas }: AgendaViewOnlyProps) => {
  const [activeAgenda, setActiveAgenda] = useState<string>(AGENDA_NAMES[0]);

  const timeToMinutes = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const findTalkAtTime = (time: string): Talk | undefined => {
    const timeInMinutes = timeToMinutes(time);
    return agendas[activeAgenda]?.find(talk => {
      const talkStartMinutes = timeToMinutes(talk.startTime);
      const talkEndMinutes = talkStartMinutes + talk.duration;
      return timeInMinutes >= talkStartMinutes && timeInMinutes < talkEndMinutes;
    });
  };

  const isFreeTime = (time: string): boolean => {
    return !findTalkAtTime(time);
  };

  const renderFreeTime = (time: string) => {
    if (!isFreeTime(time)) return null;
    const nextTalk = agendas[activeAgenda]?.find(talk => timeToMinutes(talk.startTime) > timeToMinutes(time));
    const nextTalkStart = nextTalk ? timeToMinutes(nextTalk.startTime) : timeToMinutes('17:00');
    const currentTimeMinutes = timeToMinutes(time);
    const duration = Math.min(30, nextTalkStart - currentTimeMinutes);
    
    if (duration <= 0) return null;

    return (
      <div
        className="absolute left-0 right-0 mx-4 bg-gray-50 text-gray-400 text-xs flex items-center justify-center"
        style={{
          height: `${duration * 2}px`,
          top: 0,
        }}
      >
        Available
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">Conference Schedule</h1>
      </div>

      <Tabs value={activeAgenda} onValueChange={setActiveAgenda} className="mb-6">
        <TabsList className="w-full justify-start">
          {AGENDA_NAMES.map((agenda) => (
            <TabsTrigger key={agenda} value={agenda} className="flex-1">
              {agenda}
            </TabsTrigger>
          ))}
        </TabsList>

        {AGENDA_NAMES.map((agenda) => (
          <TabsContent key={agenda} value={agenda} className="m-0">
            <div className="relative pl-16 border rounded-lg bg-white shadow-sm">
              {timeSlots.map((time) => {
                const talk = findTalkAtTime(time);
                const showTalk = talk?.startTime === time;

                return (
                  <div key={time} className="relative">
                    <TimeSlot time={time} />
                    {showTalk && (
                      <ViewTalkCard
                        key={talk.id}
                        talk={talk}
                      />
                    )}
                    {isFreeTime(time) && renderFreeTime(time)}
                  </div>
                );
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
