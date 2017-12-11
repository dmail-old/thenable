import { reduceIntoThenable } from "../reduceIntoThenable/reduceIntoThenable.js"
import { rejected } from "../helper.js"

const rejectedHandlerSymbol = Symbol()
export const whenRejected = (fn) => {
	const rejectedHandler = (reason) => fn(reason)
	rejectedHandler[rejectedHandlerSymbol] = true
	return rejectedHandler
}

const isResolvedHandler = (fn) => fn.hasOwnProperty(rejectedHandlerSymbol) === false
const isRejectedHandler = (fn) => fn.hasOwnProperty(rejectedHandlerSymbol)

export const route = (firstFn, ...fns) => {
	return reduceIntoThenable({
		iterable: fns,
		reducer: ({ previousValue, value: fn, state, resolve, reject }) => {
			if (previousValue !== null && previousValue !== undefined) {
				if (state === "resolved") {
					return resolve(previousValue)
				}
				return reject(previousValue)
			}

			if (state === "resolved") {
				if (isResolvedHandler(fn)) {
					return fn(previousValue)
				}
				return previousValue
			}
			if (isRejectedHandler) {
				return fn(previousValue)
			}
			return rejected(previousValue)
		},
		initialValue: firstFn(),
	})
}
