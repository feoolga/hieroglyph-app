// src/shared/hooks/useGameLogic.js
import { useState, useCallback, useMemo } from 'react';

/**
 * Кастомный хук для управления логикой игр
 * @param {Array} questions - массив вопросов для игры
 * @returns {Object} объект с состоянием и функциями для управления игрой
 */
export const useGameLogic = (questions) => {
  // 1. Состояние игры - храним данные, которые могут меняться
  const [currentIndex, setCurrentIndex] = useState(0); // Текущий индекс вопроса
  const [score, setScore] = useState(0); // Количество набранных очков
  const [isCompleted, setIsCompleted] = useState(false); // Завершена ли игра
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0); // Количество правильных ответов

  // 2. Вычисляемые значения - не храним в состоянии, а вычисляем на основе состояния
  const currentQuestion = questions[currentIndex]; // Текущий вопрос
  const totalQuestions = questions.length; // Общее количество вопросов

  // 3. useMemo - вычисляем значение один раз и запоминаем его
  const progress = useMemo(() => {
    // Вычисляем прогресс в процентах
    return ((currentIndex + 1) / totalQuestions) * 100;
  }, [currentIndex, totalQuestions]);

  // 4. useCallback - запоминаем функции, чтобы они не пересоздавались при каждом рендере
  const nextQuestion = useCallback(() => {
    // Переход к следующему вопросу
    if (currentIndex >= totalQuestions - 1) {
      // Если это последний вопрос - завершаем игру
      setIsCompleted(true);
    } else {
      // Иначе переходим к следующему вопросу
      setCurrentIndex(prevIndex => prevIndex + 1);
    }
  }, [currentIndex, totalQuestions]); // Зависимости - функция обновится если эти значения изменятся

  const previousQuestion = useCallback(() => {
    // Возврат к предыдущему вопросу
    if (currentIndex > 0) {
      setCurrentIndex(prevIndex => prevIndex - 1);
    }
  }, [currentIndex]);

  const resetGame = useCallback(() => {
    // Сброс игры к начальному состоянию
    setCurrentIndex(0);
    setScore(0);
    setIsCompleted(false);
    setCorrectAnswersCount(0);
  }, []); // Пустые зависимости - функция создается только один раз

  const addScore = useCallback((points = 1) => {
    // Добавление очков и увеличение счетчика правильных ответов
    setScore(prevScore => prevScore + points);
    setCorrectAnswersCount(prev => prev + 1);
  }, []);

  const subtractScore = useCallback((points = 1) => {
    // Вычитание очков (если нужна система штрафов)
    setScore(prevScore => Math.max(0, prevScore - points));
  }, []);

  // 5. Возвращаем объект со всем, что может понадобиться компоненту
  return {
    // СОСТОЯНИЕ ИГРЫ
    currentIndex,           // Текущий индекс вопроса (0, 1, 2...)
    currentQuestion,        // Данные текущего вопроса
    score,                  // Текущее количество очков
    isCompleted,            // Завершена ли игра (true/false)
    correctAnswersCount,    // Количество правильных ответов
    totalQuestions,         // Общее количество вопросов
    
    // ВЫЧИСЛЯЕМЫЕ ЗНАЧЕНИЯ
    progress,               // Прогресс в процентах (0-100)
    isFirstQuestion: currentIndex === 0,                    // Первый ли это вопрос?
    isLastQuestion: currentIndex === totalQuestions - 1,    // Последний ли это вопрос?
    correctAnswersPercentage: totalQuestions > 0 
      ? (correctAnswersCount / totalQuestions) * 100 
      : 0,                  // Процент правильных ответов

    // ФУНКЦИИ ДЛЯ УПРАВЛЕНИЯ ИГРОЙ
    nextQuestion,           // Перейти к следующему вопросу
    previousQuestion,       // Вернуться к предыдущему вопросу
    resetGame,             // Начать игру заново
    addScore,              // Добавить очки
    subtractScore,         // Вычесть очки
    
    // СЛУЖЕБНЫЕ ФУНКЦИИ
    goToQuestion: (index) => {
      // Перейти к конкретному вопросу по индексу
      if (index >= 0 && index < totalQuestions) {
        setCurrentIndex(index);
      }
    }
  };
};