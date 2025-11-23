export interface StudyExample {
  title: string;
  content: string;
}

export interface StudyContent {
  definition: string;
  keyPoints: string[];
  example: StudyExample;
  imageUrl?: string;
}

export interface SubjectOption {
  id: string;
  label: string;
  icon: string;
  color: string;
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';
