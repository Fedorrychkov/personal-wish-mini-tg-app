import { AxiosInstance } from 'axios'

import { Request } from '~/services'
import { PaginationResponse } from '~/types'

import {
  BalanceTransfer,
  Purchase,
  PurchaseFilter,
  Transaction,
  TransactionBalanceItem,
  TransactionBalanceTopup,
  TransactionBalanceTopupResponse,
} from './transaction.type'

export class ClientTransactionApi {
  private readonly client: AxiosInstance

  constructor() {
    this.client = new Request().apiClient
  }

  async list(pageParam?: string): Promise<PaginationResponse<Transaction>> {
    const response = await this.client.get('/v1/transaction/list', { params: { createdAt: pageParam } })

    return response.data
  }

  async get(id: string): Promise<Transaction> {
    const response = await this.client.get(`/v1/transaction/${id}`)

    return response.data
  }

  async canRefund(id: string): Promise<Transaction> {
    const response = await this.client.get(`/v1/transaction/${id}/can-refund`)

    return response.data
  }

  async refund(id: string): Promise<Transaction> {
    const response = await this.client.patch(`/v1/transaction/${id}/refund`)

    return response.data
  }

  async balance(): Promise<TransactionBalanceItem[]> {
    const response = await this.client.get('/v1/transaction/balance')

    return response.data
  }

  async topup(body: TransactionBalanceTopup): Promise<TransactionBalanceTopupResponse> {
    const response = await this.client.post('/v1/transaction/balance/topup', body)

    return response.data
  }

  async refferalBlockedBalance(): Promise<TransactionBalanceItem[]> {
    const response = await this.client.get('/v1/transaction/balance/refferal')

    return response.data
  }

  async transfer(body: BalanceTransfer): Promise<Transaction> {
    const response = await this.client.post('/v1/transaction/balance/transfer', body)

    return response.data
  }

  async purchase(body: Purchase): Promise<Transaction> {
    const response = await this.client.post('/v1/transaction/purchase', body)

    return response.data
  }

  async findPurchase(filter: PurchaseFilter): Promise<Transaction[]> {
    const response = await this.client.get('/v1/transaction/purchase', { params: filter })

    return response.data
  }
}
