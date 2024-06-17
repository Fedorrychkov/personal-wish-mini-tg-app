import { retrieveLaunchParams } from '@tma.js/sdk'
import axios, { AxiosInstance, CreateAxiosDefaults } from 'axios'

import { API_URL } from '~/config'

export class Request {
  private readonly client: AxiosInstance

  constructor(config?: CreateAxiosDefaults) {
    const { headers, baseURL, ...props } = config || {}

    const launchParams = retrieveLaunchParams()

    this.client = axios.create({
      baseURL: baseURL || API_URL,
      headers: {
        Accept: '*/*',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        ...(headers as any),
      },
      ...props,
    })

    this.client.interceptors.request.use((req) => {
      ;(req.headers as any)?.set('Authorization', launchParams.initDataRaw)

      return req
    })

    return this
  }

  get apiClient() {
    return this.client
  }
}
