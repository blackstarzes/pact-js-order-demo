const client = require('./client')

client.fetchOrders(new Date().toISOString()).then(
  response => {
    response.forEach(o => {
      console.log(o.toString())
    })
  },
  error => {
    console.error(error)
  }
)
