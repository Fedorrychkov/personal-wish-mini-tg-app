import { initUtils } from '@tma.js/sdk'

const utils = initUtils()

export const shareTgLink = (path: string) => {
  const payload = window.btoa(path)
  const parsed = payload?.replace('=', '')?.replace('=', '')
  utils.shareURL(`https://t.me/personal_wish_list_bot?start=${parsed}`)
}
