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
  whenRejected((v) => {
    // ici on doit recevoir 10
  })
)
*/
