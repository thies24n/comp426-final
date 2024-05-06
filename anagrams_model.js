/*
    I took a lot of notes from the A03 code when designing this
*/

export class AnagramsModel extends EventTarget {
    
    #game_state
    #letter_bank
    #score
    #word_log

    constructor() {
        super();
        this.#game_state = "uninitialized";
        this.#letter_bank = new Set();
        this.#score = 0;
        this.#word_log = [];
    }

    initialize() {
        if (this.#game_state != 'uninitialized') return;

        this.#score = 0;
        this.#word_log = [];
        this.#letter_bank = generateLetterBank();
    }

    generateLetterBank() {
        // TODO
    }

}