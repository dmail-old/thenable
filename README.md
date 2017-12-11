# Thenable

[![npm](https://badge.fury.io/js/%40dmail%2Fthenable.svg)](https://badge.fury.io/js/%40dmail%2Fthenable)
[![build](https://travis-ci.org/dmail/thenable.svg?branch=master)](http://travis-ci.org/dmail/thenable)
[![codecov](https://codecov.io/gh/dmail/thenable/branch/master/graph/badge.svg)](https://codecov.io/gh/dmail/thenable)

Minimalist promise helpers

## Example

```javascript
import { sequenceFunctions } from "@dmail/thenable"

const promise = sequenceFunctions(
	() => Promise.resolve(10),
	(value) => Promise.resolve(value + 2),
	(value) => value / 2,
)

promise.then((value) => {
	console.log(value) // logs 6
})
```

Check the [API documentation](./docs/api.md)
