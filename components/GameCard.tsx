import React from 'react';
import { GameMode, GameTheme } from '../types';

interface GameCardProps {
  mode: GameMode;
  theme: GameTheme;
  onClick: (mode: GameMode) => void;
}

export const GameCard: React.FC<GameCardProps> = ({ mode, theme, onClick }) => {
  return (
    <div 
      onClick={() => onClick(mode)}
      className={`
        cursor-pointer 
        transform transition-all duration-300 hover:-translate-y-2 hover:rotate-1
        bg-white rounded-3xl p-6 
        shadow-[0_8px_0_0_rgba(0,0,0,0.1)] hover:shadow-[0_12px_0_0_rgba(0,0,0,0.15)]
        border-4 border-transparent hover:border-${theme.primary}
        flex flex-col items-center justify-center gap-4
        aspect-square
      `}
      style={{ borderColor: 'transparent' }} // Inline style reset
    >
      <div className={`text-6xl p-4 rounded-full ${theme.bg}`}>
        {theme.icon}
      </div>
      <h3 className="text-2xl font-bold text-gray-800 text-center">{mode}</h3>
      <span className={`text-sm font-bold px-3 py-1 rounded-full bg-gray-100 text-gray-500 uppercase tracking-wider`}>
        Start Quiz
      </span>
    </div>
  );
};