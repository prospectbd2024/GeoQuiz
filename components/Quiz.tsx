import React, { useEffect, useState } from 'react';
import { Question, GameMode } from '../types';
import { Button } from './Button';
import confetti from 'canvas-confetti';

interface QuizProps {
  questions: Question[];
  onComplete: (score: number, total: number) => void;
  onExit: () => void;
  mode: GameMode;
}

export const Quiz: React.FC<QuizProps> = ({ questions, onComplete, onExit, mode }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    // Reset state for new question
    setSelectedOption(null);
    setIsCorrect(null);
    setShowExplanation(false);
  }, [currentIndex]);

  const handleOptionClick = (option: string) => {
    if (selectedOption !== null) return; // Prevent changing answer

    const correct = option === currentQuestion.correctAnswer;
    setSelectedOption(option);
    setIsCorrect(correct);
    
    if (correct) {
      setScore(s => s + 1);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#60A5FA', '#34D399', '#FBBF24', '#F87171']
      });
    }

    // Show explanation immediately after guessing
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(c => c + 1);
    } else {
      onComplete(score, questions.length);
    }
  };

  // Helper function to render text with **bold** markers
  const renderStyledText = (text: string) => {
    const parts = text.split('**');
    return parts.map((part, index) => {
      // Odd indices are the content inside **markers**
      if (index % 2 === 1) {
        return (
          <span key={index} className="font-extrabold text-blue-600 px-1 inline-block transform hover:scale-105 transition-transform cursor-default">
            {part}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  const progressPercent = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto w-full">
      {/* Header / Progress */}
      <div className="mb-8 flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm">
        <button onClick={onExit} className="text-gray-400 hover:text-red-500 font-bold">
          ✕ Exit
        </button>
        <div className="flex-1 mx-4 h-4 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="font-bold text-gray-600">
          {currentIndex + 1}/{questions.length}
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-3xl p-8 shadow-[0_8px_0_0_rgba(0,0,0,0.1)] mb-6">
        <div className="text-center mb-8">
          <span className="inline-block px-4 py-1 rounded-full bg-blue-100 text-blue-600 text-sm font-bold mb-4 uppercase tracking-wide">
            {mode}
          </span>
          
          {/* Flag Image or Emoji Display */}
          {currentQuestion.countryCode ? (
            <div className="flex justify-center mb-6">
              <img 
                src={`https://flagcdn.com/w2560/${currentQuestion.countryCode.toLowerCase()}.png`}
                alt="Flag"
                className="h-32 md:h-40 rounded-xl shadow-md animate-bounce object-cover"
                style={{ animationDuration: '2s' }}
              />
            </div>
          ) : currentQuestion.emoji && (
            <div className="text-8xl mb-6 animate-bounce">
              {currentQuestion.emoji}
            </div>
          )}

          <h2 className="text-3xl font-bold text-gray-800 leading-tight">
            {renderStyledText(currentQuestion.questionText)}
          </h2>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentQuestion.options.map((option, idx) => {
            let buttonVariant: 'outline' | 'primary' | 'danger' | 'secondary' = 'outline';
            let isDisabled = false;

            if (selectedOption !== null) {
              isDisabled = true;
              if (option === currentQuestion.correctAnswer) {
                buttonVariant = 'secondary'; // Correct answer always green/yellow
              } else if (option === selectedOption) {
                buttonVariant = 'danger'; // Wrong selection
              }
            }

            // Custom style overrides for feedback colors
            let customClass = "";
            if (selectedOption !== null) {
               if (option === currentQuestion.correctAnswer) {
                 customClass = "!bg-green-500 !text-white !border-green-600 !shadow-[0_4px_0_0_#15803d]"; 
               } else if (option === selectedOption) {
                 customClass = "!bg-red-500 !text-white !border-red-600 !shadow-[0_4px_0_0_#b91c1c]";
               } else {
                 customClass = "opacity-50";
               }
            }

            return (
              <Button
                key={idx}
                variant={buttonVariant}
                size="lg"
                onClick={() => handleOptionClick(option)}
                disabled={isDisabled}
                className={`text-lg transition-all duration-300 ${customClass}`}
              >
                {option}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Explanation & Next Button */}
      {showExplanation && (
        <div className="animate-fade-in-up">
          <div className={`p-6 rounded-2xl mb-6 flex items-start gap-4 ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-900'}`}>
            <div className="text-4xl">
              {isCorrect ? '🎉' : '🤔'}
            </div>
            <div>
              <h4 className="font-bold text-xl mb-1">
                {isCorrect ? 'That\'s right!' : 'Nice try!'}
              </h4>
              <p className="text-lg opacity-90">
                {currentQuestion.explanation}
              </p>
            </div>
          </div>
          
          <Button 
            variant="primary" 
            size="lg" 
            onClick={handleNext}
            className="w-full shadow-[0_6px_0_0_rgba(29,78,216,1)] hover:shadow-[0_4px_0_0_rgba(29,78,216,1)]"
          >
            {currentIndex === questions.length - 1 ? 'Finish Quiz 🏆' : 'Next Question ➜'}
          </Button>
        </div>
      )}
    </div>
  );
};