import { createCrosswordWords } from './index'

let baseWords = [
  { text: 'そーすこーど', id: '1' },
  { text: 'はっかそん', id: '2' },
  { text: 'しこうさくご', id: '3' },
  { text: 'せいさく', id: '4' },
  { text: 'くりえいてぃぶ', id: '5' },
  { text: 'つくる', id: '6' },
  { text: 'たのしい', id: '7' },
]

console.log(createCrosswordWords(baseWords))
