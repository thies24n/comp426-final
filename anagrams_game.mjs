import { AnagramsDictionary } from "./anagrams_dictionary.mjs";


export class AnagramsGame {

    #id
    #dictionary
    #letter_count
    
    static #all_games = [];
    static #next_id = 0;

    constructor(id, dictionary) {
        this.#id = id;
        this.#dictionary = dictionary;
        this.#letter_count = dictionary.getStarterWord().length;
    }

    static create(letter_count=7) {
        const id = this.#next_id++;
        const dictionary = AnagramsDictionary.create(letter_count);
        const game = new AnagramsGame(id, dictionary);
        this.#all_games.push(game);
        return game;
    }

    static getGameFromID(id) { 
        return this.#all_games[id];
    }

    getID() {
        return this.#id;
    }

    getDictionary() {
        return this.#dictionary;
    }

    getLetterCount() {
        return this.#letter_count;
    }

    json() {
        return {
            id: this.getID(),
            dictionary: this.getDictionary().json(),
            letter_count: this.getLetterCount()
        }
    }

}