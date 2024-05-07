/*
    I took a lot of notes from the A03 code when designing this
*/

import {AU} from './anagrams_utils.js';

export class AnagramsModel extends EventTarget {

    #game_state
    #letter_bank
    #letter_count
    #text_input
    #word_log

    constructor() {
        super();
        this.#game_state = "uninitialized";
        this.#letter_bank = [];
        this.#letter_count = 7;
        this.#text_input = [];
        this.#word_log = [];
    }

    initialize() {
        if (this.#game_state != 'uninitialized') return;

        this.#letter_count = 7;
        this.#letter_bank = this.generateLetterBank();
        this.#text_input = [];
        this.#word_log = [];
    }

    generateLetterBank() {
        this.#letter_bank = [];
        for (let i = 0; i < this.getLetterCount(); i++) {
            const letter_ind = Math.floor(Math.random() * AU.characters.length);
            const letter = AU.characters.at(letter_ind);
            this.#letter_bank.push(letter);
        }
    }

    getLetterBank() {
        return this.#letter_bank;
    }

    getLetterCount() {
        return this.#letter_count;
    }

    getScore() {
        return this.getWordLog().reduce((total_score, word) => total_score += 100 + 300 * (word.length - 3));
    }

    getTextInput() {
        return this.#text_input;
    }

    getTextInputAsWord() {
        return this.getTextInput().join("");
    }

    getWordLog() {
        return this.#word_log;
    }

    addToTextInput(char) {
        if (typeof char != 'string' || char.length != 1 || !AU.characters.includes(char)) {
            return;
        }
        this.#text_input.push(char);
        this.dispatchEvent(new Event('textinputupdate'));
    }

    backspaceTextInput() {
        this.#text_input.pop();
        this.dispatchEvent(new Event('textinputupdate'));
    }

    clearTextInput() {
        this.#text_input = [];
        this.dispatchEvent(new Event('textinputupdate'));
    }

}