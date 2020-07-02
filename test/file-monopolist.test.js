const { FileMonopolist } = require('../build/Release/filemonopolist');
const { test, repeat, areEqual } = require('./test');
const path = require('path');

// Constants

const FILE_PATH = path.resolve('./test/locked-file.txt');
const UNKNOWN_FILE_PATH = 'UNKNOWN_FILE_PATH';
const ERROR_SUCCESS = 0x00000000;
const ERROR_SHARING_VIOLATION = 0x00000020;
const ERROR_FILE_NOT_FOUND = 0x00000002;
const TRUE = 1;
const FALSE = 0;

// Test Cases

test('smoke test', () => {
  const monopolist = new FileMonopolist(FILE_PATH);

  repeat(1000, () => {
    areEqual(FILE_PATH, monopolist.filePath);
    areEqual(FALSE, monopolist.monopolized);

    areEqual(ERROR_SUCCESS, monopolist.monopolize());
    areEqual(TRUE, monopolist.monopolized);

    areEqual(TRUE, monopolist.dispose());
    areEqual(FALSE, monopolist.monopolized);
  });
});

test('monopolize test', () => {
  const monopolist1 = new FileMonopolist(FILE_PATH);
  const monopolist2 = new FileMonopolist(FILE_PATH);

  areEqual(FILE_PATH, monopolist1.filePath);
  areEqual(FILE_PATH, monopolist2.filePath);

  areEqual(FALSE, monopolist1.monopolized);
  areEqual(FALSE, monopolist2.monopolized);

  repeat(10, () => {
    areEqual(ERROR_SUCCESS, monopolist1.monopolize());
    areEqual(ERROR_SHARING_VIOLATION, monopolist2.monopolize());
  });

  areEqual(TRUE, monopolist1.monopolized);
  areEqual(FALSE, monopolist2.monopolized);

  areEqual(TRUE, monopolist1.dispose());
  repeat(10, () => areEqual(FALSE, monopolist1.dispose()));
  areEqual(FALSE, monopolist1.monopolized);

  areEqual(ERROR_SUCCESS, monopolist2.monopolize());
  areEqual(TRUE, monopolist2.monopolized);

  areEqual(TRUE, monopolist2.dispose());
  areEqual(FALSE, monopolist2.monopolized);

  areEqual(FILE_PATH, monopolist1.filePath);
});

test('monopolize the non-existent file', () => {
  const monopolist = new FileMonopolist(UNKNOWN_FILE_PATH);

  areEqual(UNKNOWN_FILE_PATH, monopolist.filePath);
  areEqual(FALSE, monopolist.monopolized);
  repeat(10, () => areEqual(ERROR_FILE_NOT_FOUND, monopolist.monopolize()));
  areEqual(FALSE, monopolist.monopolized);
  areEqual(FALSE, monopolist.dispose());
});
