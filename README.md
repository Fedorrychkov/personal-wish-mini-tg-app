# Telegram Wishlist Mini App
Веб приложение для [personal-wish-list-bot](https://github.com/Fedorrychkov/personal-wish-list-bot)

Дублирует функционал бота + дает удобное управление и просмотр желаний

### Фичи в планах
- Настраиваемая плитка отображения желаний
- Возможность загрузки изображений без исипользование бота и апи телеграм (на данный момент изображения могут быть лишь ссылками или их загрузка происходит путем добавления фото непосредственно в чате с [ботом](https://t.me/personal_wish_list_bot))

### Development
Мини апп работает в связке с телеграм ботом и [бэкендом](https://github.com/Fedorrychkov/personal-wish-list-bot).
Если корректно развернуть оба проекта и настроить локальные .env файлы, то будет доступна возможность локальной развертки и разработки.

Для локальной разработки мини аппа может потребоваться, (в качестве примера домен: `tg-mini-app.local`), создать локально запись в файле hosts `127.0.0.1 tg-mini-app.local`. Для дебага рекомендую использовать web интерфейс телеграм, от туда удобно смотреть за логами приложения и запросами, так как мини аппа открывается телегой в iframe.

### React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

#### Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
