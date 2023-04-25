
const Chance = require('chance');
const chance = new Chance();

function shuffle(array) {
  return chance.shuffle(array);
}
  
function getCardValue(card) {
  if (card < 0 || card > 51) {
    throw new Error('Internal: getting card value for an invalid card');
  }
  const value = card % 13;
  return value === 0 ? 13 : value;
}

function getCardUnicode(card) {
  if (card < 0 || card > 51) {
    throw new Error('Internal: getting card value for an invalid card');
  }
  const suits = ['A', 'B', 'C', 'D'];
  let cardValue = card % 13 + 1; // 1-12
  // To remove the Knights in unicode
  if (cardValue > 11) {
    ++cardValue;
  }
  const suit = suits[Math.floor(card / 13)];
  const cardCode = cardValue.toString(16).toUpperCase();
  const cardCharacter = String.fromCodePoint(parseInt(`1F0${suit}${cardCode}`, 16));
  return cardCharacter;
}

module.exports = { shuffle, getCardValue, getCardUnicode };