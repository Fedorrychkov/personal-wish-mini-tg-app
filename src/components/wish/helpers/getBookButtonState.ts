import { User } from '~/entities'
import { Wish } from '~/entities/wish'

export const getBookButtonState = (wish?: Wish, user?: User) => {
  if (wish?.isBooked) {
    let text = ''
    let disabled = false

    if (wish?.bookedUserId === user?.id) {
      text = wish?.userId === user?.id ? 'Снять бронь' : 'Не хочу дарить'
    } else {
      text = 'Забронировано'
      disabled = true
    }

    return {
      text,
      disabled,
    }
  }

  const text = wish?.userId === user?.id ? 'Забронировать' : 'Хочу подарить'

  return {
    text,
    disabled: false,
  }
}
