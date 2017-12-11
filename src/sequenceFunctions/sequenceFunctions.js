import { reduce } from "../reduce/reduce.js"
import { resolved } from "../helper.js"

export const sequenceFunctions = (firstFn = () => resolved(undefined), ...fns) => {
	return reduce(fns, (previousValue, fn) => fn(previousValue), firstFn())
}
