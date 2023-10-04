import React from 'react';

function HangmanDrawing({ incorrectGuessCount }) {
    return (
        <svg width="200" height="250" className="hangman">
            {/* Base */}
            {incorrectGuessCount > 0 && <line x1="20" y1="230" x2="180" y2="230" stroke="white" />}
            
            {/* Gallows vertical */}
            {incorrectGuessCount > 1 && <line x1="50" y1="230" x2="50" y2="30" stroke="white" />}
            
            {/* Gallows horizontal */}
            {incorrectGuessCount > 2 && <line x1="50" y1="30" x2="150" y2="30" stroke="white" />}
            
            {/* Rope */}
            {incorrectGuessCount > 3 && <line x1="150" y1="30" x2="150" y2="50" stroke="white" />}
            
            {/* Head */}
            {incorrectGuessCount > 4 && <circle cx="150" cy="70" r="20" stroke="white" fill="none" />}
            
            {/* Body */}
            {incorrectGuessCount > 5 && <line x1="150" y1="90" x2="150" y2="130" stroke="white" />}
            
            {/* Arms (Both left and right in a single stage) */}
            {incorrectGuessCount > 6 && (
                <>
                    <line x1="150" y1="100" x2="130" y2="120" stroke="white" />
                    <line x1="150" y1="100" x2="170" y2="120" stroke="white" />
                </>
            )}
        </svg>
    );
}

export default HangmanDrawing;
