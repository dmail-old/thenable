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
