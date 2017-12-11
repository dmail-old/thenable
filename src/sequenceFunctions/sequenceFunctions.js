import { reduce } from "../reduce/reduce.js"

export const sequenceFunctions = (...fns) => {
	const initialValue = {}
	return reduce(fns, (previousValue, fn) => fn(previousValue), initialValue).then((value) => {
		return value === initialValue ? undefined : value
	})
}
