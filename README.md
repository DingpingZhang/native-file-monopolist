# Native File Monopolist

Open a file handle exclusively and hold it, in order to other processes cannot access the file.

## Build

## Use

```js
const addon = require("./build/Release/native-file-monopolist");

const ERROR_SHARING_VIOLATION = 0x00000020;
const filePath = "C:\\...";

const monopolist = new addon.FileMonopolist(filePath);

console.log(monopolist.monopolized); // false
console.log(monopolist.filePath); // 'C:\\...'

const errorCode = monopolist.monopolize();
/*
 * errorCode:
 * 0: Success,
 * ERROR_SHARING_VIOLATION: The process cannot access the file because it is being used by another process.
 * Others: Refer to Win32 Error Code: https://docs.microsoft.com/en-us/openspecs/windows_protocols/ms-erref/18d8fbe8-a967-4f1c-ae50-99ca8e491d2d
 */

console.log(monopolist.monopolized); // true if errorCode is 0
const success = monopolist.dispose(); // true or false
```
