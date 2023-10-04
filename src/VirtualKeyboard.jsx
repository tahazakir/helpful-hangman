import React, { useState } from 'react';

const VirtualKeyboard = ({ onLetterClick }) => {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');

    const handleClick = (letter) => {
        onLetterClick(letter);
    };

    return (
        <div className="keyboard">
            {alphabet.map(letter => (
                <button 
                    key={letter}
                    onClick={() => handleClick(letter)}
                >
                    {letter.toUpperCase()}
                </button>
            ))}
        </div>
    );
};

export default VirtualKeyboard;
