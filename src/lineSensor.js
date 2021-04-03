const EventEmitter = require('events');
const SerialPort = require('serialport');
const cobs = require('cobs');
const robotlib = require('robotlib');
const Parser = require('./Parser');

/**
 * LineSensor
 * @param {String} path
 * @return {Object}
 */
const lineSensor = (path) => {
  const eventEmitter = new EventEmitter();
  const requestStartFlag = 0xA1;

  let port;
  let parser;

  /**
   * Constructor
   */
  function constructor() {}

  /**
   * Init
   * @return {Promise}
   */
  function init() {
    return new Promise((resolve, reject) => {
      if (port) {
        setTimeout(reject, 0);
      }

      port = new SerialPort(path, { baudRate: 115200 });
      parser = new Parser();

      port.pipe(parser);

      port.on('error', error => eventEmitter.emit('error', error));
      port.on('disconnect', () => eventEmitter.emit('disconnect'));
      port.on('close', () => eventEmitter.emit('close'));
      port.on('open', onPortOpen);

      parser.on('ready', resolve);
      parser.on('data', data => eventEmitter.emit('data', data));
    });
  }

  /**
   * Ask controller for ready response
   * @return {Promise}
   */
  function isReady() {
    writeToSerialPort([requestStartFlag, 0x01]);

    return Promise.resolve();
  }

  /**
   * Writes the given buffer to the serial port
   * @param {Array} data
   */
  function writeToSerialPort(data) {
    port.write(cobs.encode(Buffer.from(data), true));
  };

  /**
   * Port open event handler
   */
  function onPortOpen() {
    port.flush(error => {
      if (error) {
        eventEmitter.emit('error', error);
      }
    });
  }

  constructor();

  return {
    init,
    isReady,
    on: eventEmitter.on.bind(eventEmitter),
    off: eventEmitter.off.bind(eventEmitter),
  };
};

module.exports = lineSensor;
