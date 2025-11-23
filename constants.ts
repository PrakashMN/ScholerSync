import { SubjectOption } from './types';

export const SUBJECTS: SubjectOption[] = [
  { id: 'physics', label: 'Physics', icon: '⚡', color: 'bg-violet-100 text-violet-700 border-violet-200 hover:bg-violet-200' },
  { id: 'chemistry', label: 'Chemistry', icon: '🧪', color: 'bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-200' },
  { id: 'math', label: 'Mathematics', icon: '📐', color: 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200' },
  { id: 'biology', label: 'Biology', icon: '🧬', color: 'bg-rose-100 text-rose-700 border-rose-200 hover:bg-rose-200' },
  { id: 'computer_science', label: 'Computer Science', icon: '💻', color: 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200' },
  { id: 'economics', label: 'Economics', icon: '📈', color: 'bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-200' },
  { id: 'english', label: 'English Core', icon: '📚', color: 'bg-pink-100 text-pink-700 border-pink-200 hover:bg-pink-200' },
];

export const INITIAL_CONTENT = {
  definition: '',
  keyPoints: [],
  example: { title: '', content: '' }
};
