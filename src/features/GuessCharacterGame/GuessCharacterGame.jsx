import { useState, useEffect, useMemo } from 'react';
import './GuessCharacterGame.css';
import { useGameLogic } from '../../shared/hooks/useGameLogic';
import { generateGameData } from '../../shared/utils/game';
// import { shuffleArray } from '../../shared/utils/array';
import { basicCharacters } from '../../data/characters/basic';

export const GuessCharacterGame = () => {
  // Подготавливаем данные для игры
  const gameData = useMemo(() => generateGameData(basicCharacters), []);

  if (!basicCharacters  || basicCharacters .length === 0) {
    return (
      <div className="error-screen">
        <h2>Ой! 🐼</h2>
        <p>Иероглифы куда-то спрятались...</p>
        <button onClick={() => window.location.reload()}>
          Попробовать снова
        </button>
      </div>
    );
  }
  
  // Используем наш кастомный хук
  const {
    currentIndex,
    currentQuestion,
    score,
    isCompleted,
    nextQuestion,
    addScore,
    progress,
    isLastQuestion,
    shuffledAnswers
  } = useGameLogic(gameData);

  // Локальное состояние для текущего вопроса
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showContinue, setShowContinue] = useState(false); // ← Добавил showContinue

  const handleAnswerSelect = (answer) => {
    if (isAnswered) return;

    setSelectedAnswer(answer);
    setIsAnswered(true);
    setShowContinue(true); // ← Показываем кнопку продолжить
    
    // Используем функции из хука
    if (answer === currentQuestion.correctAnswer) {
      addScore(1); // Добавляем 1 очко за правильный ответ
    }
  };

  const handleContinue = () => {
    setSelectedAnswer(null);
    setIsAnswered(false);
    setShowContinue(false);
    nextQuestion(); // Используем функцию из хука
  };

  // Защита от undefined
  if (!currentQuestion || !shuffledAnswers) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="game-screen">
      <h2>Угадай иероглиф!</h2>
      
      <div className="game-question">
        <img 
          src={currentQuestion.image} 
          alt="Что это?" 
          className="question-image"
        />
        <p>Выбери правильный иероглиф</p>
      </div>

      <div className="answers-grid">
        {shuffledAnswers.map((answer, index) => {
          const isCorrect = answer === currentQuestion.correctAnswer;
          const isSelected = answer === selectedAnswer;
          
          let buttonClass = 'answer-button';
          if (isAnswered) {
            if (isCorrect) buttonClass += ' answer-button--correct';
            if (isSelected && !isCorrect) buttonClass += ' answer-button--incorrect';
          }

          return (
            <button
              key={index}
              className={buttonClass}
              onClick={() => handleAnswerSelect(answer)}
              disabled={isAnswered}
            >
              {answer}
            </button>
          );
        })}
      </div>

      <div className="game-info">
        <span>Вопрос {currentIndex + 1} из {gameData.length}</span>
        <span>Счет: {score}</span>
        <progress value={progress} max="100">{progress}%</progress>
      </div>

      {isAnswered && (
        <div className="feedback">
          {selectedAnswer === currentQuestion.correctAnswer ? (
            <p className="feedback-correct">Правильно! Это {currentQuestion.meaning} 🎉</p>
          ) : (
            <p className="feedback-incorrect">
              Почти! Правильный ответ: {currentQuestion.correctAnswer} ({currentQuestion.meaning})
            </p>
          )}
        </div>
      )}

      {showContinue && (
        <button 
          className="continue-button"
          onClick={handleContinue}
        >
          Продолжить →
        </button>
      )}
    </div>
  );
};