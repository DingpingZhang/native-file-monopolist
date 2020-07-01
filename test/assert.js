module.exports = {
  areAqual: (expect, actual) => {
    if (expect === actual) {
      console.log('\x1b[32m%s\x1b[0m', `Success: This value is ${expect}`);
    } else {
      console.log(
        '\x1b[31m%s\x1b[0m',
        `Failed: The expected value is ${expect}, but the actual value is ${actual}`
      );
      console.trace();
    }
  },
};
