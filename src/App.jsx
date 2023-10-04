import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import VoiceInputButton from './VoiceInputButton';
import VirtualKeyboard from './VirtualKeyboard';
import WordDisplay from './WordDisplay';

function App() {

  const [word, setWord] = useState("hero");  // This can be randomized from a list later
  const [guessedLetters, setGuessedLetters] = useState([]);
  
  const handleLetterGuess = (letter) => {
    // Ensure the letter isn't already in the guessedLetters array
    if (!guessedLetters.includes(letter)) {
        setGuessedLetters(prevLetters => [...prevLetters, letter]);
    }
  };

  return (
    <div className="App">
      <h1>Helpful Hangman</h1>
      <WordDisplay word={word} guessedLetters={guessedLetters} />
      <VirtualKeyboard onLetterClick={handleLetterGuess} />
    </div>
  )
}

export default App
