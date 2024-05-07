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
            this.submitWord(this.#model.getTextInputAsWord());
            return;
        } else if (key == "BACKSPACE") {
            this.#model.backspaceTextInput();
            return;
        } else {
            this.#model.addToTextInput(key);
            return;
        }
    }

    submitWord(word) {
        
    }

}