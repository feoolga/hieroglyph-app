import { useState, useEffect, useMemo } from 'react';
import './GuessCharacterGame.css';
import { basicCharacters } from '../../data/characters/basic.js';

export const GuessCharacterGame = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [shuffledAnswers, setShuffledAnswers] = useState([]);
  const [showContinue, setShowContinue] = useState(false);

  // useMemo чтобы gameData не пересоздавался при каждом рендере
  const gameData = useMemo(() => {
    return basicCharacters.map(character => ({
      image: character.image,
      correctAnswer: character.character,
      answers: basicCharacters
        .filter(c => c.id !== character.id)
        .map(c => c.character)
        .slice(0, 3),
      meaning: character.meaning
    }));
  }, []); // Зависимости пустые - создается один раз

  const currentQuestion = gameData[currentQuestionIndex];

  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // Убрал currentQuestion из зависимостей
  useEffect(() => {
    if (!currentQuestion) return; // Защита от undefined
    
    const allAnswers = [
      currentQuestion.correctAnswer,
      ...currentQuestion.answers
    ];
    
    const shuffled = shuffleArray(allAnswers);
    setShuffledAnswers(shuffled);
  }, [currentQuestionIndex]); // Только при изменении индекса

  const handleAnswerSelect = (answer) => {
    if (isAnswered) return;

    setSelectedAnswer(answer);
    setIsAnswered(true);
    setShowContinue(true);
  };

  const handleContinue = () => {
    setSelectedAnswer(null);
    setIsAnswered(false);
    setShowContinue(false);
    setCurrentQuestionIndex((prevIndex) => (prevIndex + 1) % gameData.length);
  };

  // Упростил логирование
  useEffect(() => {
    console.log('Текущий вопрос:', currentQuestionIndex + 1);
  }, [currentQuestionIndex]);

  if (!currentQuestion) {
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