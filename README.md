# minimal-store

Minimalistic implementation of the **reactive store** pattern

- **322 Bytes**, according to [size-limit](https://github.com/ai/size-limit/)
- **No** dependencies
- **100% test** coverage
- ES Module

# Badges

[![circle ci](https://circleci.com/gh/n0th1ng-else/minimal-store/tree/master.svg?style=svg)](https://circleci.com/gh/n0th1ng-else/minimal-store/tree/master)

[![semantic release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

[![npm version](https://img.shields.io/npm/v/minimal-store)](https://www.npmjs.com/package/minimal-store)

[![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://jestjs.io)

[![codecov](https://img.shields.io/codecov/c/github/n0th1ng-else/minimal-store)](https://codecov.io/gh/n0th1ng-else/minimal-store)

## Usage

There are differend kinds of store you can use:

- writableStore
- freezableStore
- readableStore

All stores apply weak data i.e. you can use `null` (update with no value) to clear store value.

### writableStore

`writableStore` as called - can be updated without any limit. You can update data all the time as you want to.

### freezableStore

`freezableStore` reflects the second parameter while being initialized - it defines how many time you can update store. The default is **once** (`=== 1`).

### readableStore

`readableStore` stores the initial value and never being updated.  
All subscribers will be executed once with the value store contains.

## Examples

- Simple example:

```js
import { writableStore } from 'minimal-store';

const pageSize = writableStore(20);

pageSize.subscribe(size => {
	// do something with _size_
	// subscription will be called with `size === 20`
	// then with `size === 21`
});

pageSize.update(oldValue => oldValue + 1);
```

- readable store

```js
import { readableStore } from 'minimal-store';

const pageSize = readableStore(20);

pageSize.subscribe(size => {
	// do something with _size_
});

pageSize.update(oldValue => {
	// pageSize will never be update as it is a readableStore
	// return value does not make any sense in this case
});
```

- freezable store:

```js
import { freezableStore } from 'minimal-store';

const freezeCount = 3;
const pageSize = freezableStore(20, freezeCount);

pageSize.subscribe(size => {
	// do something with _size_
});

pageSize.update(oldValue => {
	// pageSize will be updated first 3 times and then will be freezed
	const newValue = 21; // any value you want to return
	return newValue;
});
```

- Promise-like update:

```js
import { writableStore } from 'minimal-store';

const pageSize = writableStore(20);

pageSize.subscribe(size => {
	// do something with _size_
	// first time it receives `size === 20`
	// then `size === 100`
});

pageSize.update(oldValue => {
	// update function can be async!
	return Promise.resolve(100);
});
```

- Handling update errors:

```js
import { writableStore } from 'minimal-store';

const pageSize = writableStore(20);

pageSize.subscribe(size => {
	// do something with _size_
});

pageSize
	.update(oldValue => {
		// update function can be async!
		return Promise.reject(new Error('Something went wrong...'));
	})
	.catch(err => {
		// err.message === 'Something went wrong...'
	});
```

- Use current value to update store:

```js
import { writableStore } from 'minimal-store';

const pageSize = writableStore(20);

pageSize.subscribe(size => {
	// do something with _size_
});

pageSize.update(oldValue => {
	return oldValue + 10;
});
```

- Store rely on weak data i.e. you always can pass **null** as a new value:

```js
import { writableStore } from 'minimal-store';

const pageSize = writableStore(20);

pageSize.subscribe(size => {
	// do something with _size_
	// first time `size === 20`
	// next `size === null`
});

pageSize.update(oldValue => null);
```
