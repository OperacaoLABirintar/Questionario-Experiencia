
export enum Status {
  Idle = 'idle',
  Submitting = 'submitting',
  Success = 'success',
  Error = 'error',
}

export interface FormData {
  score: number;
  reason: string;
  feedback: string;
}
