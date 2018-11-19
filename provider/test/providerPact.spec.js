const Verifier = require('@pact-foundation/pact').Verifier
const path = require('path')
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)

let { server, dataStore } = require('../provider.js')

// Set the current state
server.post('/setup', (req, res) => {
  switch (req.body.state) {
    case 'there are no orders':
      dataStore = []
      break
    default:
      dataStore = require('../data/orders')
  }

  res.end()
})

server.listen(8081, () => {
  console.log('Provider service listening on http://localhost:8081')
})

// Verify that the provider meets all consumer expectations
describe('Pact Verification', () => {
  it('should validate the expectations of Our Little Consumer', () => {
    let opts = {
      provider: 'Order API',
      providerBaseUrl: 'http://localhost:8081',
      providerStatesSetupUrl: 'http://localhost:8081/setup',
      pactUrls: [
        path.resolve(process.cwd(), './pacts/order_web-order_api.json'),
      ],
      // pactBrokerUrl: 'https://test.pact.dius.com.au/',
      // pactBrokerUsername: 'dXfltyFMgNOFZAxr8io9wJ37iUpY42M',
      // pactBrokerPassword: 'O5AIZWxelWbLvqMd8PkAVycBJh2Psyg1',
      // publishVerificationResult: true,
      tags: ['prod'],
      providerVersion: '1.0.0',
    }

    return new Verifier().verifyProvider(opts).then(output => {
      console.log('Pact Verification Complete!')
      console.log(output)
    })
  })
})
