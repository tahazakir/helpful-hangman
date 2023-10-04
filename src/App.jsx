import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import VoiceInputButton from "./VoiceInputButton";
import VirtualKeyboard from "./VirtualKeyboard";
import WordDisplay from "./WordDisplay";
import HangmanDrawing from "./HangmanDrawing";

function App() {
  const [word, setWord] = useState("hero"); // This can be randomized from a list later
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [incorrectGuesses, setIncorrectGuesses] = useState([]);

  const [hasWon, setHasWon] = useState(false);
  const [hasLost, setHasLost] = useState(false);

  const handleLetterGuess = (letter) => {
    // Check if the letter has already been guessed (either correctly or incorrectly)
    if (guessedLetters.includes(letter) || incorrectGuesses.includes(letter)) {
      return; // Don't process further if already guessed
    }

    // If the letter is part of the word, add it to the guessedLetters.
    if (word.includes(letter)) {
      setGuessedLetters((prevLetters) => [...prevLetters, letter]);
    } else {
      // If not, it's an incorrect guess.
      setIncorrectGuesses((prevIncorrect) => [...prevIncorrect, letter]);
    }

    // Check for win condition using a callback to ensure we're working with the most recent state
    setGuessedLetters((prevLetters) => {
      if (word.split("").every((char) => prevLetters.includes(char))) {
        setHasWon(true);
      }
      return prevLetters; // Return the same list without modification
    });

    // Check for loss condition in a similar manner
    setIncorrectGuesses((prevIncorrect) => {
      if (prevIncorrect.length >= 6) {
        setHasLost(true);
      }
      return prevIncorrect;
    });
  };

  return (
    <div className="App">
      <h1>Helpful Hangman</h1>

      {/* Game Status Messages */}
      {hasWon && (
        <div className="win-message">Congratulations! You've won!</div>
      )}
      {hasLost && (
        <div className="loss-message">
          Sorry! You've lost. The word was: {word.toUpperCase()}
        </div>
      )}

      <HangmanDrawing incorrectGuessCount={incorrectGuesses.length} />
      <WordDisplay word={word} guessedLetters={guessedLetters} />
      <div className="incorrect-guesses">
        Incorrect Guesses: {incorrectGuesses.join(", ").toUpperCase()}
      </div>
      <VirtualKeyboard onLetterClick={handleLetterGuess} />
    </div>
  );
}

export default App;
