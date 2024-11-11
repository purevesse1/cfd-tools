import axios from 'axios'
import {
  CreatePositionBody,
  DealRef,
  PositionsInfo,
  SessionCred,
  SessionInfo,
  UpdatePositionBody,
} from './interfaces'

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

export async function sessionInfo(cred: SessionCred): Promise<SessionInfo> {
  const response = await sessionApi(cred).get('/session')

  return response.data
}

export async function allPositions(cred: SessionCred): Promise<PositionsInfo> {
  const response = await sessionApi(cred).get('/positions')

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

export async function deletePosition(
  cred: SessionCred,
  dealId: string,
): Promise<DealRef> {
  const response = await sessionApi(cred).delete(`/positions/${dealId}`)

  return response.data
}
