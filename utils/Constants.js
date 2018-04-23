/**
 * Options for a client
 * @typedef {Object} ClientOptions
 * @property {String} [currency='$'] The currency for the game
 * @property {Number} [prestigeLevel=0] The prestige level for the game
 * @property {Function} [prestigeBoost=x => 1] Formula for how much you earn more per prestige
 */
exports.DefaultClientOptions = {
  currency: '$',
  prestigeLevel: 0,
  prestigeBoost: x => 1
}

/**
 * Options for a structure
 * @typedef {Object} StructureOptions
 * @property {String} name The name for the structure
 * @property {?Number} [maxLevel=null] The max level for the structure
 * @property {Function} calcMPS The amount of money/s that the structure generates calculated by level
 * @property {Function} calcCost The amount it costs to upgrade the structure
 * @property {Number} [balance=0] The balance the structure has
 * @property {Number} delay The delay in milliseconds for this structure
 * @property {Boolean} [automated=false] Whether or not the structure is automated or not
 */
exports.DefaultStructureOptions = {
  name: 'Unnamed Structure',
  maxLevel: null,
  calcMPS: x => x,
  calcCost: x => x,
  balance: 0,
  delay: 1000,
  automated: false
}

/**
 * A list of suffixes to display amounts of money
 * @type {Array}
 */
exports.valueNames = [
  'Thousand',
  'Million',
  'Billion',
  'Trillion',
  'Quadrillion',
  'Quintillion',
  'Sextillion',
  'Septillion',
  'Octillion',
  'Nonillion',
  'Decillion',
  'Undecillion',
  'Duodecillion',
  'Tredecillion',
  'Quattuordecillion',
  'Quindecillion',
  'Sexdecillion',
  'Septendecillion',
  'Octodecillion',
  'Novendecillion',
  'Vigintillion',
  'Unvigintillion',
  'Duovigintillion',
  'Trevigintillion',
  'Quattuorvigintillion',
  'Quinquadvigintillion',
  'Sesvigintillion',
  'Septemvigintillion',
  'Octovigintillion',
  'Novemvigintillion',
  'Trigintillion',
  'Untrigintillion',
  'Duotrigintillion',
  'Trestrigintillion',
  'Quattuortrigintillion',
  'Quinquatrigintillion',
  'Sestrigintillion',
  'Septentrigintillion',
  'Octotrigintillion',
  'Noventrigintillion',
  'Quadragintillion',
  'Unquadragintillion',
  'Duoquadragintillion',
  'Trequadragintillion',
  'Quattuorquadragintillion',
  'Quinquadragintillion',
  'Sexquadragintillion',
  'Septenquadragintillion',
  'Octaquadragintillion',
  'Novemquadragintillion',
  'Quinquagintillion',
  'Unquinquagintillion',
  'Duoquinquagintillion',
  'Trequinquagintillion',
  'Quattuorquinquagintillion',
  'Quinquinquagintillion',
  'Sexquinquagintillion',
  'Septenquinquagintillion',
  'Octaquinquagintillion',
  'Novemquinquagintillion',
  'Sexagintillion'
];
