const Interruptable = require('../utils/Interruptable.js');
const Options = require('../utils/Constants.js').DefaultStructureOptions;
const performance = require('perf_hooks').performance;

class Structure {

  /**
   * @param {StructureOptions} [options] Options for the structure
   */
  constructor(options = {}) {

    /**
     * The name for the structure
     * @type {String}
     */
    this.name = options.name || Options.name;

    /**
     * The level of the structure, starts at 0 (no structure is bought)
     * @type {Number}
     */
    this.level = 0;

    /**
     * The max level for the structure
     * @type {?Number}
     */
    this.maxLevel = options.maxLevel || Options.maxLevel;

    /**
     * The amount of money/s that the structure generates calculated by level
     * @type {Function}
     */
    this.calcMPS = options.calcMPS || Options.calcMPS;

    /**
     * The amount it costs to upgrade the structure
     * @type {Function}
     */
    this.calcCost = options.calcCost || Options.calcCost;

    /**
     * The amount of money/s that structure generates
     * @type {Number}
     */
    this.MPS = 0;

    /**
     * The balance the structure has
     * @type {Number}
     */
    this.balance = options.balance || Options.balance;

    /**
     * The delay in milliseconds for this structure
     * @type {Number}
     */
    this.delay = options.delay || Options.delay;

    /**
     * Whether or not the structure is automated or not
     * @type {Boolean}
     */
    this.automated = options.automated || Options.automated;

    if (this.automated) {
      /*
       * Enable timer
       */
      this.startTimer();
    }

  }

  /**
   * Sets the structures level to the specified level or the max level
   * @param {Number} level The level to set the structure to
   */
  setLevel(level) {
    if (this.maxLevel && level > this.maxLevel) this.level = this.maxLevel;
    else this.level = level;
    this.MPS = this.calcMPS(level);
  }

  /**
   * Adds levels to the structure, and increases its money/s
   * @param {Number} money The amount of money the user has
   * @param {Number} [amount=1] The amount of levels to add
   * @returns {?Number} The amount of money the user has left
   */
  buy(money, amount = 1) {
    let newLevel = this.level;
    if (!this.maxLevel) newLevel += amount;
    else {
      if (this.level === this.maxLevel) return null;
      else if (this.level + amount >= this.maxLevel) newLevel = this.maxLevel;
      else newLevel += amount;
    }

    const cost = this.calcCost(newLevel) - this.calcCost(this.level);
    if (cost > money) return null;

    this.level = newLevel;
    this.MPS = this.calcMPS(newLevel);
    return money - cost;
  }

  /**
   * The cost to buy 1 or more structures
   * @param {Number} [amount=1] The amount of levels to check
   * @returns {Number} The amount it would cost
   */
  cost(amount = 1) {
    let newLevel = this.level;
    if (!this.maxLevel) newLevel += amount;
    else {
      if (this.level === this.maxLevel) return 0;
      else if (this.level + amount >= this.maxLevel) newLevel = this.maxLevel;
      else newLevel += amount;
    }
    return this.calcCost(newLevel) - this.calcCost(this.level);
  }

  /**
   * The amount of money the structure generates per cycle
   * @returns {Number} The amount of money
   */
  get MPC() {
    return this.MPS * this.delay / 1000;
  }

  /**
   * Gets the money that would've been earned in the time provided
   * @param {Number} seconds The amount of seconds to calculate for
   * @returns {Number} The amount of money earned in the seconds provided
   */
  getMoneyFor(seconds) {
    return this.MPS * seconds;
  }

  /**
   * Timer that generates money for the structure
   * @param {Number} [delay=this.delay] The delay for the timer
   * @param {Boolean} [newLoop=true] Whether or not the loop is new, or changed
   */
  async startTimer(delay = this.delay, newLoop = true) {
    this.interruptable = new Interruptable();
    if (newLoop) this.start = performance.now();
    try {
      await this.interruptable.sleep(delay);
    } catch (e) {
      if (e === 1) {
        if (performance.now() - this.start < delay) {
          const percentage = 1 - (delay - this.delay) / delay;
          const remaining = this.timeRemaining * percentage;
          if (remaining > 0) return this.startTimer(remaining, false);
        }
      }
    }
    this.balance += this.getMoneyFor(this.delay / 1000);
    if (this.automated) this.startTimer();
  }

  /**
   * Get the time remaining for the current cycle of the structure
   * @returns {?Number} Time remaining or null if not running
   */
  get timeRemaining() {
    const remaining = this.delay - Math.round(performance.now() - this.start) || null;
    if (remaining >= 0) return remaining;
    else return null;
  }

  /**
   * Set a new delay for the structure
   * This will update the current timer
   * @param {Number} delay The new delay
   */
  setDelay(delay) {
    this.delay = delay;
    if (this.interruptable) this.interruptable.cancel();
  }

  /**
   * Collects all money stored in this structure
   * @returns {Number} Money
   */
  collect() {
    const balance = this.balance;
    this.balance = 0;
    return balance;
  }

  /**
   * Resets the structure
   */
  reset() {
    this.level = 0;
    this.MPS = 0;
    this.balance = 0;
  }

}
module.exports = Structure;
