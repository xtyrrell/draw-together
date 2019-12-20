import _ from 'lodash'

const WORDS = [
  'happy',
  'sky',
  'blue',
  'eyes',
  'mountain',
  'snow',
  'sunshine',
  'river',
  'horses',
  'tree',
  'sparkling',
  'distant'
]

const NUM_WORDS_IN_COMBINATION = 4

const getRandomWord = () => WORDS[Math.floor(Math.random() * WORDS.length)]

export default function getWordCombination () {
  return _.times(NUM_WORDS_IN_COMBINATION, getRandomWord).join('-')
}
