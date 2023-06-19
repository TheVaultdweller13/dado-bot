/**
 * Represents a set of dice rolls.
 * @class
 */
export default class Rolls {
  /**
   * Creates a new instance of the Rolls class.
   * @constructor
   * @param {number} dice - The number of dice to roll.
   * @param {number} faces - The number of faces each die has.
   */
  constructor(dice, faces) {
    this.dice = dice;
    this.faces = faces;
    this.all = toArray(dice, faces);
  }

  /**
   * Gets the sum of all rolls.
   * @returns {number} - The sum of all rolls.
   */
  getSum() {
    return this.all.reduce((a, b) => a + b, 0);
  }

  /**
   * Gets the number of critical rolls (rolls that match the number of dice).
   * @returns {number} - The count of critical rolls.
   */
  getCritics() {
    return this.all.filter((roll) => roll === this.dice).length;
  }

  /**
   * Gets the number of botched rolls (rolls with a value of 1).
   * @returns {number} - The count of botched rolls.
   */
  getBotches() {
    return this.all.filter((roll) => roll === 1).length;
  }

  /**
   * Returns an array of formatted rolls, with special rolls highlighted.
   * @returns {string[]} An array of formatted rolls, where critical rolls and botched rolls are highlighted.
   */
  getFormatted() {
    return this.all.map((roll) => (roll === this.dice || roll === 1 ? highlight(roll) : roll.toString()));
  }
}

const highlight = (roll) => {
  return `**__${roll}__**`;
};

const toArray = (dice, faces) => {
  return Array(dice)
    .fill(undefined)
    .map(() => Math.floor(Math.random() * faces + 1));
};
