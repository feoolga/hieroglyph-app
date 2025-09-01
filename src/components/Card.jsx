// src/components/Card.jsx
import './Card.css';

export const Card = ({ children, className = '' }) => {
  // Объединяем классы: базовый 'card' и любой переданный извне
  const cardClass = `card ${className}`.trim();
  
  return (
    <div className={cardClass}>
      {children}
    </div>
  );
};