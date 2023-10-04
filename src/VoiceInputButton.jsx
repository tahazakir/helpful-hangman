{/* Set up Component Structure for a button that listens to the user input when clicked and displays it on screen */}
import React from 'react'
import { useState } from 'react'

const VoiceInputButton = () => {
    const [output, setOutput] = useState('');

    let SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition
    let SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList
    let alphabets = ['I guess A', 'I guess B', 'I guess C', 'I guess D', 'I guess E', 'f', 'g', 'h', 'i','j','k','l','m','n','o','p','q','r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']

    let grammar = '#JSGF V1.0; grammar alphabet; public <alphabet> = ' + alphabets.join(' | ') + ';';

    let recognitionList = new SpeechGrammarList()
    recognitionList.addFromString(grammar, 1)

    const handleClick = () => {
        
        console.log('Button clicked');

        // Create a speech recognition object along with a grammar list and connect the two

        let recognition = new SpeechRecognition()
        recognition.grammars = recognitionList

        // Set language to english, listen to single word, no interim results or alternatives

        recognition.lang = 'en-US'
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.start()

        recognition.onstart = () => {
            console.log('Recognition started');
        };
        
        recognition.onaudiostart = () => {
            console.log('Audio capturing started');
        };
        
        
        recognition.onresult = (event) => {

            console.log('SpeechRecognition onresult');

            // Get guess phrase
            let guessPhrase = event.results[0][0].transcript.toLowerCase().split(' ');
            
            console.log(guessPhrase)
            
            // Get letter guess
            let guess = guessPhrase[guessPhrase.length - 1];
            
            console.log(guess)

            let alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i','j','k','l','m','n','o','p','q','r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']

            // Check if guess is in alphabet
            if (alphabet.includes(guess)) {
                setOutput(`You said: ${guess}`);
            } else {
                setOutput('Invalid input. Please click the button and say "I guess {letter}".');
            }

        };

        recognition.onaudioend = () => {
            console.log('Audio capturing ended');
        };
        
        recognition.onend = () => {
            console.log('Recognition ended');
        };

        recognition.onspeechend = function() {
            console.log('SpeechRecognition onspeechend');
            recognition.stop();

        }
        
        recognition.onnomatch = function(event) {
        // diagnostic.textContent = "I didn't recognise that alphabet.";
            console.log('SpeechRecognition onnomatch');
        }
        
        recognition.onerror = function(event) {
        // diagnostic.textContent = 'Error occurred in recognition: ' + event.error;

            console.log('SpeechRecognition onerror');
        }
    
      };
      
    
    return (
      <div>
        <button onClick={handleClick}>I guess <i> letter </i></button>
        <p>{output}</p>
      </div>
    );
  };
  
  export default VoiceInputButton;

