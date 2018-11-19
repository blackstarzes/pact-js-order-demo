const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const Pact = require('@pact-foundation/pact').Pact
const { somethingLike: like, term } = require('@pact-foundation/pact').Matchers
const expect = chai.expect
const API_PORT = process.env.API_PORT || 9123
const { fetchProviderData } = require('../client')
chai.use(chaiAsPromised)

// Configure and import consumer API
// Note that we update the API endpoint to point at the Mock Service
const LOG_LEVEL = process.env.LOG_LEVEL || 'WARN'

const provider = new Pact({
  consumer: 'Order Web',
  provider: 'Order API',
  port: API_PORT,
  logLevel: LOG_LEVEL,
})

describe('Pact with Order API', () => {
  before(() => provider.setup())
  afterEach(() => provider.verify())

  describe('given there are orders', () => {
    describe('when a call to the API is made', () => {
      before(() => {
        // Add interaction
      })

      it('will receive the list of current orders', done => {
        const response = fetchOrders()
        // Assert!
      })
    })
  })

  // Write pact files to file
  after(() => {
    return provider.finalize()
  })
})
