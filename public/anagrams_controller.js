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
        switch(this.#model.getGameState()) {
            case "gameover":
            case "uninitialized":
                return;

            // If game is running
            case "playing":
                if (key == "ENTER") {
                    await this.#model.submitWord(this.#model.getTextInputAsWord());
                    return;
                } else if (key == "BACKSPACE") {
                    this.#model.backspaceTextInput();
                    return;
                } else {
                    this.#model.addToTextInput(key);
                    return;
                }
                break;
        }
    }

}