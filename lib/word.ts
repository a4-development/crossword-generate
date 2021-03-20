type Point = {
  x: number
  y: number
}

export type Direction = 'vertical' | 'horizontal'

export class Word {
  text: string
  id?: string
  direction: Direction
  head: Point
  constructor(
    text: string,
    direction: Direction,
    x: number,
    y: number,
    id: string | undefined = undefined
  ) {
    this.text = text
    this.direction = direction
    this.head = { x, y }
    this.id = id
  }
  get tail(): Point {
    if (this.direction === 'vertical') {
      return { x: this.head.x, y: this.head.y + this.text.length - 1 }
    } else if (this.direction === 'horizontal') {
      return { x: this.head.x + this.text.length - 1, y: this.head.y }
    } else {
      return { x: this.head.x, y: this.head.y }
    }
  }
}
