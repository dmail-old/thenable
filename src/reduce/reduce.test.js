// import { reduce, sequence, sequenceFunctions, route, catchRejectedRoute } from "./reduce.js"

/*
voici des examples pour route

route(
  () => { foo: true },
  (value) => {
    if (value.foo === true) {
      return Promise.reject(10)
    }
  },
  (v) => {}, // should be ignored
  catchRejectedRoute((v) => {
    // ici on doit recevoir 10
  })
)
*/
