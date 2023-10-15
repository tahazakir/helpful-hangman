import { useState, useEffect } from "react";
import "./App.css";
import VoiceInputButton from "./VoiceInputButton";
import VirtualKeyboard from "./VirtualKeyboard";
import WordDisplay from "./WordDisplay";
import HangmanDrawing from "./HangmanDrawing";
import { wordList } from "./words";

function App() {
  const speechSynthesisSupported = "speechSynthesis" in window;

  const getPreferredVoice = () => {
    let voices = window.speechSynthesis.getVoices();
    const preferredVoicesOrder = [
      "Google UK English Male",
      "Daniel (English (United Kingdom))",
      "Daniel",
      "Google UK English Female",
      "Google US English",
    ];

    for (let preferredVoice of preferredVoicesOrder) {
      const foundVoice = voices.find((voice) => voice.name === preferredVoice);
      if (foundVoice) {
        return foundVoice;
      }
    }

    // If none of the preferred voices are found, use the first available voice.
    return voices.length > 0 ? voices[0] : null;
  };

  const [preferredVoice, setPreferredVoice] = useState(getPreferredVoice());

  // Listening for voicechanged
  useEffect(() => {
    if (!preferredVoice) {
      const setVoiceWhenAvailable = () => {
        setPreferredVoice(getPreferredVoice());
      };
      window.speechSynthesis.onvoiceschanged = setVoiceWhenAvailable;
    }
  }, [preferredVoice]);

  // without silence

  // const speak = (text) => {
  //   if (!speechSynthesisSupported || !preferredVoice) {
  //     return;
  //   }

  //   const utterance = new SpeechSynthesisUtterance(text);
  //   utterance.lang = "en";
  //   utterance.voice = preferredVoice;

  //   // Stop any ongoing speech before starting
  //   window.speechSynthesis.cancel();
  //   window.speechSynthesis.speak(utterance);
  // };

  // With silence start

  const speak = (textArray) => {
    if (!speechSynthesisSupported || !preferredVoice) {
      return;
    }

    window.speechSynthesis.cancel();

    textArray.forEach((text, index) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en";
      utterance.voice = preferredVoice;

      if (index > 0) {
        utterance.onstart = () => {
          window.speechSynthesis.pause();
          setTimeout(() => window.speechSynthesis.resume(), 50);
        };
      }

      window.speechSynthesis.speak(utterance);
    });
  };

  // With silence end

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

  //without silence

  // useEffect(() => {
  //   // Generate the current word state
  //   const currentWordState = wordObj.word
  //     .split("")
  //     .filter((letter) => guessedLetters.includes(letter))
  //     .join("");

  //   // Read out the current word state using the speak function
  //   speak(currentWordState);
  // }, [guessedLetters]);

  // With silence start
  useEffect(() => {
    
    const wordWithConsecutiveUnderscoresReplaced = wordObj.word
      .split("")
      .map((letter) => (guessedLetters.includes(letter) ? letter : "_"))
      .join("")
      .replace(/_+/g, "_");

    const currentWordStateArray = wordWithConsecutiveUnderscoresReplaced
      .split("_")
      .filter((fragment) => fragment.length > 0);

    speak(currentWordStateArray);
  }, [guessedLetters]);

  // With silence end

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
