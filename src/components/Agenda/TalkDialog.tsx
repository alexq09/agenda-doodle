
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Talk } from '@/types/agenda';

interface TalkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (talk: Omit<Talk, 'id'>) => void;
  initialTalk?: Talk;
}

export const TalkDialog = ({ open, onOpenChange, onSave, initialTalk }: TalkDialogProps) => {
  const [formData, setFormData] = React.useState<Omit<Talk, 'id'>>({
    title: initialTalk?.title || '',
    speaker: initialTalk?.speaker || '',
    startTime: initialTalk?.startTime || '09:00',
    duration: initialTalk?.duration || 30,
  });

  React.useEffect(() => {
    if (initialTalk) {
      setFormData(initialTalk);
    }
  }, [initialTalk]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialTalk ? 'Edit Talk' : 'Add New Talk'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="speaker">Speaker</Label>
            <Input
              id="speaker"
              value={formData.speaker}
              onChange={(e) => setFormData(prev => ({ ...prev, speaker: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="time">Start Time</Label>
            <Input
              id="time"
              type="time"
              min="09:00"
              max="17:00"
              value={formData.startTime}
              onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Duration</Label>
            <RadioGroup
              value={formData.duration.toString()}
              onValueChange={(value) => setFormData(prev => ({ ...prev, duration: parseInt(value) as 30 | 60 }))}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="30" id="30min" />
                <Label htmlFor="30min">30 minutes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="60" id="60min" />
                <Label htmlFor="60min">1 hour</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
