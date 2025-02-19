
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Talk, DragItem } from '@/types/agenda';
import { TimeSlot } from './TimeSlot';
import { TalkCard } from './TalkCard';
import { TalkDialog } from './TalkDialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const timeSlots = Array.from({ length: 17 }, (_, i) => {
  const hour = Math.floor(i / 2) + 9;
  const minute = i % 2 === 0 ? '00' : '30';
  return `${hour.toString().padStart(2, '0')}:${minute}`;
});

export const AgendaView = () => {
  const [talks, setTalks] = useState<Talk[]>([]);
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

    if (draggedItem.type === 'talk') {
      const updatedTalks = talks.map(talk => {
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

      setTalks(updatedTalks);
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

    if (checkForOverlap(talks, id, talkData.startTime, talkData.duration)) {
      toast({
        title: "Cannot save talk",
        description: "This would cause an overlap with another talk",
        variant: "destructive",
      });
      return;
    }

    if (editingTalk) {
      setTalks(talks.map(t => t.id === id ? newTalk : t));
    } else {
      setTalks([...talks, newTalk]);
    }
    setEditingTalk(undefined);
  };

  const handleEditTalk = (talk: Talk) => {
    setEditingTalk(talk);
    setDialogOpen(true);
  };

  const handleDeleteTalk = (id: string) => {
    setTalks(talks.filter(t => t.id !== id));
  };

  const getTalksForTimeSlot = (time: string) => {
    return talks.filter(talk => talk.startTime === time);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">Event Agenda</h1>
        <Button onClick={() => {
          setEditingTalk(undefined);
          setDialogOpen(true);
        }}>
          Add Talk
        </Button>
      </div>

      <div className="relative pl-16 border rounded-lg bg-white shadow-sm">
        {timeSlots.map((time) => (
          <div key={time} className="relative">
            <TimeSlot
              time={time}
              onDragOver={(e) => handleDragOver(e, time)}
              onDrop={(e) => handleDrop(e, time)}
            />
            {getTalksForTimeSlot(time).map((talk) => (
              <TalkCard
                key={talk.id}
                talk={talk}
                onEdit={handleEditTalk}
                onDelete={handleDeleteTalk}
              />
            ))}
          </div>
        ))}
      </div>

      <TalkDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSaveTalk}
        initialTalk={editingTalk}
      />
    </div>
  );
};
