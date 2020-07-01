# Native File Monopolist

Open a file handle exclusively and hold it, in order to other processes cannot access the file.

## Install

```console
npm install native-file-monopolist
```

Or

```console
yarn add native-file-monopolist
```

## Build

```console
yarn configure
yarn build
```

## Test

```console
yarn test
```

## Use

```js
import { FileMonopolist } from 'native-file-monopolist';

const ERROR_SHARING_VIOLATION = 0x00000020;
const filePath = 'C:\\your-file-path';

const monopolist = new FileMonopolist(filePath);

console.log(monopolist.monopolized); // false
console.log(monopolist.filePath); // 'C:\\your-file-path'

const errorCode = monopolist.monopolize();
assert(errorCode === 0);

console.log(monopolist.monopolized); // true
const success = monopolist.dispose(); // true
console.log(monopolist.monopolized); // false
```

## API

See [`index.d.ts`](./index.d.ts) file for details.