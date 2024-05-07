import {AU} from './anagrams_utils.js';

export class AnagramsController {

    #model

    constructor(model) {
        this.#model = model;
    }

    startGame(letter_count=7) {
        this.#model.initialize();
    }

    handleKeyPress(key) {
        if (key == "ENTER") {
            return;
        } else if (key == "BACKSPACE") {
            this.#model.backspaceTextInput();
            return;
        } else if (AU.characters.includes(key)) {
            this.#model.addToTextInput(key);
            return;
        }
    }

    submitWord(word) {
        
    }

}