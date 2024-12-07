import { beforeAll, beforeEach, describe, expect, test } from '@jest/globals'
import * as api from '../src/api/methods'
import { PositionsInfo, SessionCred } from '../src/api/types'

// const DAPI = 'https://demo-api-capital.backend-capital.com/api/v1'
// const STOP_PERCENT = 5

let cred: SessionCred

describe('API Test', () => {
  beforeAll(async () => {
    cred = await api.initSession()
  })

  beforeEach(async () => {
    await api.deleteAllPositions(cred)
  })

  test('get time', async () => {
    const time = await api.serverTime()
    expect(time).toBeTruthy()
  })


  test('open session', async () => {
    expect(cred.cst).toBeTruthy()
    expect(cred.sec).toBeTruthy()
  })

  test('ping', async () => {
    const status = await api.ping(cred)

    expect(status.status).toBe('OK')
  })

  test('create position', async () => {
    const silver = await api.createPosition(cred, {
      epic: 'SILVER',
      direction: 'BUY',
      size: 1,
    })

    expect(silver.dealReference).toBeTruthy()

    await new Promise(r => setTimeout(r, 1000))

    const ap = await api.allPositions(cred)
    // expect(ap).toBeDefined()
    const [{ position, market }] = ap.positions

    expect(position).toMatchObject({ size: 1, direction: 'BUY' })
    expect(market).toHaveProperty('epic', 'SILVER')
  })

  test('update position', async () => {
    await api.createPosition(cred, {
      epic: 'SILVER',
      direction: 'BUY',
      size: 1,
    })

    await new Promise(r => setTimeout(r, 1000))

    const ap = await api.allPositions(cred)
    let [{ position }] = ap.positions

    const updSilver = await api.updatePosition(cred, position.dealId, {
      guaranteedStop: true,
      stopDistance: 3,
      profitAmount: 2,
    })

    expect(updSilver.dealReference).toBeTruthy()

    await new Promise(r => setTimeout(r, 2000))

    const updAp = await api.allPositions(cred)
    // let [{ position, market }] = updAp.positions

    expect(updAp.positions[0].position).toMatchObject({
      guaranteedStop: true,
      // stopLevel: updAp.positions[0].position.level - 3,
      // profitLevel: updAp.positions[0].position.level + 2,
    })
    // console.log(updAp.positions[0].position)
    expect(updAp.positions[0].market).toHaveProperty('epic', 'SILVER')
  })

  test('delete position', async () => {
    await api.createPosition(cred, {
      epic: 'SILVER',
      direction: 'BUY',
      size: 1,
    })

    await new Promise(r => setTimeout(r, 1000))

    const ap = await api.allPositions(cred)
    // expect(ap).toBeDefined()
    const [{ position, market }] = ap.positions

    const silverId = await api.getPosition(cred, position.dealId)
    expect(silverId).toBeTruthy()

    const deleteSilver = await api.deletePosition(cred, position.dealId)
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
