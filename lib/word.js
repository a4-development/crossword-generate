"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Word = void 0;
class Word {
    constructor(text, direction, x, y, id = undefined) {
        this.text = text;
        this.direction = direction;
        this.head = { x, y };
        this.id = id;
    }
    get tail() {
        if (this.direction === 'vertical') {
            return { x: this.head.x, y: this.head.y + this.text.length - 1 };
        }
        else if (this.direction === 'horizontal') {
            return { x: this.head.x + this.text.length - 1, y: this.head.y };
        }
        else {
            return { x: this.head.x, y: this.head.y };
        }
    }
}
exports.Word = Word;
