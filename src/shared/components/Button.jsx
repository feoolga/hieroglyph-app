import './Button.css'; // Или используйте CSS-модули/styled-components

export const Button = ({ children, onClick, variant = 'primary' }) => {
  return (
    <button className={`button button--${variant}`} onClick={onClick}>
      {children}
    </button>
  );
};