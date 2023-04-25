function getCardUnicode(card) {
    const suits = ['A', 'B', 'C', 'D'];
    let cardValue = card % 13 + 1; // 1-12
    // To remove the Knights in unicode
    if (cardValue > 11) {
        ++cardValue;
    }
    const suit = suits[Math.floor(card / 13)];
    const cardCode = cardValue.toString(16).toUpperCase();
    const cardCharacter = String.fromCodePoint(parseInt(`1F0${suit}${cardCode}`, 16))
    return cardCharacter
}

module.exports = { getCardUnicode };