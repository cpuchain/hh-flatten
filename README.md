# hh-flatten

Extending hardhat flatten task to flatten all files

### Install

```bash
$ yarn add -D hh-flatten
```

### Usage

Add the following line on `hardhat.config.ts`

```ts
import 'hh-flatten';
```

or on `hardhat.config.js`

```js
require('hh-flatten');
```

Run extended flatten task with the following ( which would flatten all files under contracts and store it under flatten in recursive behavior )

```bash
$ npx hardhat flatten:all
```
