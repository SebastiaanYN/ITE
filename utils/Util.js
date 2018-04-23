const Constants = require('./Constants.js');

class Util {

  /**
   * Shortens a number
   * @param {Number} number The number to convert
   * @param {Number} [decimals=3] The amount of decimals that should be included
   * @returns {String} The string that represents the number in short
   */
  static shorten(number, decimals = 3) {
    if (typeof number === 'string') {
      number = parseFloat(number);
      if (isNaN(number)) throw new TypeError('Number provided is not a number, and unable to be converted to one.');
    }
    if (Math.abs(number) < 1000) return number;
    const prefix = number < 0 ? '-' : '';
    const num = Math.abs(number);

    const max = 9.99999 * Math.pow(10, (Constants.valueNames.length * 3 + 2));
    if (num > max) throw new RangeError('Number too big! Make sure it is not bigger as ' + max);

    const size = Math.floor(Math.log10(num)) + 1;
    const exponent = size % 3 === 0 ? size - 3 : size - (size % 3);
    const short = Math.round(Math.pow(10, decimals) * (num / Math.pow(10, exponent))) / Math.pow(10, decimals);
    const suffix = ' ' + Constants.valueNames[exponent / 3 - 1];
    return prefix + short + suffix;
  }

}
module.exports = Util;
