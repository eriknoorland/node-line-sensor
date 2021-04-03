const robotlib = require('robotlib');

/**
 *
 * @param {Array} data
 * @return {Array}
 */
const parseData = (data) => {
  const { parseDecToBinary} = robotlib.utils.math;

  return data.reduce((acc, value, index, array) => {
    if (index % 2 === 1) {
      const msB = parseDecToBinary(data[index-1]);
      const lsB = parseDecToBinary(data[index]);

      return [
        ...acc,
        parseInt(`${msB}${lsB}`, 2),
      ];
    }

    return acc;
  }, []);
};

module.exports = parseData;
