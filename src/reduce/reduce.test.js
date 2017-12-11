import { reduce } from "./reduce.js"
import { createTest } from "@dmail/test"
import { mockExecution } from "@dmail/micmac"

export const test = createTest({
	"": ({ pass }) => {
		mockExecution(({ tick }) => {})
		pass()
	},
})
