# minimal-store

Minimalistic implementation of the reactive store pattern

# Badges

[![CircleCI](https://circleci.com/gh/n0th1ng-else/minimal-store/tree/master.svg?style=svg)](https://circleci.com/gh/n0th1ng-else/minimal-store/tree/master)

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

## Examples

- Simple example:

```js
import { readableStore } from 'minimal-store';

const pageSize = readableStore(20);

pageSize.subscribe(size => {
	// do something with _size_
});

pageSize.update(oldValue => {
	// pageSize will never be update as it is a readableStore
});
```

- freezable store:

```js
import { freezableStore } from 'minimal-store';

const pageSize = freezableStore(20, 3);

pageSize.subscribe(size => {
	// do something with _size_
});

pageSize.update(oldValue => {
	// pageSize will be updated first 3 times and then will be freezed
});
```

- Promise-like update:

```js
import { writableStore } from 'minimal-store';

const pageSize = writableStore(20);

pageSize.subscribe(size => {
	// do something with _size_
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
