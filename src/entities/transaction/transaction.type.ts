import { AnyCurrency, AnyString } from '~/types'

export type Transaction = {
  id: string
  /**
   * Пользователь, который нажал на Favorite
   */
  userId: string
  status: TransactionStatus
  type: TransactionType
  provider: TransactionProvider
  amount: string
  currency: AnyString
  payload?: string | null
  wishId?: string | null
  providerInvoiceId?: string
  comissionPercent?: number
  comissionAmount?: string
  comissionCurrency?: AnyCurrency
  /**
   * ID игры, к которой привязана транзакция, может быть пустой, еслли это например - поддержка разработчика
   */
  gameId?: string | null
  /**
   * Время до которого можно вернуть деньги
   */
  refundExpiredAt?: string | null
  /**
   * Время когда деньги были возвращены
   */
  refundedAt?: string | null
  /**
   * Время истечения срока транзакции
   */
  expiredAt?: string | null
  createdAt?: string | null
  updatedAt?: string | null
}

export enum TransactionStatus {
  CREATED = 'CREATED',
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

export enum TransactionProvider {
  TELEGRAM = 'TELEGRAM',
  BLOCKCHAIN = 'BLOCKCHAIN',
  INTERNAL = 'INTERNAL',
}

export enum TransactionPayloadType {
  TRANSFER = 'transfer',
  SHOW_WISH_BOOKED_USER = 'show_wish_booked_user',
}

export enum TransactionType {
  /**
   * Когда производится выплата пользователю, конвертация в TON или что-то еще
   */
  USER_WITHDRAW = 'USER_WITHDRAW',
  /**
   * Пополнение баланса, извне или при выигрыше в игре
   */
  USER_TOPUP = 'USER_TOPUP',
  /**
   * Оплата участия в игре, призовой фонд, например
   */
  GAME_TOPUP = 'GAME_TOPUP',
  /**
   * Поддержка разработчика
   */
  SUPPORT = 'SUPPORT',
  /**
   * Возврат денег
   */
  REFUND = 'REFUND',
  /**
   * Оплата в приложении
   */
  PURCHASE = 'PURCHASE',
}

export type TransactionFilter = {
  id?: string
  userId?: string
  type?: TransactionType
  gameId?: string
}

export type TransactionBalanceItem = {
  amount?: string
  currency?: AnyString
}

export type TransactionBalanceTopupResponse = {
  invoiceLink: string
}

export type BalanceTransfer = {
  amount: string
  currency: AnyCurrency
  targetUserId: string
  isAnonymous?: boolean
}

export type TransactionBalanceTopup = {
  amount?: string
  currency?: AnyCurrency
  type?: TransactionType
}

export type TransactionPayload = {
  type: TransactionPayloadType
  message: string
  userId?: string
  isAnonymous?: boolean
}

export type Purchase = {
  amount: string
  currency: AnyCurrency
  payload: TransactionPayload
  wishId?: string
}

export type PurchaseFilter = {
  wishId?: string
}
