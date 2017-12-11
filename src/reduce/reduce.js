import { reduceIntoThenable } from "../reduceIntoThenable/reduceIntoThenable.js"

export const reduce = (iterable, reducer, initialValue) => {
	return reduceIntoThenable({
		iterable,
		reducer: ({ state, previousValue, value, index, iterable, reject }) => {
			if (state === "resolved") {
				return reducer(previousValue, value, index, iterable)
			}
			return reject(previousValue)
		},
		initialValue,
	})
}
