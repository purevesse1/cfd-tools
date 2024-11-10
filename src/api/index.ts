import log from 'sistemium-debug'
import * as api from './methods'
import { AxiosError } from 'axios'

const STOP_PERCENT = Number(process.env.STOP_PERCENT)

const { debug, error } = log('api:index')

async function main() {
  const cred = await api.initSession()
  const info = await api.sessionInfo(cred)
  const ap = await api.allPositions(cred)

  // ap.positions.forEach(pos => {
  //   debug(pos)
  // })

  const [{ position, market }] = ap.positions
  const stopDistance = market.bid * STOP_PERCENT * 0.01
  debug(position.dealId, market.bid, market.epic, stopDistance, market.bid - stopDistance)

  await api.updatePosition(cred, position.dealId, {
    guaranteedStop: false,
    stopDistance,
  })
}

main().catch((e: AxiosError) => {
  error(e)
})
