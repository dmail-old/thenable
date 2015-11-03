import { fromFunction, resolved, rejected } from "../helper.js"

export const reduceIntoThenable = ({ iterable, reducer, initialValue }) => {
	return fromFunction((resolve, reject) => {
		const iterator = iterable[Symbol.iterator]()
		let { done, value } = iterator.next()

		if (done) {
			if (initialValue === undefined) {
				throw new Error("reduce called on empty iterable without initialValue")
			}
			return resolve(initialValue)
		}

		let index = 0
		let reducedValue
		if (initialValue === undefined) {
			reducedValue = value

			const nextResult = iterator.next()
			if (nextResult.done) {
				return resolve(reducedValue)
			}
			value = nextResult.value
			index++
		} else {
			reducedValue = initialValue
		}

		let pending = true
		const shortResolve = (value) => {
			resolve(value)
			pending = false
		}
		const shortReject = (value) => {
			pending = false
			reject(value)
		}

		const iterate = (currentValue) => {
			resolved(reducedValue).then(
				(previousValue) => {
					reducedValue = resolved(
						reducer({
							previousValue,
							value: currentValue,
							index,
							iterable,
							state: "resolved",
							resolve: shortResolve,
							reject: shortReject,
						}),
					)
					if (pending === false) {
						return
					}
					index++
					const { value, done } = iterator.next()
					if (done) {
						return resolve(reducedValue)
					}
					iterate(value)
				},
				(reason) => {
					reducedValue = reducer({
						previousValue: reason,
						value: currentValue,
						index,
						iterable,
						state: "rejected",
						resolve: shortResolve,
						reject: shortReject,
					})
				},
			)
		}
		iterate(value)
	})
}

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

export const sequence = (iterable, map = (v) => v) => {
	return reduce(
		iterable,
		(previousValue, value, index, iterable) => {
			return map(value, index, iterable)
		},
		resolved(undefined),
	)
}

export const sequenceFunctions = (firstFn = () => resolved(undefined), ...fns) => {
	return reduce(fns, (previousValue, fn) => fn(previousValue), firstFn())
}

const rejectedHandlerSymbol = Symbol()
export const catchRejectedRoute = (fn) => {
	const rejectedHandler = (reason) => fn(reason)
	rejectedHandler[rejectedHandlerSymbol] = true
	return rejectedHandler
}

const isResolvedHandler = (fn) => fn.hasOwnProperty(rejectedHandlerSymbol) === false
const isRejectedHandler = (fn) => fn.hasOwnProperty(rejectedHandlerSymbol)

export const route = (firstFn = () => resolved(undefined), ...fns) => {
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
