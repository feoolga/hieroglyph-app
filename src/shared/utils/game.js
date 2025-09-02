// src/shared/utils/game.js
export const generateGameData = (characters) => {
  return characters.map(character => ({
    image: character.image,
    correctAnswer: character.character,
    answers: characters
      .filter(c => c.id !== character.id)
      .map(c => c.character)
      .slice(0, 3),
    meaning: character.meaning
  }));
};