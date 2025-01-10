import { initUtils } from '@tma.js/sdk'

const utils = initUtils()

export const tgUtils = utils

export const tgLink = 'https://t.me/personal_wish_list_bot?start='

export const shareTgLink = (path: string, withCrypto = true) => {
  const payload = withCrypto ? window.btoa(path) : path
  const parsed = payload?.replace('=', '')?.replace('=', '')
  utils.shareURL(`${tgLink}${parsed}`)
}
