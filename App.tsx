import React, { useState } from 'react';
import { GameMode, GameTheme, Question, Difficulty } from './types';
import { generateQuestions } from './services/geminiService';
import { GameCard } from './components/GameCard';
import { Quiz } from './components/Quiz';
import { Button } from './components/Button';
import { DifficultySelector } from './components/DifficultySelector';

// Theme Configuration
const THEMES: Record<GameMode, GameTheme> = {
  [GameMode.CAPITALS]: {
    bg: 'bg-blue-100',
    primary: 'blue-500',
    secondary: 'blue-200',
    accent: 'blue-600',
    icon: '🏛️'
  },
  [GameMode.FLAGS]: {
    bg: 'bg-red-100',
    primary: 'red-500',
    secondary: 'red-200',
    accent: 'red-600',
    icon: '🚩'
  },
  [GameMode.CONTINENTS]: {
    bg: 'bg-green-100',
    primary: 'green-500',
    secondary: 'green-200',
    accent: 'green-600',
    icon: '🌍'
  },
  [GameMode.CITIES]: {
    bg: 'bg-yellow-100',
    primary: 'yellow-500',
    secondary: 'yellow-200',
    accent: 'yellow-600',
    icon: '🏙️'
  },
  [GameMode.FEATURES]: {
    bg: 'bg-purple-100',
    primary: 'purple-500',
    secondary: 'purple-200',
    accent: 'purple-600',
    icon: '🌋'
  },
};

const App: React.FC = () => {
  const [currentMode, setCurrentMode] = useState<GameMode | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>('Easy');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const startGame = async (mode: GameMode) => {
    setCurrentMode(mode);
    setIsLoading(true);
    setIsFinished(false);
    
    // Fetch questions from Gemini
    const qs = await generateQuestions(mode, difficulty, 5);
    setQuestions(qs);
    setIsLoading(false);
  };

  const handleQuizComplete = (score: number, total: number) => {
    setFinalScore(score);
    setIsFinished(true);
  };

  const handleReturnToMenu = () => {
    setCurrentMode(null);
    setQuestions([]);
    setIsFinished(false);
    setFinalScore(0);
  };

  // 1. Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-blue-50 flex flex-col items-center justify-center p-4">
        <div className="text-6xl mb-6 animate-bounce">
           {currentMode && THEMES[currentMode].icon}
        </div>
        <h2 className="text-3xl font-bold text-blue-900 mb-2">Creating your quiz...</h2>
        <p className="text-blue-600 mb-2">Level: {difficulty}</p>
        <p className="text-blue-600">Our AI robot is thinking of fun questions!</p>
        <div className="mt-8 w-64 h-4 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 animate-pulse w-2/3 rounded-full"></div>
        </div>
      </div>
    );
  }

  // 2. Results State
  if (isFinished && currentMode) {
    const theme = THEMES[currentMode];
    const percentage = (finalScore / questions.length) * 100;
    
    let message = "Good effort!";
    if (percentage === 100) message = "Perfect Score! 🌟";
    else if (percentage >= 80) message = "Amazing Job! 🎉";
    else if (percentage >= 50) message = "Great Try! 👍";

    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-[0_10px_0_0_rgba(0,0,0,0.1)]">
          <div className="text-8xl mb-4">
            {percentage >= 80 ? '🏆' : percentage >= 50 ? '🌟' : '📚'}
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">{message}</h1>
          <p className="text-xl text-gray-500 mb-8">
            You got <span className="font-bold text-blue-600">{finalScore}</span> out of <span className="font-bold">{questions.length}</span> correct!
          </p>
          
          <div className="space-y-4">
            <Button variant="primary" size="lg" onClick={() => startGame(currentMode)}>
              Play Again 🔄
            </Button>
            <Button variant="outline" size="lg" onClick={handleReturnToMenu}>
              Pick New Game 🏠
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // 3. Quiz State
  if (currentMode && questions.length > 0) {
    return (
      <div className={`min-h-screen ${THEMES[currentMode].bg} py-8 px-4 flex flex-col items-center`}>
        <div className="w-full max-w-4xl">
           <Quiz 
             questions={questions} 
             onComplete={handleQuizComplete} 
             onExit={handleReturnToMenu}
             mode={currentMode}
           />
        </div>
      </div>
    );
  }

  // 4. Menu State (Default)
  return (
    <div className="min-h-screen bg-sky-50 py-12 px-4 relative overflow-hidden">
      {/* Decorative Blobs */}
      <div className="blob bg-purple-300 w-64 h-64 rounded-full top-0 left-0 -ml-20 -mt-20"></div>
      <div className="blob bg-yellow-200 w-96 h-96 rounded-full bottom-0 right-0 -mr-32 -mb-32"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-10">
          <div className="inline-block p-4 rounded-full bg-white shadow-lg mb-6 transform hover:scale-110 transition-transform">
             <span className="text-6xl">🌍</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-blue-900 mb-4 tracking-tight">
            Geo<span className="text-blue-500">Explorer</span> Kids
          </h1>
          <p className="text-xl text-blue-600 font-medium">
            Explore the world, collect stars, and learn cool facts!
          </p>
        </div>

        {/* Difficulty Selector */}
        <DifficultySelector selected={difficulty} onSelect={setDifficulty} />

        <div className="flex flex-wrap justify-center gap-6">
          {(Object.keys(THEMES) as GameMode[]).map((mode) => (
            <div key={mode} className="w-full sm:w-[calc(50%-1.5rem)] lg:w-[calc(25%-1.5rem)] min-w-[240px]">
              <GameCard
                mode={mode}
                theme={THEMES[mode]}
                onClick={startGame}
              />
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
            <p className="text-gray-400 font-medium text-sm">
              Powered by AI • Built for little explorers
            </p>
        </div>
      </div>
    </div>
  );
};

export default App;