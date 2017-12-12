import { reduceIntoThenable } from "../reduceIntoThenable/reduceIntoThenable.js"
import { createIterator } from "../helper.js"

export const sequence = (iterable, map = (v) => v) => {
	return reduceIntoThenable({
		iterator: createIterator(iterable),
		reducer: ({ state, previousValue, value, index, iterable, reject }) => {
			if (state === "resolved") {
				return map(value, index, iterable)
			}
			return reject(previousValue)
		},
	})
}
