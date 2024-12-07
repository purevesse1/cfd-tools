export interface SessionCred {
  cst: string
  sec: string
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

export interface OrderInfo {
  dealId: string
  direction: Direction
  epic: string
  orderSize: number
  leverage: number
  orderLevel: number
  timeInForce: string
  goodTillDate: string
  goodTillDateUTC: string
  createdDate: string
  createdDateUTC: string
  guaranteedStop: boolean
  orderType: OrderType
  stopDistance: number
  profitDistance: number
  trailingStop: boolean
  currencyCode: string
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

export interface OrdersInfo {
  workingOrders: {
    workingOrderData: OrderInfo
    marketData: MarketInfo
  }[]
}

export interface DealRef {
  dealReference: string
}

export interface UpdatePositionBody {
  guaranteedStop?: boolean // Must be true if a guaranteed stop is required
  trailingStop?: boolean //	Must be true if a trailing stop is required
  stopLevel?: number // Price level when a stop loss will be triggered
  stopDistance?: number // Distance between current and stop loss triggering price
  stopAmount?: number //	Loss amount when a stop loss will be triggered
  profitLevel?: number //	Price level when a take profit will be triggered
  profitDistance?: number // 	Distance between current and take profit triggering price
  profitAmount?: number // Profit amount when a take profit will be triggered
}

export interface UpdateOrderBody extends UpdatePositionBody {
  level?: number // Order price
  goodTillDate?: string // Order cancellation date in UTC time
}

export interface CreatePositionBody {
  direction: Direction // Deal direction, Must be BUY or SELL
  epic: string // Instrument epic identifier
  size: number // Deal size
  guaranteedStop?: boolean // Must be true if a guaranteed stop is required
  trailingStop?: boolean //	Must be true if a trailing stop is required
  stopLevel?: number // Price level when a stop loss will be triggered
  stopDistance?: number // Distance between current and stop loss triggering price
  stopAmount?: number // Loss amount when a stop loss will be triggered
  profitLevel?: number //	Price level when a take profit will be triggered
  profitDistance?: number // Distance between current and take profit triggering price
  profitAmount?: number // Profit amount when a take profit will be triggered
}

export type OrderType = 'LIMIT' | 'STOP'

export interface CreateOrderBody extends CreatePositionBody {
  type: OrderType // Order type
  goodTillDate?: string // Order cancellation date in UTC time (Date format: YYYY-MM-DDTHH:MM:SS (e.g. 2022-06-09T01:01:00))
}
