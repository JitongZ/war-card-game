const { getCardValue, getCardUnicode } = require('../../utils');

describe('getCardValue', () => {
  test('returns correct value for Ace', () => {
    expect(getCardValue(0)).toBe(13);
  });

  test('returns correct value for non-Ace cards', () => {
    expect(getCardValue(12)).toBe(12);
    expect(getCardValue(7)).toBe(7);
    expect(getCardValue(1)).toBe(1);
  });

  test('handles invalid input', () => {
    expect(() => getCardValue(52)).toThrow();
    expect(() => getCardValue(-1)).toThrow();
  });
});

describe('getCardUnicode', () => {
  test('returns correct unicode character for cards', () => {
    expect(getCardUnicode(0)).toBe('\u{1F0A1}');
    expect(getCardUnicode(50)).toBe('\u{1F0DD}');
  });

  test('handles invalid input', () => {
    expect(() => getCardUnicode(52)).toThrow();
    expect(() => getCardUnicode(-1)).toThrow();
  });
});
