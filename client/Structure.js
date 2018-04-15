class Structure {

  constructor(options = {}) {

    /**
     * The name for the structure
     * @type {String}
     */
    this.name = options.name;

    /**
     * The level of the structure, starts at 0 if no structure is bought
     * @type {Number}
     */
    this.level = 0;

    /**
     * The max level for the structure
     * @type {Number}
     */
    this.maxLevel = options.maxLevel;

    /**
     * The amount of money/s that the structure generates calculated by level
     * @type {Function}
     */
    this.calcMPS = options.calcMPS;

    /**
     * The amount it costs to upgrade the structure
     * @type {Function}
     */
    this.calcCost = options.calcCost;

    /**
     * The amount of money/s that structure generates
     * @type {Number}
     */
    this.MPS = 0;

    /**
     * The balance the structure has
     * @type {Number}
     */
    this.balance = options.balance || 0;

    /**
     * The delay in seconds between earning money whilest in manual mode
     * @type {Number}
     */
    this.delay = options.delay;

    /**
     * Enable manual mode when creating the structure
     */
    if (options.manual) {
      this.enableManual();
    }

    /**
     * Wether or not the structure is manual
     * @type {Boolean}
     * @readonly
     */
    this.isManual = false;

  }

  /**
   * Sets the structures level to the specified level or the max level
   * @param {Number} level The level to set the structure to
   */
  setLevel(level) {
    if (level > this.maxLevel) this.level = this.maxLevel;
    else this.level = level;
    this.MPS = this.calcMPS(level);
  }

  /**
   * Adds levels to the structure, and increases its money/s
   * @param {Number} money The amount of money the user has
   * @param {Number} [amount=1] The amount of levels to add
   * @return {?Number} The amount of money the user has left
   */
  addLevel(money, amount = 1) {
    let newLevel = this.level;
    if (this.level === this.maxLevel) return null;
    else if (this.level + amount >= this.maxLevel) newLevel = this.maxLevel;
    else newLevel += amount;

    const cost = this.calcCost(newLevel) - this.calcCost(this.level);
    if (cost > money) return null;

    this.level = newLevel;
    this.MPS = this.calcMPS(newLevel);
    return money - cost;
  }

  /**
   * The cost to buy 1 or more structures
   * @param {Number} [amount=1] The amount of levels to check
   * @return {Number} The amount it would cost
   */
  upgradeCost(amount = 1) {
    let newLevel = this.level;
    if (this.level === this.maxLevel) return 0;
    else if (this.level + amount >= this.maxLevel) newLevel = this.maxLevel;
    else newLevel += amount;
    return this.calcCost(newLevel) - this.calcCost(this.level);
  }

  /**
   * Gets the money that would've been earned in the time provided
   * @param {Number} seconds The amount of seconds to calculate for
   * @return {Number} The amount of money earned in the seconds provided
   */
  getMoneyFor(seconds) {
    return this.MPS * seconds;
  }

  /**
   * Resets the structure
   */
  reset() {
    this.level = 0;
    this.MPS = 0;
    this.balance = 0;
  }

  /**
   * Enables the manual mode for the structure
   */
  enableManual() {
    if (this.isManual) return;
    this.timeout;
  }
  get timeout() {
    const delay = this.delay;
    setTimeout(() => {
      this.balance += this.getMoneyFor(delay);
      this.timeout;
    }, delay * 1000);
  }

  /**
   * Collects the money stored in the structure and sets its balance to 0
   * @return {Number} The money stored in the structure
   */
  collect() {
    const balance = this.balance;
    this.balance = 0;
    return balance;
  }

}
module.exports = Structure;
