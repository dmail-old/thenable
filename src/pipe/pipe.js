import { reduceIntoThenable } from "../reduceIntoThenable/reduceIntoThenable.js"
import { createIterator } from "../helper.js"

export const pipe = (input, ...middlewares) => {
	return reduceIntoThenable({
		iterator: createIterator(middlewares),
		reducer: ({ previousValue, value: fn, state, resolve, reject }) => {
			if (previousValue !== null && previousValue !== undefined) {
				if (state === "resolved") {
					return resolve(previousValue)
				}
				return reject(previousValue)
			}

			if (state === "resolved") {
				return fn(input)
			}
			return reject(previousValue)
		},
		defaultValue: null,
	})
}
