export interface ProgressUpdate {
  taskId: string;
  type: 'close-friends';
  status: 'in-progress' | 'completed' | 'error';
  totalItems: number;
  processedItems: number;
  currentItem?: string;
  error?: string;
  timestamp: number;
}