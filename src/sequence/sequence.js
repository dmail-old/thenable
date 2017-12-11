import { reduce } from "../reduce/reduce.js"
import { resolved } from "../helper.js"

export const sequence = (iterable, map = (v) => v) => {
	return reduce(
		iterable,
		(previousValue, value, index, iterable) => {
			return map(value, index, iterable)
		},
		resolved(undefined),
	)
}
