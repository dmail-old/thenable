# api

## reduce(iterable, reducer, initialValue)

Same behaviour as JavaScript reduce function but reducer can return a promise

```javascript
import { reduce } from "@dmail/thenable"

const iterable = [0, 1, 2]
const reducer = (prev, value) => Promise.resolve(prev + value)
const initialValue = 10

reduce(iterable, reducer, initialValue).then((value) => {
	// here value is 13
})
```

[source](../src/reduce/reduce.js), [test](../src/reduce/reduce.test.js)

## sequence(iterable, map)

Call map on first iterable value and await for its return value before recursively repeating this process. You can see this as the opposite of Promise.all which uses iterable concurrently.

```javascript
import { sequence } from "@dmail/thenable"

const iterable = [0, 1, 2]
const map = (value) => Promise.resolve(value + 1)

sequence(iterable, map).then((value) => {
	// here value is 3
})
```

[source](../src/sequence/sequence.js), [test](../src/sequence/sequence.test.js)

## sequenceFunctions(...fns)

Sequentially execute functions passed awaiting for their return value

```javascript
import { sequenceFucntions } from "@dmail/thenable"

sequenceFunctions(
	() => Promise.resolve(5),
	(value) => Promise.resolve(v + 1),
	(value) => value + 2,
).then((value) => {
	// here value is 8
})
```

[source](../src/sequenceFunctions/sequenceFunctions.js), [test](../src/sequenceFunctions/sequenceFunctions.test.js)
