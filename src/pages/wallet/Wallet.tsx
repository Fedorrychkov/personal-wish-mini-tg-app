import { Box, Tab, Tabs } from '@mui/material'
import { MouseEvent, useCallback, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

import { ShareEmoji } from '~/assets'
import { useBalanceButtons } from '~/components/balance'
import { NumberFormat } from '~/components/NumberFormat'
import { UserHeader } from '~/components/user'
import {
  START_PAYLOAD_KEYS,
  TRANSACTION_DEPOSIT_COMISSION,
  TRANSACTION_NEW_USER_REFFERER_XTR_AMOUNT,
  TRANSACTION_NEW_USER_XTR_AMOUNT,
  TRANSACTION_USER_REFFERER_XTR_COMISSION,
  TRANSACTION_WITHDRAW_COMISSION,
} from '~/constants'
import { transactionCurrencyLabels } from '~/entities'
import { useTgBack } from '~/hooks'
import { DefaultLayout } from '~/layouts/default'
import { useAuth } from '~/providers'
import { useTransactionRefferalBalanceQuery, useTransactionUserBalanceQuery } from '~/query'
import { ROUTE } from '~/router'
import { shareTgLink, tgLink } from '~/utils'

export const WalletPage = () => {
  const { user } = useAuth()
  const location = useLocation()

  const [value, setValue] = useState<string>('0')

  const { data: balance } = useTransactionUserBalanceQuery(!!user?.id && value === '0')
  const { data: refferalBalance } = useTransactionRefferalBalanceQuery(!!user?.id && value === '1')

  const handleChange = (_: React.SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  const { actionButtons } = useBalanceButtons()

  useTgBack({
    defaultBackPath: location.state?.prevPage || ROUTE.home,
  })

  const refferalPayload = `${START_PAYLOAD_KEYS.refferalSystem}${btoa(user?.id?.toString() || '')}`

  const refferalLink = `${tgLink}${refferalPayload}`

  const handleShare = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      e.stopPropagation()

      shareTgLink(refferalPayload, false)
    },
    [refferalPayload],
  )

  return (
    <DefaultLayout className="!px-0">
      <div className="flex flex-col flex-1 min-h-[100vh]">
        <UserHeader className="self-center bg-gray-200 dark:bg-slate-400 w-full py-4" editable={false} />
        <div className="flex flex-col gap-2 flex-1">
          <div className="px-4 flex justify-between items-center">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-2">Кошелек</h3>
          </div>
          <div className="flex justify-center items-center gap-4">{actionButtons}</div>
          <div className="flex flex-col flex-1 gap-4 bg-white dark:bg-slate-600 rounded-lg">
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={value} onChange={handleChange} aria-label="Santa game tabs" variant="scrollable">
                <Tab label="Баланс" value="0" className="w-[50%]" />
                <Tab label="Реферальная система" value="1" className="w-[50%]" />
              </Tabs>
            </Box>
            <div className="flex flex-col gap-4 mt-4">
              <div role="tabpanel" hidden={value !== '0'} id="simple-tabpanel-0" aria-labelledby="simple-tab-0">
                {value === '0' && (
                  <div className="flex flex-col gap-4 mt-1">
                    <div className="flex flex-col gap-1 items-center justify-center px-4">
                      <p className="text-slate-800 dark:text-slate-200 text-[14px] font-bold">
                        Общий внутренний баланс
                      </p>
                      {balance?.length ? (
                        <>
                          {balance.map((item) => (
                            <p
                              key={item.currency}
                              className="text-slate-800 dark:text-slate-200 text-[14px] font-medium"
                            >
                              <NumberFormat value={item.amount} />{' '}
                              {item.currency ? transactionCurrencyLabels[item.currency] || item.currency : ''}
                            </p>
                          ))}
                        </>
                      ) : (
                        <p className="text-slate-800 dark:text-slate-200 text-[14px] font-medium">
                          На балансе нет средств
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col gap-1 px-4">
                      <Link
                        to={ROUTE.transaction}
                        state={{ prevPage: ROUTE.wallet }}
                        className="text-blue-500 dark:text-blue-400 text-[14px] font-normal text-center"
                      >
                        Открыть историю транзакций
                      </Link>
                    </div>
                    <div className="flex flex-col gap-1 items-center justify-center w-full m-auto px-4">
                      <p className="text-slate-500 dark:text-slate-400 text-[14px] font-bold text-left">
                        Условия возврата средств
                      </p>
                      <p className="text-slate-500 dark:text-slate-400 text-[14px] font-normal text-left">
                        1. Все транзакции доступны в Истории транзакций, от туда же можно вызвать возврат средств, так
                        же можно сделать это из бота, в личных сообщениях
                      </p>
                      <p className="text-slate-500 dark:text-slate-400 text-[14px] font-normal text-left">
                        2. Каждая транзакция пополнения баланса/доната можно вернуть в течении 21 дня
                      </p>
                      <p className="text-slate-500 dark:text-slate-400 text-[14px] font-normal text-left">
                        3. Если при попытке возврата средств, на вашем внутреннем балансе меньше той суммы, которую вы
                        хотите вернуть, возврат не будет проведен.
                      </p>
                      <p className="text-slate-500 dark:text-slate-400 text-[14px] font-normal text-left">
                        4. Чтобы вернуть транзакцию, необходимо, чтобы на балансе было ровно столько же, на сколько вы
                        вносили средства ранее, то есть достаточно ввести необходимую сумму на баланс, чтобы вывод
                        транзакции стал доступен
                      </p>
                      <p className="text-slate-500 dark:text-slate-400 text-[14px] font-normal text-left">
                        5. Оплаты внутри приложения нельзя отменить или вернуть
                      </p>

                      <p className="text-slate-500 dark:text-slate-400 text-[14px] font-bold text-left">
                        Комиссии внутри приложения
                      </p>
                      <p className="text-slate-500 dark:text-slate-400 text-[14px] font-normal text-left">
                        1. Транзакции пополнения баланса облагаются комиссией в размере {TRANSACTION_DEPOSIT_COMISSION}%
                        от суммы пополнения. Возврат средств производится в полном объеме с учетом комиссии
                      </p>
                      <p className="text-slate-500 dark:text-slate-400 text-[14px] font-normal text-left">
                        2. Транзакции вывода средств облагаются комиссией в размере {TRANSACTION_WITHDRAW_COMISSION} от
                        суммы вывода. Возврат средств производится в полном объеме с учетом комиссии
                      </p>
                      <p className="text-slate-500 dark:text-slate-400 text-[14px] font-normal text-left">
                        3. Внутренние переводы другим пользователям облагаются комиссией в размере{' '}
                        {TRANSACTION_WITHDRAW_COMISSION}% от суммы
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <div role="tabpanel" hidden={value !== '1'} id="simple-tabpanel-1" aria-labelledby="simple-tab-1">
                {value === '1' && (
                  <div className="flex flex-col gap-4 mt-1">
                    <div className="flex flex-col gap-1 items-center justify-center px-4">
                      <p className="text-slate-800 dark:text-slate-200 text-[14px] font-bold">Реферальная система</p>
                      <p className="text-slate-800 dark:text-slate-200 text-[14px] font-normal">
                        Ваша реферальная ссылка, которую можно отправить друзьям и знакомым
                      </p>
                      <div className="flex flex-col gap-1 items-center justify-center my-2">
                        <button
                          type="button"
                          className="flex items-center justify-center gap-2 border-none bg-slate-200 dark:bg-slate-300 rounded-lg hover:opacity-[0.8] text-sm text-slate-900 dark:text-white py-2 px-4"
                          title="Поделиться"
                          onClick={handleShare}
                        >
                          <span className="text-sm text-blue-500 dark:text-blue-400">{refferalLink}</span>
                          <ShareEmoji className="text-lg" />
                        </button>
                      </div>

                      <div className="flex flex-col gap-1 my-2">
                        <p className="text-slate-800 dark:text-slate-200 text-[14px] font-medium">
                          Реферальный баланс ожидающий размороку
                        </p>
                        {refferalBalance?.length ? (
                          <>
                            {refferalBalance.map((item) => (
                              <p
                                key={item.currency}
                                className="text-slate-800 dark:text-slate-200 text-[14px] font-medium"
                              >
                                <NumberFormat value={item.amount} />{' '}
                                {item.currency ? transactionCurrencyLabels[item.currency] || item.currency : ''}
                              </p>
                            ))}
                          </>
                        ) : (
                          <p className="text-slate-800 dark:text-slate-200 text-[14px] font-medium">
                            Нет ожидающих разблокировку средств
                          </p>
                        )}
                      </div>

                      <p className="text-slate-800 dark:text-slate-200 text-[14px] font-medium">
                        Вы можете зарабатывать внутри бота, приглашая новых пользователей.
                      </p>
                      <p className="text-slate-800 dark:text-slate-200 text-[14px] font-normal">
                        Все реферальные отчисления, включая бонусы, отображаются в истории транзакций
                      </p>
                      <p className="text-slate-800 dark:text-slate-200 text-[14px] font-normal">
                        Реферальные отчисления становятся доступны на балансе по истечении 21 дня после пополнния
                        баланса Вашими приглашенными пользователями
                      </p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Link
                        to={ROUTE.transaction}
                        state={{ prevPage: ROUTE.wallet }}
                        className="text-blue-500 dark:text-blue-400 text-[14px] font-normal text-center"
                      >
                        Открыть историю транзакций
                      </Link>
                    </div>
                    <div className="flex flex-col gap-1 items-center justify-center w-full m-auto px-4">
                      <p className="text-slate-500 dark:text-slate-400 text-[14px] font-bold text-left">
                        Условия реферальной системы
                      </p>
                      <p className="text-slate-500 dark:text-slate-400 text-[14px] font-normal text-left">
                        <i>
                          Условия реферальной системы могут быть изменены в любой момент, без предварительного
                          уведомления. Следите за обновлениями в боте или приложении.
                        </i>
                      </p>
                      <p className="text-slate-500 dark:text-slate-400 text-[14px] font-normal text-left">
                        1. Если кто-то запустит бота по вашей ссылке, вы получите{' '}
                        {TRANSACTION_NEW_USER_REFFERER_XTR_AMOUNT} ${transactionCurrencyLabels['XTR']} за каждого
                        пользователя
                      </p>
                      <p className="text-slate-500 dark:text-slate-400 text-[14px] font-normal text-left">
                        2. При пополнении баланса пользователем, вы получите ${TRANSACTION_USER_REFFERER_XTR_COMISSION}%
                        от суммы пополнения, однако, если пользователь отменит оплату, ваша комиссия так же будет
                        отменена
                      </p>
                      <p className="text-slate-500 dark:text-slate-400 text-[14px] font-normal text-left">
                        3. Приглашенный пользователь получает на баланс {TRANSACTION_NEW_USER_XTR_AMOUNT}{' '}
                        {transactionCurrencyLabels['XTR']}
                      </p>
                      <p className="text-slate-500 dark:text-slate-400 text-[14px] font-normal text-left">
                        4. Бонусы за приглашение пользователей начисляются моментально на Ваш баланс и баланс
                        приглашенного пользователя
                      </p>
                      <p className="text-slate-500 dark:text-slate-400 text-[14px] font-normal text-left">
                        5. Реферальные отчисления добавляются на баланс по истечении 21 дня после пополнения баланса
                        приглашенным пользователем
                      </p>
                      <p className="text-slate-500 dark:text-slate-400 text-[14px] font-normal text-left">
                        6. Если приглашенный пользователь отменяет свою транзакцию пополнения в течении 21 дня,
                        реферальные отчисления так же будут отменены
                      </p>
                      <p className="text-slate-500 dark:text-slate-400 text-[14px] font-bold text-left">
                        Вывод средств
                      </p>
                      <p className="text-slate-500 dark:text-slate-400 text-[14px] font-normal text-left">
                        1. Так как реферальные отчисления начисляются на Ваш баланс, вы можете вывести их в любое время
                        после истечения 21 дня с момента зачисления средств приглашенным пользователем
                      </p>
                      <p className="text-slate-500 dark:text-slate-400 text-[14px] font-bold text-left">
                        Альтернативная реферальная система
                      </p>
                      <p className="text-slate-500 dark:text-slate-400 text-[14px] font-normal text-left">
                        1. Бот так же участвует в реферальной системе Telegram, которая позволяет зарабатывать на
                        пополнениях пользователей звездами в любом виде. (Донаты или пополнение внутреннего баланса)
                      </p>
                      <p className="text-slate-500 dark:text-slate-400 text-[14px] font-normal text-left">
                        2. Принять участие в реферальной системе можно в настройках бота/Вашего профиля или канала
                        посредствам интерфейса мессенджера Telegram
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <div className="h-[64px]" />
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  )
}
