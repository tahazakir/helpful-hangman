import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import VoiceInputButton from './VoiceInputButton';
import VirtualKeyboard from './VirtualKeyboard';

function App() {
  

  return (
    <div className="App">
      <h1>Helpful Hangman</h1>
      <VirtualKeyboard />
    </div>
  )
}

export default App
