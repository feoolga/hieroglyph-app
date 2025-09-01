// src/components/Header.jsx
import './Header.css';

export const Header = ({ title }) => {
  return (
    <header className="header">
      <h1>{title}</h1>
    </header>
  );
};