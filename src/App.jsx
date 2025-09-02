// App.jsx
import { useState } from 'react';
import { Header } from './shared/components/Header';
import { Button } from './shared/components/Button';
import { Card } from './shared/components/Card';
import { GuessCharacterGame } from './features/GuessCharacterGame/GuessCharacterGame';
import './App.css';

function App() {
  // Состояние для переключения между экранами
  const [isGameStarted, setIsGameStarted] = useState(false);

  const handleStartGame = () => {
    setIsGameStarted(true);
  };

  // Рендерим либо игровой экран, либо главное меню
  return (
    <>
      <Header title="Иероглик" />
      <main className="main-content">
        {isGameStarted ? (
          <GuessCharacterGame />
        ) : (
          <>
            <Card>
              <h2>Ни хао, друг!</h2>
              <p>Давай отправимся в волшебный мир китайских иероглифов!</p>
            </Card>
            <Card>
              <p>Готов узнать, как иероглиф «дерево» превратился в «лес»?</p>
              <div className="card__actions">
                <Button onClick={handleStartGame}>Начать игру!</Button>
              </div>
            </Card>
          </>
        )}
      </main>
    </>
  );
}

export default App;