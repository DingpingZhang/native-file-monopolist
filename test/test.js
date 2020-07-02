function areEqual(expect, actual) {
  if (expect !== actual) {
    throw new Error(
      `The expected value is ${expect}, but the actual value is ${actual}`
    );
  }
}

function repeat(count, action) {
  for (let index = 0; index < count; index++) {
    action();
  }
}

function test(caseName, caseAction) {
  try {
    caseAction();
    console.log('\x1b[32m%s\x1b[0m', `[Pass]: ${caseName}`);
  } catch (e) {
    console.log('\x1b[31m%s\x1b[0m', `[Failed]: ${caseName}`);
    console.log(e);
  }
}

module.exports = { test, areEqual, repeat };
