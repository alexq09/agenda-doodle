
export interface Talk {
  id: string;
  title: string;
  speaker: string;
  startTime: string; // Format: "HH:mm"
  duration: 30 | 60; // in minutes
  color?: string;
}

export type DragItem = {
  id: string;
  type: string;
  startTime: string;
  duration: number;
};
