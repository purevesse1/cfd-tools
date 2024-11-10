import axios from 'axios'

const { DAPI: API, API_KEY, API_ID, API_PWD } = process.env

const api = axios.create({
  baseURL: API,
})

function sessionApi(cred: SessionCred) {
  return axios.create({
    baseURL: API,
    headers: {
      'X-SECURITY-TOKEN': cred.sec,
      CST: cred.cst,
    },
  })
}

export interface SessionCred {
  cst: string
  sec: string
}

export async function initSession(): Promise<SessionCred> {
  const response = await api.post(
    '/session',
    {
      identifier: API_ID,
      password: API_PWD,
    },
    {
      headers: {
        'X-CAP-API-KEY': API_KEY,
      },
    },
  )
  // console.log(response.headers)

  return {
    cst: response.headers.cst,
    sec: response.headers['x-security-token'],
  }
}

export interface SessionInfo {
  clientId: string
  accountId: string
  timezoneOffset: number
  locale: string
  currency: string
  symbol: string
  streamEndpoint: string
}

export async function sessionInfo(cred: SessionCred): Promise<SessionInfo> {
  const response = await sessionApi(cred).get('/session')

  return response.data
}

export type Direction = 'BUY' | 'SELL'

export interface PositionInfo {
  contractSize: number
  createdDate: string
  createdDateUTC: string
  dealId: string
  dealReference: string
  workingOrderId: string
  size: number
  leverage: number
  upl: number
  direction: Direction
  level: number
  currency: string
  guaranteedStop: boolean
}

export interface MarketInfo {
  instrumentName: string
  expiry: string
  marketStatus: 'TRADEABLE'
  epic: string
  symbol: string
  instrumentType: 'INDICES'
  lotSize: number
  high: number
  low: number
  percentageChange: number
  netChange: number
  bid: number
  offer: number
  updateTime: string
  updateTimeUTC: string
  delayTime: number
  streamingPricesAvailable: boolean
  scalingFactor: number
  marketModes: ['REGULAR']
}

export interface PositionsInfo {
  positions: {
    position: PositionInfo
    market: MarketInfo
  }[]
}

export async function allPositions(cred: SessionCred): Promise<PositionsInfo> {
  const response = await sessionApi(cred).get('/positions')

  return response.data
}

export interface DealRef {
  dealReference: string
}

export interface UpdatePositionBody {
  guaranteedStop?: boolean // Must be true if a guaranteed stop is required
  trailingStop?: boolean //	Must be true if a trailing stop is required
  stopLevel?: number // 	Price level when a stop loss will be triggered
  stopDistance?: number // Distance between current and stop loss triggering price
  stopAmount?: number //	Loss amount when a stop loss will be triggered
  profitLevel?: number //	Price level when a take profit will be triggered
  profitDistance?: number // 	Distance between current and take profit triggering price
  profitAmount?: number // Profit amount when a take profit will be triggered
}

export async function updatePosition(
  cred: SessionCred,
  dealId: string,
  body: UpdatePositionBody,
): Promise<DealRef> {
  const response = await sessionApi(cred).put(`/positions/${dealId}`, body)

  return response.data
}
