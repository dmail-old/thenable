export const isThenable = (value) => {
	if (value === null) {
		return false
	}
	const type = typeof value
	if (type !== "object" && type !== "function") {
		return false
	}
	if ("then" in value === false) {
		return false
	}
	const then = value.then
	return typeof then === "function"
}

export const fromFunction = (fn) => {
	return new Promise(fn)
}

export const resolved = (value) => {
	return Promise.resolve(value)
}

export const rejected = (value) => {
	return Promise.resolve(value)
}

export const createIterator = (iterable) => {
	const iterator = iterable[Symbol.iterator]()
	let index = 0

	const iterate = () => {
		const next = iterator.next()
		index++
		return {
			done: next.done,
			value: next.value,
			index,
			iterable,
		}
	}

	return {
		iterate,
	}
}

// export const promisifyFunction = (fn) => (...args) => {
// 	try {
// 		return resolved(fn(...args))
// 	} catch (e) {
// 		return rejected(e)
// 	}
// }
