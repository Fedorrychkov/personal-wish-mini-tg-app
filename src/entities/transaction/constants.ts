import { AnyCurrency } from '~/types'

import { TransactionProvider, TransactionStatus, TransactionType } from './transaction.type'

export const transactionStatusLabels: Record<TransactionStatus, string> = {
  [TransactionStatus.CREATED]: 'Создана',
  [TransactionStatus.PENDING]: 'В ожидании',
  [TransactionStatus.PAID]: 'Оплачена',
  [TransactionStatus.FAILED]: 'Не удалась',
  [TransactionStatus.CONFIRMED]: 'Подтверждена',
  [TransactionStatus.CANCELLED]: 'Отменена',
  [TransactionStatus.REFUNDED]: 'Возвращена',
}

export const transactionStatusColors: Record<TransactionStatus, string> = {
  [TransactionStatus.CREATED]: 'text-slate-400',
  [TransactionStatus.PENDING]: 'text-yellow-400',
  [TransactionStatus.PAID]: 'text-green-400',
  [TransactionStatus.FAILED]: 'text-red-400',
  [TransactionStatus.CONFIRMED]: 'text-blue-400',
  [TransactionStatus.CANCELLED]: 'text-gray-400',
  [TransactionStatus.REFUNDED]: 'text-purple-400',
}

export const transactionStatusIcons: Record<TransactionStatus, string> = {
  [TransactionStatus.CREATED]: '🚀',
  [TransactionStatus.PENDING]: '⏳',
  [TransactionStatus.PAID]: '💰',
  [TransactionStatus.FAILED]: '❌',
  [TransactionStatus.CONFIRMED]: '✅',
  [TransactionStatus.CANCELLED]: '🚫',
  [TransactionStatus.REFUNDED]: '💸',
}

export const transactionTypeLabels: Record<TransactionType, string> = {
  [TransactionType.USER_WITHDRAW]: 'Вывод',
  [TransactionType.USER_TOPUP]: 'Пополнение',
  [TransactionType.GAME_TOPUP]: 'Оплата участия',
  [TransactionType.SUPPORT]: 'Донат',
  [TransactionType.REFUND]: 'Возврат',
  [TransactionType.PURCHASE]: 'Покупка в приложении',
}

export const transactionTypeColors: Record<TransactionType, string> = {
  [TransactionType.USER_WITHDRAW]: 'text-red-200',
  [TransactionType.USER_TOPUP]: 'text-green-200',
  [TransactionType.GAME_TOPUP]: 'text-blue-200',
  [TransactionType.SUPPORT]: 'text-yellow-400',
  [TransactionType.REFUND]: 'text-purple-200',
  [TransactionType.PURCHASE]: 'text-red-200',
}

export const transactionTypeIcons: Record<TransactionType, string> = {
  [TransactionType.USER_WITHDRAW]: '💸',
  [TransactionType.USER_TOPUP]: '💰',
  [TransactionType.GAME_TOPUP]: '🎮',
  [TransactionType.SUPPORT]: '💖',
  [TransactionType.REFUND]: '💸',
  [TransactionType.PURCHASE]: '🛒',
}

export const transactionProviderLabels: Record<TransactionProvider, string> = {
  [TransactionProvider.TELEGRAM]: 'Telegram',
  [TransactionProvider.BLOCKCHAIN]: 'Blockchain',
  [TransactionProvider.INTERNAL]: 'Внутренний перевод',
}

export const transactionCurrencyLabels: Record<AnyCurrency, string> = {
  XTR: '⭐',
  TON: '💎',
}
