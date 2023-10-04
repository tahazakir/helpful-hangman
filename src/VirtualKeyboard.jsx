import React, { useState } from 'react';

const VirtualKeyboard = ({ onLetterClick, disabledLettersCorrect, disabledLettersIncorrect  }) => {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');

    const handleClick = (letter) => {
        onLetterClick(letter);
    };

    const getButtonStyle = (letter) => {
        if (disabledLettersCorrect.includes(letter)) {
            return "correct";
        } 
        if (disabledLettersIncorrect.includes(letter)) {
            return "incorrect";
        }
        return "";
    };

    return (
        <div className="keyboard">
            {alphabet.map(letter => (
                <button 
                    key={letter}
                    onClick={() => onLetterClick(letter)}
                    disabled={disabledLettersCorrect.includes(letter) || disabledLettersIncorrect.includes(letter)}
                    className={getButtonStyle(letter)}
                >
                    {letter.toUpperCase()}
                </button>
            ))}
        </div>
    );
};

export default VirtualKeyboard;
