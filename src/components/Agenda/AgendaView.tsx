
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Talk, DragItem } from '@/types/agenda';
import { TimeSlot } from './TimeSlot';
import { TalkCard } from './TalkCard';
import { TalkDialog } from './TalkDialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const timeSlots = Array.from({ length: 17 }, (_, i) => {
  const hour = Math.floor(i / 2) + 9;
  const minute = i % 2 === 0 ? '00' : '30';
  return `${hour.toString().padStart(2, '0')}:${minute}`;
});

const AGENDA_NAMES = ['Main Stage', 'Workshop Room', 'Panel Discussion'];

export const AgendaView = () => {
  // Store talks for multiple agendas
  const [agendas, setAgendas] = useState<{ 
    [key: string]: Talk[] 
  }>({
    'Main Stage': [],
    'Workshop Room': [],
    'Panel Discussion': []
  });
  const [activeAgenda, setActiveAgenda] = useState<string>(AGENDA_NAMES[0]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTalk, setEditingTalk] = useState<Talk | undefined>();
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent, targetTime: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetTime: string) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('text/plain');
    const draggedItem: DragItem = JSON.parse(data);

    // Only process if it's a talk and from the current agenda
    if (draggedItem.type === 'talk' && draggedItem.agendaName === activeAgenda) {
      const updatedTalks = agendas[activeAgenda].map(talk => {
        if (talk.id === draggedItem.id) {
          return {
            ...talk,
            startTime: targetTime,
          };
        }
        return talk;
      });

      // Check for overlaps
      const hasOverlap = checkForOverlap(updatedTalks, draggedItem.id, targetTime, draggedItem.duration);
      
      if (hasOverlap) {
        toast({
          title: "Cannot move talk",
          description: "This would cause an overlap with another talk",
          variant: "destructive",
        });
        return;
      }

      setAgendas({
        ...agendas,
        [activeAgenda]: updatedTalks
      });
    }
  };

  const checkForOverlap = (talks: Talk[], excludeId: string, startTime: string, duration: number): boolean => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const startMinutes = hours * 60 + minutes;
    const endMinutes = startMinutes + duration;

    return talks.some(talk => {
      if (talk.id === excludeId) return false;

      const [tHours, tMinutes] = talk.startTime.split(':').map(Number);
      const tStartMinutes = tHours * 60 + tMinutes;
      const tEndMinutes = tStartMinutes + talk.duration;

      return (startMinutes < tEndMinutes && endMinutes > tStartMinutes);
    });
  };

  const handleSaveTalk = (talkData: Omit<Talk, 'id'>) => {
    const id = editingTalk?.id || uuidv4();
    const newTalk = { ...talkData, id };

    if (checkForOverlap(agendas[activeAgenda], id, talkData.startTime, talkData.duration)) {
      toast({
        title: "Cannot save talk",
        description: "This would cause an overlap with another talk",
        variant: "destructive",
      });
      return;
    }

    let updatedTalks;
    if (editingTalk) {
      updatedTalks = agendas[activeAgenda].map(t => t.id === id ? newTalk : t);
    } else {
      updatedTalks = [...agendas[activeAgenda], newTalk];
    }

    setAgendas({
      ...agendas,
      [activeAgenda]: updatedTalks
    });
    
    setEditingTalk(undefined);
    setDialogOpen(false);
  };

  const handleEditTalk = (talk: Talk) => {
    setEditingTalk(talk);
    setDialogOpen(true);
  };

  const handleDeleteTalk = (id: string) => {
    setAgendas({
      ...agendas,
      [activeAgenda]: agendas[activeAgenda].filter(t => t.id !== id)
    });
  };

  const timeToMinutes = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const findTalkAtTime = (time: string): Talk | undefined => {
    const timeInMinutes = timeToMinutes(time);
    return agendas[activeAgenda].find(talk => {
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
    const nextTalk = agendas[activeAgenda].find(talk => timeToMinutes(talk.startTime) > timeToMinutes(time));
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
        onDragOver={(e) => handleDragOver(e, time)}
        onDrop={(e) => handleDrop(e, time)}
      >
        Free Time
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">Event Agendas</h1>
        <Button onClick={() => {
          setEditingTalk(undefined);
          setDialogOpen(true);
        }}>
          Add Talk
        </Button>
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
                    <TimeSlot
                      time={time}
                      onDragOver={(e) => handleDragOver(e, time)}
                      onDrop={(e) => handleDrop(e, time)}
                    />
                    {showTalk && (
                      <TalkCard
                        key={talk.id}
                        talk={talk}
                        agendaName={activeAgenda}
                        onEdit={handleEditTalk}
                        onDelete={handleDeleteTalk}
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

      <TalkDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSaveTalk}
        initialTalk={editingTalk}
      />
    </div>
  );
};
