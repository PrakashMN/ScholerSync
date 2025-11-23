import React from 'react';
import { SubjectOption } from '../types';

interface SubjectCardProps {
  subject: SubjectOption;
  isSelected: boolean;
  onClick: (id: string) => void;
}

export const SubjectCard: React.FC<SubjectCardProps> = ({ subject, isSelected, onClick }) => {
  return (
    <button
      type="button"
      onClick={() => onClick(subject.id)}
      className={`
        relative flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-300 border
        ${isSelected 
          ? `ring-2 ring-offset-2 ring-brand-500 scale-105 shadow-md ${subject.color}` 
          : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-slate-300'
        }
      `}
    >
      <span className="text-3xl mb-2 filter drop-shadow-sm">{subject.icon}</span>
      <span className="text-sm font-semibold tracking-wide">{subject.label}</span>
      {isSelected && (
        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-current animate-pulse" />
      )}
    </button>
  );
};
