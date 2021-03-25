const chalk = require('chalk');

/**
 * Wrapper class around console.log that does formatting and also
 * has some color capabilities using the chalk library.
 * 
 * Inspired by the Logger class of SquadJS by Thomas Smyth
 * https://github.com/Thomas-Smyth/SquadJS/blob/master/core/logger.js
 */
class Logger {
  constructor() {
    this.verboseness = {};
    this.moduleColors = {};
  }

  /**
   * Writes the provided message to the output log with formatting and color.
   * 
   * @param {string} module Name of the module to log for
   * @param {number} verboseness Verboseness of the message
   * @param {string} message The message itself
   * @param {string} color The color (string) to use, defaults to 'white'
   * @param  {...any} extras Any extra arguments for the console.log call
   */
  verbose(module, verboseness, message, color, ...extras) {
    /* Get the module color function or default */
    const moduleColorFunc = Logger.getColorFunctionOrDefault(this.moduleColors[module]);

    /* Get the text color function or default */
    const textColorFunc = Logger.getColorFunctionOrDefault(color || 'white');

    if ((this.verboseness[module] || 0) >= verboseness) {
      console.log(`[${moduleColorFunc(module)}][${verboseness}] ${textColorFunc(message)}`, ...extras);
    }

    return this;
  }

  /**
   * Sets the verboseness of an module for the Logger instance.
   * 
   * @param {string} module 
   * @param {number} verboseness 
   */
  setVerboseness(module, verboseness) {
    this.verboseness[module] = verboseness;

    return this;
  }

  /**
   * Sets the module color for the Logger instance.
   * 
   * @param {string} module 
   * @param {string} color 
   */
  setModuleColor(module, color) {
    this.moduleColors[module] = color;

    return this;
  }

  /**
   * Static helper to get the requested color function from chalk or the default (white).
   * 
   * @param {string} color 
   * @returns {function}
   */
  static getColorFunctionOrDefault(color) {
    let colorFunction = chalk[color];

    if (typeof colorFunction === 'function') {
      return colorFunction;
    } else {
      return chalk.white;
    }
  }
}

/* Instanciate so we always use the same instance */
module.exports = new Logger();