import { useState, useEffect } from "react";
import "./App.css";
import VoiceInputButton from "./VoiceInputButton";
import VirtualKeyboard from "./VirtualKeyboard";
import WordDisplay from "./WordDisplay";
import HangmanDrawing from "./HangmanDrawing";
import { wordList } from "./words";

function App() {
  
  const speechSynthesisSupported = "speechSynthesis" in window;

  // Initial fetch of preferred voice
  const getPreferredVoice = () => {
    let voices = window.speechSynthesis.getVoices();
    const preferredVoicesOrder = [
      'Google UK English Male',
      'Daniel (English (United Kingdom))',
      'Google UK English Female',
      'Google US English'
    ];

    for(let preferredVoice of preferredVoicesOrder) {
      const foundVoice = voices.find(voice => voice.name === preferredVoice);
      if(foundVoice) {
        return foundVoice;
      }
    }

    return null; // fallback to the default voice
  }

  const [preferredVoice, setPreferredVoice] = useState(getPreferredVoice());

  // Listening for voicechanged 
  useEffect(() => {
    if(!preferredVoice) {
      const setVoiceWhenAvailable = () => {
        setPreferredVoice(getPreferredVoice());
      };
      window.speechSynthesis.onvoiceschanged = setVoiceWhenAvailable;
    }
  }, [preferredVoice]);

  const speak = (text) => {
    if (!speechSynthesisSupported || !preferredVoice) {
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en"; 
    utterance.voice = preferredVoice;

    // Stop any ongoing speech before starting
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const getRandomWord = (words) => {
    return words[Math.floor(Math.random() * words.length)];
  };

  const [wordObj, setWordObj] = useState(getRandomWord(wordList));
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [incorrectGuesses, setIncorrectGuesses] = useState([]);

  const [hasWon, setHasWon] = useState(false);
  const [hasLost, setHasLost] = useState(false);

  const resetGame = () => {
    // Set all states to their initial values
    setWordObj(getRandomWord(wordList)); 
    setGuessedLetters([]);
    setIncorrectGuesses([]);
    setHasWon(false);
    setHasLost(false);
  };

  const handleLetterGuess = (letter) => {
    // Check if the letter has already been guessed (either correctly or incorrectly)
    if (guessedLetters.includes(letter) || incorrectGuesses.includes(letter)) {
      return; 
    }

    // If the letter is part of the word, add it to the guessedLetters.
    if (wordObj.word.includes(letter)) {
      setGuessedLetters((prevLetters) => [...prevLetters, letter]);
    } else {
      // If not, it's an incorrect guess.
      setIncorrectGuesses((prevIncorrect) => [...prevIncorrect, letter]);
    }

    // Check for win condition
    setGuessedLetters((prevLetters) => {
      if (wordObj.word.split("").every((char) => prevLetters.includes(char))) {
        setHasWon(true);
      }
      return prevLetters; 
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
