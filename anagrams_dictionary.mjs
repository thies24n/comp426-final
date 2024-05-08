import * as fs from 'node:fs';
import {AU} from './public/anagrams_utils.mjs';
import { response } from 'express';

export class AnagramsDictionary {

    #starter_word

    static #SKIP_LINES = 2;
    static #DICTIONARY = fs.readFileSync('dictionary.txt', 'utf8').split('\n').slice(this.#SKIP_LINES);

    constructor(starter_word) {
        this.#starter_word = starter_word;
    }

    static create(letter_count=7) {
        // Generate starter word
        let starter = "";
        while(starter.length != letter_count || !AU.getHasValidVowelRatio(starter)) {
            starter = this.#DICTIONARY[Math.floor(Math.random() * this.#DICTIONARY.length)];
        }

        starter = this.#shuffleString(starter);
        return new AnagramsDictionary(starter);
    }

    static isWord(word) {
        // Basically, checks if the word is in dictionary.txt
        const dictionary = this.#DICTIONARY;

        // Binary search
        let a = this.#SKIP_LINES;
        let b = dictionary.length - 1;

        while (a <= b) {
            let mid = Math.floor((a + b) / 2);
            let word_m = dictionary[mid];
            let comparison = word_m.localeCompare(word);

            if (comparison == 0) {
                return true;
            } else if (comparison > 0) {
                b = mid - 1;
            } else {
                a = mid + 1;
            }
        }

        return false;
    }

    static async getMissingWords(game, filter_profanity=true) {
        let valid_anagrams = game.getDictionary().getAllValidAnagrams();
        let word_log = game.getWordLog();

        valid_anagrams = valid_anagrams.filter((word) => !word_log.includes(word));
        if (filter_profanity) {
            let res = null;
            try {
                res = await fetch("https://www.purgomalum.com/service/json?text="
                + JSON.stringify(valid_anagrams).split(",").join(", "), {method: "GET"})
                .then(response => response.json())
                .then(response => JSON.parse(response.result));
            } catch (error) {
                console.log(error);
            }
            if (res) {
                return res;
            }
        }
        return valid_anagrams;
    }

    isAnagram(word) {
        const letters = this.getStarterWord().split("");
        return word.split("").every((char) => {
            for (let i = 0; i < letters.length; i++) {
                if (letters[i] == char) {
                    letters[i] = null;
                    break;
                }
                if (i + 1 == letters.length) {
                    return false;
                }
            }
            return true;
        });
    }

    isValidAnagram(word) {
        return this.isAnagram(word) && AnagramsDictionary.isWord(word);
    }

    getAllValidAnagrams() {
        let starter_word = this.getStarterWord();
        const letters = [...new Set(starter_word.split(""))];
        let res = letters.slice();
        let anagrams = letters.slice();

        for (let i = 1; i < starter_word.length; i++) {
            anagrams = anagrams.flatMap((prefix) => letters.map((char) => prefix + char));
            res = res.concat(anagrams);
        }

        return res.filter((word) => word.length >= 3 && this.isValidAnagram(word));
    }

    getStarterWord() {
        return this.#starter_word;
    }

    json() {
        return {
            starter_word: this.getStarterWord()
        }
    }

    // Helper functions

    static #shuffleString(str) {
        const chars = str.split('');
        
        for (let i = chars.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let temp = chars[i];
            chars[i] = chars[j];
            chars[j] = temp;
        }
        
        return chars.join('');
    }
}
