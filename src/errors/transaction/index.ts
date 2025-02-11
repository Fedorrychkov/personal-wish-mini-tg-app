export const ERROR_CODES = {
  TRANSACTION_NOT_FOUND: 'TRANSACTION_NOT_FOUND',
  TRANSACTION_REFUNDABLE_EXPIRAED: 'TRANSACTION_REFUNDABLE_EXPIRAED',
  TRANSACTION_NOT_REFUNDABLE: 'TRANSACTION_NOT_REFUNDABLE',
  TRANSACTION_NOT_CONFIRMED: 'TRANSACTION_NOT_CONFIRMED',
  TRANSACTION_SUPPORT_CURRENCY_ONLY_XTR: 'TRANSACTION_SUPPORT_CURRENCY_ONLY_XTR',
  TRANSACTION_NOT_SUPPORT_CURRENCY: 'TRANSACTION_NOT_SUPPORT_CURRENCY',
  TRANSACTION_ALREADY_REFUNDED: 'TRANSACTION_ALREADY_REFUNDED',
  TRANSACTION_BALANCE_NOT_AVAILABLE: 'TRANSACTION_BALANCE_NOT_AVAILABLE',
  TRANSACTION_NOT_ENOUGH_BALANCE: 'TRANSACTION_NOT_ENOUGH_BALANCE',
  TRANSACTION_TARGET_USER_EMPTY_OR_EQUAL_USER: 'TRANSACTION_TARGET_USER_EMPTY_OR_EQUAL_USER',
}

export const TRANSLATIONS = {
  [ERROR_CODES.TRANSACTION_NOT_FOUND]: 'Транзакция не найдена, обратитесь к администратору бота',
  [ERROR_CODES.TRANSACTION_REFUNDABLE_EXPIRAED]: 'Транзакция не может быть возвращена, так как прошло больше 21 дня',
  [ERROR_CODES.TRANSACTION_NOT_REFUNDABLE]: 'Транзакция не может быть возвращена',
  [ERROR_CODES.TRANSACTION_NOT_CONFIRMED]:
    'Транзакция не может быть возвращена, так как не находится в статусе подтвержденной',
  [ERROR_CODES.TRANSACTION_SUPPORT_CURRENCY_ONLY_XTR]: 'Поддержка разработки возможна только в XTR',
  [ERROR_CODES.TRANSACTION_NOT_SUPPORT_CURRENCY]: 'Валюта не поддерживается для данного типа транзакции',
  [ERROR_CODES.TRANSACTION_BALANCE_NOT_AVAILABLE]: 'Недостаточно средств на балансе для возврата платежа',
  [ERROR_CODES.TRANSACTION_ALREADY_REFUNDED]: 'Транзакция уже возвращена',
  [ERROR_CODES.TRANSACTION_NOT_ENOUGH_BALANCE]: 'Недостаточно средств на балансе',
  [ERROR_CODES.TRANSACTION_TARGET_USER_EMPTY_OR_EQUAL_USER]: 'Некорректный пользователь для перевода',
}
