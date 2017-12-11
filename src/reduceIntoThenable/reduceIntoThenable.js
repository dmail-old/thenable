import { fromFunction, resolved } from "../helper.js"

export const reduceIntoThenable = ({ iterable, reducer, initialValue }) => {
	return fromFunction((resolve, reject) => {
		const createIterate = () => {
			const iterator = iterable[Symbol.iterator]()
			let index = 0
			return () => {
				const next = iterator.next()
				index++
				return {
					done: next.done,
					value: next.value,
					index,
				}
			}
		}

		const iterate = createIterate()

		let pending = true

		const shortResolve = (value) => {
			pending = false
			resolve(value)
		}

		const shortReject = (value) => {
			pending = false
			reject(value)
		}

		const reduce = (previousValue, state) => {
			const { done, value, index } = iterate()

			if (done) {
				return state === "resolved" ? resolve(previousValue) : reject(previousValue)
			}

			const nextValue = reducer({
				state,
				previousValue,
				value,
				index,
				iterable,
				resolve: shortResolve,
				reject: shortReject,
			})

			if (pending === false) {
				return
			}
			resolved(nextValue).then((arg) => reduce(arg, "resolved"), (arg) => reduce(arg, "rejected"))
		}

		if (initialValue === undefined) {
			const { done, value } = iterate()
			if (done) {
				throw new Error("reduce called on empty iterable without initialValue")
			}
			initialValue = value
		}
		reduce(initialValue, "resolved")
	})
}
