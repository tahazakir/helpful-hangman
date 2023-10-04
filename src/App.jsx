import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import VoiceInputButton from "./VoiceInputButton";
import VirtualKeyboard from "./VirtualKeyboard";
import WordDisplay from "./WordDisplay";
import HangmanDrawing from "./HangmanDrawing";
import { wordList } from "./words";

function App() {
  const speechSynthesisSupported = "speechSynthesis" in window;

  const getRandomWord = (words) => {
    return words[Math.floor(Math.random() * words.length)];
  };

  const [wordObj, setWordObj] = useState(getRandomWord(wordList));
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [incorrectGuesses, setIncorrectGuesses] = useState([]);

  const [hasWon, setHasWon] = useState(false);
  const [hasLost, setHasLost] = useState(false);

  const speak = (text) => {
    if (!speechSynthesisSupported) {
      console.error("TTS not supported in this browser.");
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US"; // Set the language to English

    // Stop any ongoing speech before starting
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const resetGame = () => {
    // Set all states to their initial values
    setWordObj(getRandomWord(wordList)); // Or you can randomize this from a list if you wish
    setGuessedLetters([]);
    setIncorrectGuesses([]);
    setHasWon(false);
    setHasLost(false);
  };

  const handleLetterGuess = (letter) => {
    // Check if the letter has already been guessed (either correctly or incorrectly)
    if (guessedLetters.includes(letter) || incorrectGuesses.includes(letter)) {
      return; // Don't process further if already guessed
    }

    // If the letter is part of the word, add it to the guessedLetters.
    if (wordObj.word.includes(letter)) {
      setGuessedLetters((prevLetters) => [...prevLetters, letter]);
    } else {
      // If not, it's an incorrect guess.
      setIncorrectGuesses((prevIncorrect) => [...prevIncorrect, letter]);
    }

    // Check for win condition using a callback to ensure we're working with the most recent state
    setGuessedLetters((prevLetters) => {
      if (wordObj.word.split("").every((char) => prevLetters.includes(char))) {
        setHasWon(true);
      }
      return prevLetters; // Return the same list without modification
    });

    // Check for loss condition in a similar manner
    setIncorrectGuesses((prevIncorrect) => {
      if (prevIncorrect.length >= 8) {
        setHasLost(true);
      }
      return prevIncorrect;
    });
  };

  useEffect(() => {
    // Generate the current word state
    const currentWordState = wordObj.word
      .split("")
      .filter((letter) => guessedLetters.includes(letter))
      .join("");

    // Read out the current word state using the speak function
    speak(currentWordState);
  }, [guessedLetters]);

  return (
    <div className="App">
      <h1>Helpful Hangman</h1>

      {/* Game Status Messages */}
      {hasWon && (
        <div className="win-message">
          Congratulations! You've won!
          <button className="reset-button" onClick={resetGame}>
            Try Again
          </button>
        </div>
      )}
      {hasLost && (
        <div className="loss-message">
          Sorry! You've lost. The word was: {wordObj.word.toUpperCase()}
          <button className="reset-button" onClick={resetGame}>
            Try Again
          </button>
        </div>
      )}

      <div className="game-container">
        <div className="left-column">
          <WordDisplay word={wordObj.word} guessedLetters={guessedLetters} />
          <div className="hint">Hint: {wordObj.hint}</div>
          <VirtualKeyboard
            onLetterClick={handleLetterGuess}
            disabledLettersCorrect={guessedLetters}
            disabledLettersIncorrect={incorrectGuesses}
          />
        </div>

        <div className="right-column">
          <div className="drawing-border">
            <HangmanDrawing incorrectGuessCount={incorrectGuesses.length} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
