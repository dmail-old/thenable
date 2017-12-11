import { sequenceFunctions } from "./sequenceFunctions.js"
import { createTest } from "@dmail/test"
import { assertWillResolveWith, assertWillRejectWith } from "../testHelper.js"

export const test = createTest({
	"called without argument": ({ pass }) => {
		assertWillResolveWith(() => sequenceFunctions(), undefined)
		pass()
	},
	"called with a function returning a basic value": ({ pass }) => {
		assertWillResolveWith(() => sequenceFunctions(() => 10), 10)
		pass()
	},
	"called with a function returning a resolved thenable": ({ pass }) => {
		assertWillResolveWith(() => sequenceFunctions(() => Promise.resolve(1)), 1)
		pass()
	},
	"called with a function returning a rejected thenable": ({ pass }) => {
		assertWillRejectWith(() => sequenceFunctions(() => Promise.reject(1)), 1)
		pass()
	},
	"second function receive previous function unwrapped value": ({ pass }) => {
		assertWillResolveWith(
			() => sequenceFunctions(() => Promise.resolve(1), (v) => Promise.resolve(v + 1)),
			2,
		)
		pass()
	},
})
