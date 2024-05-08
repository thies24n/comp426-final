/*
    I took a lot of notes from the A03 code when designing this
*/

import {AU} from './anagrams_utils.mjs';

export class AnagramsModel extends EventTarget {

    #game_id
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

    async initialize(letter_count = 7) {
        if (this.#game_state != 'uninitialized') return;

        this.#letter_count = letter_count;
        this.#text_input = [];
        this.#word_log = [];

        const game = await fetch(AU.base_url + "game/" + letter_count, {method: "POST"})
        .then(response => response.json());

        this.#game_id = game.id;
        this.#letter_bank = game.dictionary.starter_word.split("");

        this.updateState("playing");
    }

    async submitWord(word) {
        /* Submit a word and check for validity. */
        let res = await fetch(AU.base_url + "game/submit/" + this.getGameID()
            + "?word=" + this.getTextInputAsWord(), {method: "POST"})
            .then(response => response.json());

        if (res.is_valid) {
            this.clearTextInput();
            this.addToWordLog(word);
        }

        this.dispatchEvent(new CustomEvent('submitword', {detail: res}));
    }

    addToTextInput(char) {
        if (!this.getUsableChars().includes(char)) {
            return;
        }
        this.#text_input.push(char);
        this.dispatchEvent(new Event('textinputupdate'));
    }

    addToWordLog(word) {
        this.#word_log.push(word);
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

    getGameID() {
        return this.#game_id;
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
        return this.getWordLog().reduce((total_score, word) => total_score += AU.getWordValue(word));
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
        return lb_copy;
    }

    getWordLog() {
        return this.#word_log;
    }

}