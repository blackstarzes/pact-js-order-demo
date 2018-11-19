const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const Pact = require('@pact-foundation/pact').Pact
const { somethingLike: like, term } = require('@pact-foundation/pact').Matchers
const { Order } = require('../order')
const expect = chai.expect
const API_PORT = process.env.API_PORT || 9123
const { fetchOrders } = require('../client')
chai.use(chaiAsPromised)

const LOG_LEVEL = process.env.LOG_LEVEL || 'WARN'

const provider = new Pact({
  consumer: 'Order Web',
  provider: 'Order API',
  port: API_PORT,
  logLevel: LOG_LEVEL,
})

const mockOrder = {
  id: 1,
  items: [
    {
      name: 'burger',
      quantity: 2,
      value: 100,
    },
  ],
}

describe('Pact with Order API', () => {
  before(() => provider.setup())
  afterEach(() => provider.verify())

  describe('given there are orders', () => {
    describe('when a call to the API is made', () => {
      before(() => {
        return provider.addInteraction({
          state: 'there are orders',
          uponReceiving: 'a request for orders',
          withRequest: {
            path: '/orders',
            method: 'GET',
          },
          willRespondWith: {
            body: [mockOrder],
            status: 200,
            headers: {
              'Content-Type': 'application/json',
            },
          },
        })
      })

      it('will receive the list of current orders', () => {
        return expect(fetchOrders()).to.eventually.have.deep.members([
          new Order(mockOrder.items),
        ])
      })
    })
  })

  // Write pact files to file
  after(() => {
    return provider.finalize()
  })
})
