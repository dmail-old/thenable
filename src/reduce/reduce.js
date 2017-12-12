import { reduceIntoThenable } from "../reduceIntoThenable/reduceIntoThenable.js"
import { createIterator } from "../helper.js"

export const reduce = (iterable, reducer, initialValue) => {
	const iterator = createIterator(iterable)
	if (initialValue === undefined) {
		const { done, value } = iterator.iterate()
		if (done) {
			throw new Error("reduce called on empty iterable without initialValue")
		}
		initialValue = value
	}

	return reduceIntoThenable({
		iterator,
		reducer: ({ state, previousValue, value, index, iterable, reject }) => {
			if (state === "resolved") {
				return reducer(previousValue, value, index, iterable)
			}
			return reject(previousValue)
		},
		defaultValue: initialValue,
	})
}
