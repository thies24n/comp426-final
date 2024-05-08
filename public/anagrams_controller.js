import {AU} from './anagrams_utils.mjs';

export class AnagramsController {

    #model

    constructor(model) {
        this.#model = model;
    }

    startGame(letter_count=7) {
        this.#model.initialize();
    }

    async handleKeyPress(key) {
        if (key == "ENTER") {
            await this.submitWord(this.#model.getTextInputAsWord());
            return;
        } else if (key == "BACKSPACE") {
            this.#model.backspaceTextInput();
            return;
        } else {
            this.#model.addToTextInput(key);
            return;
        }
    }

    async submitWord(word) {
        let isValid = word.length >= 3;
        isValid &&= !this.#model.getWordLog().includes(word);
        isValid &&= await fetch(AU.base_url + "game/submit/" + this.#model.getGameID()
            + "?word=" + this.#model.getTextInputAsWord(), {method: "POST"})
            .then(response => response.json());

        if (isValid) {
            this.#model.clearTextInput();
            this.#model.addToWordLog(word);
        }
    }

}