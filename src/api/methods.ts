import axios, { AxiosError } from 'axios'
import {
  CreateOrderBody,
  CreatePositionBody,
  DealRef,
  OrdersInfo,
  PositionsInfo,
  SessionCred,
  SessionInfo,
  UpdateOrderBody,
  UpdatePositionBody,
} from './types'
import { eachSeries } from 'async'
import exp from 'node:constants'

const { API, API_KEY, API_ID, API_PWD } = process.env

if (!API) {
  throw Error('API env variable must be set')
}

const api = axios.create({
  baseURL: API,
})

function sessionApi(cred: SessionCred) {
  const apiClient = axios.create({
    baseURL: API,
    headers: {
      'X-SECURITY-TOKEN': cred.sec,
      CST: cred.cst,
    },
  })

  apiClient.interceptors.response.use(
    response => response, // Pass through successful responses
    error => handleAxiosError(error), // Handle errors
  )

  return apiClient
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

export async function serverTime(): Promise<SessionInfo> {
  const response = await api.get('/time')

  return response.data
}

export async function ping(cred: SessionCred): Promise<any> {
  const response = await sessionApi(cred).get('/ping')

  return response.data
}

export async function sessionInfo(cred: SessionCred): Promise<SessionInfo> {
  const response = await sessionApi(cred).get('/session')

  return response.data
}

export async function allPositions(cred: SessionCred): Promise<PositionsInfo> {
  const response = await sessionApi(cred).get('/positions')

  return response.data
}

export async function allOrders(cred: SessionCred): Promise<OrdersInfo> {
  const response = await sessionApi(cred).get('/workingorders')

  return response.data
}

export async function getPosition(cred: SessionCred, dealId: string): Promise<DealRef> {
  const response = await sessionApi(cred).get(`/positions/${dealId}`)

  return response.data
}

export async function updatePosition(
  cred: SessionCred,
  dealId: string,
  body: UpdatePositionBody,
): Promise<DealRef> {
  const response = await sessionApi(cred).put(`/positions/${dealId}`, body)

  return response.data
}

export async function createPosition(
  cred: SessionCred,
  body: CreatePositionBody,
): Promise<DealRef> {
  const response = await sessionApi(cred).post(`/positions`, body)

  return response.data
}

export async function createOrder(cred: SessionCred, body: CreateOrderBody): Promise<DealRef> {
  const response = await sessionApi(cred).post(`/workingorders`, body)

  return response.data
}

export async function updateOrder(
  cred: SessionCred,
  dealId: string,
  body: UpdateOrderBody,
): Promise<DealRef> {
  const response = await sessionApi(cred).put(`/workingorders/${dealId}`, body)

  return response.data
}

export async function deletePosition(cred: SessionCred, dealId: string): Promise<DealRef> {
  const response = await sessionApi(cred).delete(`/positions/${dealId}`)

  return response.data
}

export async function deleteOrder(cred: SessionCred, dealId: string): Promise<DealRef> {
  const response = await sessionApi(cred).delete(`/workingorders/${dealId}`)

  return response.data
}

export async function deleteAllPositions(cred: SessionCred): Promise<DealRef[]> {
  const response: DealRef[] = []
  const ap = await allPositions(cred)

  await eachSeries(ap.positions, async item => {
    response.push(await deletePosition(cred, item.position.dealId))
  })

  return response
}

function handleAxiosError(error: AxiosError) {
  if (error.response) {
    return Promise.reject(error.response.data)
  } else if (error.request) {
    return Promise.reject('No response from server. Please check your connection.')
  }
  return Promise.reject(error.message)
}

export async function logOut(cred: SessionCred): Promise<any> {
  const response = await sessionApi(cred).delete('/session')

  return response.data
}
