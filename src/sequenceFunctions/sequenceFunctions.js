import { reduceIntoThenable } from "../reduceIntoThenable/reduceIntoThenable.js"
import { createIterator } from "../helper.js"

export const sequenceFunctions = (...fns) => {
	return reduceIntoThenable({
		iterator: createIterator(fns),
		reducer: ({ state, previousValue, value: fn, reject }) => {
			if (state === "resolved") {
				return fn(previousValue)
			}
			return reject(previousValue)
		},
	})
}
