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
        console.log(this.#letter_bank);
        this.#text_input = [];
        this.#word_log = [];

        this.updateState("playing");
    }

    generateLetterBank() {
        // TODO: Make this just take a 7-letter word and scramble it
        const res = [];
        // Generate random letters
        for (let i = 0; i < this.getLetterCount(); i++) {
            const letter_ind = Math.floor(Math.random() * AU.characters.length);
            const letter = AU.characters.at(letter_ind);
            res.push(letter);
        }
        // At least 1/3 vowels and 1/2 consonants
        const vowel_ratio = res.filter((char) => AU.vowels.includes(char)).length / this.getLetterCount();
        if (vowel_ratio < 0.333 || vowel_ratio > 0.5) {
            return this.generateLetterBank();
        }
        return res;
    }

    addToTextInput(char) {
        if (!this.getUsableChars().includes(char)) {
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

    updateState(state) {
        this.#game_state = state;
        this.dispatchEvent(new Event('stateupdate'));
    }

    getGameState() {
        return this.#game_state;
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

    getUsableChars() {
        const lb_copy = this.getLetterBank().slice();
        const ti_copy = this.getTextInput().slice();
        for (let i = 0; i < this.getTextInput().length; i++) {
            const char = ti_copy.pop();
            const lb_index = lb_copy.findIndex((c) => c == char);
            lb_copy[lb_index] = null;
        }
        console.log(lb_copy);
        return lb_copy;
    }

    getWordLog() {
        return this.#word_log;
    }

}