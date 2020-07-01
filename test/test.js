const addon = require('../build/Release/filemonopolist');
const assert = require('./assert');
const path = require('path');

const FileMonopolist = addon.FileMonopolist;
const areEqual = assert.areAqual;

// Constants

const FILE_PATH = path.resolve('./test/locked-file.txt');
const ERROR_SHARING_VIOLATION = 0x00000020;

// [Test Case] Comprehensive

const monopolist1 = new FileMonopolist(FILE_PATH);
const monopolist2 = new FileMonopolist(FILE_PATH);

areEqual(FILE_PATH, monopolist1.filePath);
areEqual(FILE_PATH, monopolist2.filePath);

areEqual(0, monopolist1.monopolized);
areEqual(0, monopolist2.monopolized);

areEqual(0, monopolist1.monopolize());
areEqual(ERROR_SHARING_VIOLATION, monopolist2.monopolize());

areEqual(1, monopolist1.monopolized);
areEqual(0, monopolist2.monopolized);

areEqual(1, monopolist1.dispose());
areEqual(0, monopolist1.monopolized);

areEqual(0, monopolist2.monopolize());
areEqual(1, monopolist2.monopolized);

areEqual(1, monopolist2.dispose());
areEqual(0, monopolist2.dispose());
areEqual(0, monopolist2.monopolized);

areEqual(FILE_PATH, monopolist1.filePath);
areEqual(FILE_PATH, monopolist2.filePath);

// [Test Case] File not found

const ERROR_FILE_NOT_FOUND = 0x00000002;
const UNKNOWN_FILE_PATH = 'UNKNOWN_FILE_PATH';
const monopolist3 = new FileMonopolist(UNKNOWN_FILE_PATH);

areEqual(UNKNOWN_FILE_PATH, monopolist3.filePath);
areEqual(0, monopolist3.monopolized);
areEqual(ERROR_FILE_NOT_FOUND, monopolist3.monopolize());
areEqual(0, monopolist3.monopolized);
areEqual(0, monopolist3.dispose());
