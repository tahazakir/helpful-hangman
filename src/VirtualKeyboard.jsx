import React, { useState } from 'react';

function VirtualKeyboard() {
    const [guessedLetters, setGuessedLetters] = useState([]);
    const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');

    const handleLetterClick = (letter) => {
        if (!guessedLetters.includes(letter)) {
            setGuessedLetters([...guessedLetters, letter]);
        }
    };

    return (
        <div>
            <div className="keyboard">
                {alphabet.map(letter => (
                    <button 
                        key={letter}
                        onClick={() => handleLetterClick(letter)}
                        disabled={guessedLetters.includes(letter)}
                    >
                        {letter.toUpperCase()}
                    </button>
                ))}
            </div>
            <div className="display">
                Guessed Letters: {guessedLetters.join(', ').toUpperCase()}
            </div>
        </div>
    );
}

export default VirtualKeyboard;
