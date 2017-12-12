import { fromFunction, resolved } from "../helper.js"

export const reduceIntoThenable = ({
	iterator,
	reducer,
	defaultValue,
	defaultState = "resolved",
}) => {
	const { iterable, iterate } = iterator

	return fromFunction((resolve, reject) => {
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

		reduce(defaultValue, defaultState)
	})
}
