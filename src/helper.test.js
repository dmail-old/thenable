import { isThenable } from "./helper.js"
import { createTest } from "@dmail/test"
import assert from "assert"

export const test = createTest({
	"with null": ({ pass }) => {
		assert.equal(isThenable(null), false)
		pass()
	},

	"with undefined": ({ pass }) => {
		assert.equal(isThenable(undefined), false)
		pass()
	},

	"with empty object": ({ pass }) => {
		assert.equal(isThenable({}), false)
		pass()
	},

	"with object having then which is not a function": ({ pass }) => {
		assert.equal(isThenable({ then: true }), false)
		pass()
	},

	"with object having then method": ({ pass }) => {
		assert.equal(isThenable({ then: () => {} }), true)
		pass()
	},
})
