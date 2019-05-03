const chai = require('chai')
const nock = require('nock')
const chaiAsPromised = require('chai-as-promised')
const expect = chai.expect
const API_PORT = process.env.API_PORT || 9123
const { Order } = require('../order')
chai.use(chaiAsPromised)

const API_HOST = `http://localhost:${API_PORT}`

describe('Consumer', () => {
  describe('when a call to the Provider is made', () => {
    const { fetchOrders } = require('../client')
    const mock = {
      id: 1,
      items: [
        {
          name: 'burger',
          quantity: 2,
          value: 100,
        },
      ],
    }

    it('can process the JSON payload from the provider', () => {
      nock(API_HOST)
        .get('/orders')
        .reply(200, [mock])

      return expect(fetchOrders()).to.eventually.have.deep.members([
        new Order(mock.id, mock.items),
      ])
    })
  })
})
