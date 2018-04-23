const Structure = require('./Structure.js');
const Options = require('../utils/Constants.js').DefaultClientOptions;

class Client {

  /**
   * @param {ClientOptions} [options] Options for the client
   */
  constructor(options = {}) {

    /**
     * All structure instances
     * @type {Set<Structures>}
     */
    this.structures = new Set();

    /**
     * The currency for the game
     * @type {String}
     */
    this.currency = options.currency || Options.currency;

    /**
     * The prestige level for the game
     * @type {Number}
     */
    this.prestigeLevel = options.prestigeLevel || Options.prestigeLevel;

    /**
     * Formula for how much you earn more per prestige
     * @type {Function}
     */
    this.prestigeBoost = options.prestigeBoost || Options.prestigeBoost;

  }

  /**
   * Creates a new structre with a set of options
   * @param {StructureOptions} options Options for the structure
   * @returns {Structure} The structure that was created
   */
  createStructure(options = {}) {
    const structure = new Structure(options);
    this.structures.add(structure);
    return structure;
  }

  /**
   * Collects the money stored in all structures
   * This already includes prestige boost
   * @returns {Number} Money
   */
  collectAll() {
    let balance = 0;
    for (const structure of this.structures) {
      balance += structure.collect();
    }
    if (this.prestige) balance *= this.prestigeBoost(this.prestigeLevel);
    return balance;
  }

  /**
   * Gets the amount of money the user should get per second
   * This already includes prestige boost
   * @returns {Number} The money the person should get per second
   */
  get MPS() {
    let amount = 0;
    for (const structure of this.structures) {
      amount += structure.MPS;
    }
    if (this.prestige) amount *= this.prestigeBoost(this.prestigeLevel);
    return amount;
  }

  /**
   * Resets all the structures and increments the prestigeLevel
   */
  prestige() {
    this.prestigeLevel++;
    for (const structure of this.structures) {
      structure.reset();
    }
  }

}
module.exports = Client;
