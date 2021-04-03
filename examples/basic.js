const LineSensor = require('../src/lineSensor');
const lineSensor = LineSensor('/dev/tty.usbserial-14130');

lineSensor.on('data', (data) => {
  console.log(data);
});

lineSensor.init();
