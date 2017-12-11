import { mockExecution } from "micmac"
import assert from "assert"

const installInspector = (promise) => {
	let state = "pending"
	let value
	promise.then(
		(arg) => {
			state = "resolved"
			value = arg
		},
		(arg) => {
			state = "rejected"
			value = arg
		},
	)
	return () => ({
		state,
		value,
	})
}

const assertResolvedWith = (data, value) => {
	assert.deepEqual(data.value, value)
	assert.equal(data.state, "resolved")
}

const assertRejectedWith = (data, value) => {
	assert.deepEqual(data.value, value)
	assert.equal(data.state, "rejected")
}

const assertWill = (promiseFactory, match) => {
	mockExecution(({ tick }) => {
		const promise = promiseFactory()
		const inspect = installInspector(promise)
		tick()
		match(inspect)
	})
}

export const assertWillResolveWith = (promiseFactory, value) => {
	assertWill(promiseFactory, (inspect) => {
		assertResolvedWith(inspect(), value)
	})
}

export const assertWillRejectWith = (promiseFactory, value) => {
	assertWill(promiseFactory, (inspect) => {
		assertRejectedWith(inspect(), value)
	})
}
