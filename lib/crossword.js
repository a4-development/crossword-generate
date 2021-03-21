"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Crossword = void 0;
const word_1 = require("./word");
class Crossword {
    constructor(baseWords) {
        this.baseWords = baseWords;
        this.words = [];
    }
    static initialize(baseWords) {
        const crossword = new Crossword(baseWords);
        return crossword;
    }
    generate(orderMap) {
        let words = [];
        let baseWords = orderMap.map((order) => this.baseWords[order]);
        words.push(new word_1.Word(baseWords[0].text, 'vertical', 0, 0, baseWords[0].id));
        baseWords = baseWords.filter((w) => w !== baseWords[0]);
        let idx = 0;
        while (1) {
            const w = this.searchMatchedWord(words[idx], baseWords, words);
            if (w !== null) {
                words.push(w);
                baseWords = baseWords.filter((baseWord) => baseWord.text !== w.text);
                idx++;
            }
            else {
                break;
            }
        }
        this.words = words;
    }
    searchMatchedWord(word, baseWords, words) {
        for (let i = 0; i < baseWords.length; i++) {
            if (word.direction === 'vertical') {
                for (let y = 0; y < word.text.length; y++) {
                    for (let x = 0; x < baseWords[i].text.length; x++) {
                        if (word.text[y] === baseWords[i].text[x]) {
                            const baseWord = new word_1.Word(baseWords[i].text, 'horizontal', word.head.x - x, word.head.y + y, baseWords[i].id);
                            if (!this.isOverwrapping(baseWord, words, word)) {
                                return baseWord;
                            }
                        }
                    }
                }
            }
            else if (word.direction === 'horizontal') {
                for (let x = 0; x < word.text.length; x++) {
                    for (let y = 0; y < baseWords[i].text.length; y++) {
                        if (word.text[x] === baseWords[i].text[y]) {
                            const baseWord = new word_1.Word(baseWords[i].text, 'vertical', word.head.x + x, word.head.y - y, baseWords[i].id);
                            if (!this.isOverwrapping(baseWord, words, word)) {
                                return baseWord;
                            }
                        }
                    }
                }
            }
        }
        return null;
    }
    isOverwrapping(baseWord, words, excludeWord) {
        return words.some((word) => {
            if (word.text === excludeWord.text) {
                return false;
            }
            else {
                if (baseWord.direction == 'vertical' && word.direction === 'vertical') {
                    return (baseWord.head.x - 1 < word.head.x &&
                        word.head.x < baseWord.head.x + 1 &&
                        (baseWord.head.y - 1 >= word.tail.y ||
                            baseWord.tail.y + 1 >= word.head.y));
                }
                else if (baseWord.direction == 'horizontal' &&
                    word.direction === 'horizontal') {
                    return (baseWord.head.y - 1 < word.head.y &&
                        word.head.y < baseWord.head.y + 1 &&
                        (baseWord.head.x - 1 >= word.tail.x ||
                            baseWord.tail.x + 1 >= word.head.x));
                }
                else if (baseWord.direction == 'horizontal' &&
                    word.direction === 'vertical') {
                    return (baseWord.head.x - 1 <= word.head.x &&
                        baseWord.tail.x + 1 >= word.head.x &&
                        ((baseWord.head.y - 1 <= word.tail.y &&
                            word.tail.y <= baseWord.head.y + 1) ||
                            (baseWord.head.y + 1 >= word.head.y &&
                                word.head.y >= baseWord.head.y - 1)));
                }
                else if (baseWord.direction == 'vertical' &&
                    word.direction === 'horizontal') {
                    return (baseWord.head.y - 1 <= word.head.y &&
                        baseWord.tail.y + 1 >= word.head.y &&
                        ((baseWord.head.x - 1 <= word.tail.x &&
                            word.tail.x <= baseWord.head.x + 1) ||
                            (baseWord.head.x + 1 >= word.head.x &&
                                word.head.x >= baseWord.head.x - 1)));
                }
            }
        });
    }
    evaluate() {
        const wordCount = this.words.length;
        const size = this.width * this.height;
        return wordCount * 10 + size;
    }
    get width() {
        if (this.words.length === 0) {
            return 0;
        }
        const minX = this.words.reduce((word, minWord) => {
            return word.head.x < minWord.head.x ? word : minWord;
        }).head.x;
        const maxX = this.words.reduce((word, maxWord) => {
            return word.tail.x > maxWord.tail.x ? word : maxWord;
        }).tail.x;
        return maxX - minX;
    }
    get height() {
        if (this.words.length === 0) {
            return 0;
        }
        const minY = this.words.reduce((word, minWord) => {
            return word.head.y < minWord.head.y ? word : minWord;
        }).head.y;
        const maxY = this.words.reduce((word, maxWord) => {
            return word.tail.y > maxWord.tail.y ? word : maxWord;
        }).tail.y;
        return maxY - minY;
    }
}
exports.Crossword = Crossword;
