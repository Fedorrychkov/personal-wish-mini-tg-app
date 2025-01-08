import { StepType } from '@reactour/tour'

import { OnboardingStep } from './OnboardingStep'

export const ONBOARDING_KEY = 'wishlist-mini-app-onboarding-1'

export const ONBOARDING_DATA_NAME = {
  wishMainTitleData: 'user-wish-header-title',
  wishMainTitleShareData: 'user-wish-header-share',
  mainUserEditAvatar: 'user-edit-avatar',
  wishMainSettingsData: 'user-wish-settings',
  wishSettingsCustomTitleData: 'user-wish-settings-custom-title',
  wishSettingsCustomBackgroundData: 'user-wish-settings-custom-background',
  wishSettingsCategoriesSettings: 'user-wish-settings-categories-settings',
  wishMainNewCategory: 'user-wish-main-category-new',
  wishMainNewWish: 'user-wish-main-wish-new',
  userWishList: 'user-wish-list',
  userFavorites: 'user-favorites',
  userGames: 'user-games',
  userSocial: 'user-social',
  userBalance: 'user-balance',
  userTopup: 'user-topup',
  userTransactions: 'user-transactions',
}

export const ONBOARDING_SELECTORS = {
  mainUserEditAvatar: `[data-tour="${ONBOARDING_DATA_NAME.mainUserEditAvatar}"]`,
  wishMainTitleShareData: `[data-tour="${ONBOARDING_DATA_NAME.wishMainTitleShareData}"]`,
  wishMainTitleData: `[data-tour="${ONBOARDING_DATA_NAME.wishMainTitleData}"]`,
  wishMainSettingsData: `[data-tour="${ONBOARDING_DATA_NAME.wishMainSettingsData}"]`,
  wishSettingsCustomTitleData: `[data-tour="${ONBOARDING_DATA_NAME.wishSettingsCustomTitleData}"]`,
  wishSettingsCustomBackgroundData: `[data-tour="${ONBOARDING_DATA_NAME.wishSettingsCustomBackgroundData}"]`,
  wishSettingsCategoriesSettings: `[data-tour="${ONBOARDING_DATA_NAME.wishSettingsCategoriesSettings}"]`,
  wishMainNewCategory: `[data-tour="${ONBOARDING_DATA_NAME.wishMainNewCategory}"]`,
  wishMainNewWish: `[data-tour="${ONBOARDING_DATA_NAME.wishMainNewWish}"]`,
  userWishList: `[data-tour="${ONBOARDING_DATA_NAME.userWishList}"]`,
  userGames: `[data-tour="${ONBOARDING_DATA_NAME.userGames}"]`,
  userSocial: `[data-tour="${ONBOARDING_DATA_NAME.userSocial}"]`,
  userBalance: `[data-tour="${ONBOARDING_DATA_NAME.userBalance}"]`,
  userTopup: `[data-tour="${ONBOARDING_DATA_NAME.userTopup}"]`,
  userTransactions: `[data-tour="${ONBOARDING_DATA_NAME.userTransactions}"]`,
}

export const ONBOARDING_MAIN_STEPS = (): StepType[] => [
  {
    selector: ONBOARDING_SELECTORS.wishMainTitleData,
    content: (
      <OnboardingStep text="Ваш публичный заголовок желаний, его можно поменять в персональных настройках отображения" />
    ),
  },
  {
    selector: ONBOARDING_SELECTORS.wishMainTitleShareData,
    content: <OnboardingStep text="Чтобы поделиться своей страницей, достаточно нажать на иконку стрелки" />,
  },
  {
    selector: ONBOARDING_SELECTORS.mainUserEditAvatar,
    content: (
      <OnboardingStep text="Для установки новой аватарки достаточно нажать на кнопку карандаша, выбрать подходящее изображение по формату и сохранить нажатием зеленой галочки" />
    ),
  },
  {
    selector: ONBOARDING_SELECTORS.wishMainSettingsData,
    content: <OnboardingStep text="Для попадания в настройки, достаточно нажать на эту иконку" />,
  },
  {
    selector: ONBOARDING_SELECTORS.userSocial,
    content: (
      <OnboardingStep text="У каждого пользователя есть возможность через вкладку избранных формировать свой список подписок и подписчиков" />
    ),
  },
  {
    selector: ONBOARDING_SELECTORS.userBalance,
    content: (
      <OnboardingStep text="Это ваш внутренний баланс, при помощи внутреннего баланса вы можете совершать платежи в этом приложении" />
    ),
  },
  {
    selector: ONBOARDING_SELECTORS.userTopup,
    content: <OnboardingStep text="Пополнение собственнного баланса в приложении" />,
  },
  {
    selector: ONBOARDING_SELECTORS.userTransactions,
    content: <OnboardingStep text="Список транзакций, отображает все транзакции совершенные в приложении" />,
  },
  {
    selector: ONBOARDING_SELECTORS.wishMainNewCategory,
    content: (
      <OnboardingStep text="Добавить новую категорию можно при создании/редактировании желания или нажав на эту кнопку" />
    ),
  },
  {
    selector: ONBOARDING_SELECTORS.wishMainNewWish,
    content: <OnboardingStep text='Добавить желание можно по этой кнопке или выбрав в навигации пункт "Добавить"' />,
  },
  {
    selector: ONBOARDING_SELECTORS.userWishList,
    content: <OnboardingStep text="Это навигация на главную страницу, на которой вы сейчас находитесь" />,
  },
  {
    selector: ONBOARDING_SELECTORS.userGames,
    content: <OnboardingStep text={'В приложении доступны игры, одна из них - "Тайный Санта"'} />,
  },
]
