import { reduce } from "./reduce.js"
import { createTest } from "@dmail/test"
import { assertWillRejectWith, assertWillResolveWith } from "../testHelper.js"
import assert from "assert"

export const test = createTest({
	"called with empty array": ({ pass }) => {
		assert.throws(
			() => reduce([]),
			(error) => {
				assert.deepEqual(error, new Error("reduce called on empty iterable without initialValue"))
				return true
			},
		)
		pass()
	},

	"resolve to initialValue when called on empty iterable": ({ pass }) => {
		assertWillResolveWith(() => reduce([], () => {}, 1), 1)
		pass()
	},

	"called on a medium sized iterable": ({ pass }) => {
		assertWillResolveWith(
			() => reduce([0, 1, 2, 3, 4, 5], (accumulator, value) => accumulator + value),
			15,
		)
		pass()
	},

	"resolve with first iterable value when no initialValue": ({ pass }) => {
		assertWillResolveWith(() => reduce([0], () => {}), 0)
		pass()
	},

	"calls reducer with first & second iterable value when no initialValue": ({ pass }) => {
		assertWillResolveWith(
			() => reduce(["a", "b"], (prev, current) => Promise.resolve(prev + current)),
			"ab",
		)
		pass()
	},

	"calls reducer with initialValue and first iterable value when initialValue": ({ pass }) => {
		assertWillResolveWith(() => reduce(["b"], (prev, current) => prev + current, "a"), "ab")
		pass()
	},

	"reducer returning rejected": ({ pass }) => {
		assertWillRejectWith(() => reduce([0, 1, 2], () => Promise.reject(1)), 1)
		pass()
	},

	"next reducer called with previous reducer resolved value": ({ pass }) => {
		assertWillResolveWith(
			() => reduce([0, 1, 2], (prev, current) => Promise.resolve(prev + current)),
			3,
		)
		pass()
	},
})
