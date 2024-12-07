import log from 'sistemium-debug'
import * as api from './methods'
import { AxiosError } from 'axios'

const STOP_PERCENT = Number(process.env.STOP_PERCENT)

const { debug, error } = log('api:index')

async function main() {
  const cred = await api.initSession()
  debug('cred:', JSON.stringify(cred))
  // const info = await api.sessionInfo(cred)
  const ap = await api.allPositions(cred)
  debug('positions:', ap.positions.length)
  ap.positions.forEach(pos => {
    debug('position:', pos.position.direction, pos.market.epic, pos.position.size)
  })

  const silver = await api.createPosition(cred, {
    epic: 'SILVER',
    direction: 'BUY',
    size: 1,
    guaranteedStop: true,
    stopLevel: 20,
    profitLevel: 27,
  })

  const [{ position, market }] = ap.positions
  const stopDistance = market.bid * STOP_PERCENT * 0.01
  debug(
    position.dealId,
    market.bid,
    market.epic,
    stopDistance,
    market.bid - stopDistance,
  )

  // await api.updatePosition(cred, position.dealId, {
  //   guaranteedStop: false,
  //   stopDistance,
  // })

  // await api.deletePosition(cred, position.dealId)

  const silverDealRef = await api.getPosition(cred, silver.dealReference)
  debug(silverDealRef)
}

main().catch((e: AxiosError) => {
  error('error:', e.status, e.response?.data)
})
