export const ERROR_CODES = {
  WISH_BOOKED_SOMEBODY: 'WISH_BOOKED_SOMEBODY',
  WISH_NOT_FOUND: 'WISH_NOT_FOUND',
  WISH_PERMISSION_DENIED: 'WISH_PERMISSION_DENIED',
}

export const TRANSLATIONS = {
  [ERROR_CODES.WISH_BOOKED_SOMEBODY]: 'Кто то уже забронировал желание',
  [ERROR_CODES.WISH_NOT_FOUND]: 'Желание не найдено',
  [ERROR_CODES.WISH_PERMISSION_DENIED]: 'У вас нет доступа к этому желанию',
}
