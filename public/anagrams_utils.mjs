export class AU {
    static base_url = "http://localhost:3000/";
    static characters = [
        "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", 
        "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"
    ];
    static vowels = ["A", "E", "I", "O", "U"];
    static consonants = this.characters.filter((char) => !this.vowels.includes(char));
    static letter_counts = [6, 7];

    static getHasValidVowelRatio = (word) => {
        const vowel_ratio = this.getVowelRatio(word);
        return vowel_ratio >= 0.333 && vowel_ratio <= 0.5;
    }

    static getVowelRatio = (word) => word.split("").filter((char) => AU.vowels.includes(char)).length / word.length;

    static getWordValue = (word) => 100 + 300 * (word.length - 3);
}