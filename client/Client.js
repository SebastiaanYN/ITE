const EventEmitter = require('events');
const Structure = require('./Structure.js');

/**
 * The client for the tycoon game
 * @extends {EventEmitter}
 */
class Client extends EventEmitter {

  constructor(options = {}) {
    super();

    /**
     * All structure instances
     * @type {Set<Structures>}
     */
    this.structures = new Set();

    /**
     * The currency for the game
     * @type {String}
     */
    this.currency = options.currency || '$';

    /**
     * The prestige level for the game
     * @type {Number}
     */
    this.prestigeLevel = options.prestigeLevel || 0;

    /**
     * Formula for how much you earn more per prestige
     * @type {Function}
     */
    this.prestigeBoost = options.prestigeBoost || (x => x * 1);

    /**
     * Indicates wether or not the client is manual or not
     * If manual moneyEarned event will not be fired and structures will hold their own money
     * @type {Boolean}
     */
    this.manual = options.manual || false;

    if (!this.manual) {
      /**
       * An interval to call the moneyEarned event and give the money
       * Only active if the client is not on manual
       * @event Client#moneyEarned
       * @type {Number}
       */
      setInterval(() => this.emit('moneyEarned', this.MPS), options.moneyEarnedInterval || 1000);
    }

  }

  /**
   * Gets the amount of money the user should get per second
   * @type {Number}
   * @readonly
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
   * Creates a new structre with a set of options
   * @param {StructureOptions} options Options for the structure
   */
  createStructure(options = {}) {
    const structure = new Structure(options);
    this.structures.add(structure);
    return structure;
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
