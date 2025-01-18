import { beforeAll, beforeEach, describe, expect, test } from '@jest/globals'
import * as api from '../src/api/methods'
import { PositionsInfo, SessionCred } from '../src/api/types'

let cred: SessionCred

describe('API Orders Test', () => {
  beforeAll(async () => {
    cred = await api.initSession()
  })

  beforeEach(async () => {
    await api.deleteAllOrders(cred)
  })

  test('get time', async () => {
    const time = await api.serverTime()
    expect(time).toBeTruthy()
  })

  test('open session', async () => {
    expect(cred.cst).toBeTruthy()
    expect(cred.sec).toBeTruthy()
  })

  test('create order', async () => {
    const silver = await api.createOrder(cred, {
      type: 'LIMIT',
      epic: 'SILVER',
      direction: 'BUY',
      size: 1,
    })

    expect(silver.dealReference).toBeTruthy()

    await new Promise(r => setTimeout(r, 1000))

    const ap = await api.allOrders(cred)
    const [{ workingOrderData, marketData }] = ap.orders

    expect(workingOrderData).toMatchObject({ size: 1, direction: 'BUY', type: 'LIMIT' })
    expect(marketData).toHaveProperty('epic', 'SILVER')
  })

  test('update order', async () => {
    await api.createOrder(cred, {
      type: 'LIMIT',
      epic: 'SILVER',
      direction: 'BUY',
      size: 1,
    })

    await new Promise(r => setTimeout(r, 1000))

    const ap = await api.allOrders(cred)
    const [{ workingOrderData, marketData }] = ap.orders

    const updSilver = await api.updateOrder(cred, workingOrderData.dealId, {
      guaranteedStop: true,
      stopDistance: 3,
      profitAmount: 2,
    })

    expect(updSilver.dealReference).toBeTruthy()

    await new Promise(r => setTimeout(r, 2000))

    const updAp = await api.allOrders(cred)

    expect(updAp.orders[0].workingOrderData).toMatchObject({
      guaranteedStop: true,
    })

    expect(updAp.orders[0].marketData).toHaveProperty('epic', 'SILVER')
  })

  test('delete order', async () => {
    await api.createOrder(cred, {
      type: 'LIMIT',
      epic: 'SILVER',
      direction: 'BUY',
      size: 1,
    })

    await new Promise(r => setTimeout(r, 1000))

    const ap = await api.allOrders(cred)
    const [{ workingOrderData, marketData }] = ap.orders

    const deleteSilver = await api.deleteOrder(cred, workingOrderData.dealId)
    expect(deleteSilver).toBeTruthy()

    await new Promise(r => setTimeout(r, 1000))

    const apPostDeletion = await api.allPositions(cred)
    expect(apPostDeletion.positions[0]).toBeFalsy()
  })

  test('log out', async () => {
    const res = await api.logOut(cred)
    expect(res.status).toBe('SUCCESS')
  })

  // console.log(process.env)
  // const stopDistance = market.bid * STOP_PERCENT * 0.01
})
