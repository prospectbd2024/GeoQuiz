import React from 'react';
import { Difficulty } from '../types';

interface Props {
  selected: Difficulty;
  onSelect: (d: Difficulty) => void;
}

export const DifficultySelector: React.FC<Props> = ({ selected, onSelect }) => {
  const levels: { id: Difficulty; label: string; color: string; icon: string }[] = [
    { id: 'Easy', label: 'Easy Peasy', color: 'bg-green-100 text-green-700 border-green-300 hover:bg-green-200', icon: '🐣' },
    { id: 'Medium', label: 'Just Right', color: 'bg-yellow-100 text-yellow-700 border-yellow-300 hover:bg-yellow-200', icon: '🦊' },
    { id: 'Hard', label: 'Super Hard', color: 'bg-red-100 text-red-700 border-red-300 hover:bg-red-200', icon: '🦁' },
  ];

  return (
    <div className="flex flex-col items-center mb-10">
      <h3 className="text-gray-500 font-bold uppercase tracking-wider text-sm mb-4">Select Difficulty</h3>
      <div className="flex flex-wrap justify-center gap-4">
        {levels.map((level) => {
          const isSelected = selected === level.id;
          return (
            <button
              key={level.id}
              onClick={() => onSelect(level.id)}
              className={`
                relative px-6 py-3 rounded-2xl font-bold border-b-4 transition-all duration-200 flex items-center gap-2
                ${level.color}
                ${isSelected ? 'transform scale-110 shadow-lg border-b-4 brightness-95' : 'opacity-70 hover:opacity-100 hover:-translate-y-1'}
              `}
            >
              <span className="text-xl">{level.icon}</span>
              <span>{level.label}</span>
              {isSelected && (
                <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full animate-bounce">
                  ✓
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};