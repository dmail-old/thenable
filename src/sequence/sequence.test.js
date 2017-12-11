import { sequence } from "./sequence.js"
import { createTest } from "@dmail/test"
import { assertWillResolveWith } from "../testHelper.js"

export const test = createTest({
	"called with empty array": ({ pass }) => {
		assertWillResolveWith(() => sequence([]), undefined)
		pass()
	},
	"called with array containing a value": ({ pass }) => {
		assertWillResolveWith(() => sequence([10]), 10)
		pass()
	},
	"mapper can be used to create thenable from values": ({ pass }) => {
		assertWillResolveWith(() => sequence([10], (value) => Promise.resolve(value + 1)), 11)
		pass()
	},
})
