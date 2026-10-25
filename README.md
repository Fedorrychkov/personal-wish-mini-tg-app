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
## Production: automatic HTTPS

Production uses `docker-compose.prod.yml`, `scripts/deploy-production.sh` and the GitHub
`Production Deploy` workflow. Local/stage Compose and Certbot files are not the production path.

- Application images are built in GitHub Actions and pushed to private GHCR with a commit SHA tag.
- Runtime env and service-account files are uploaded separately with mode 600, outside the image.
- The server directory is `~/services/personal-wish-list-tg-mini-app` and the Compose project is `personal-wish-list-tg-mini-app`.
- No global Docker prune, shared directory swaps or `compose down` run during deployment.
- Requires Docker Engine, Compose v2, Bash, `flock`, curl, outbound HTTPS and GitHub Packages access.
- Existing SSH secrets `PROD_API_HOST`, `PROD_API_USERNAME`, `PROD_API_PASSWORD`
  are reused; optional `PROD_SSH_KEY` selects SSH key authentication.
- Runtime/build settings come from the existing `ENV_PROD` secret.

Caddy obtains publicly trusted Let's Encrypt certificates and renews them automatically.
External Docker volumes `personal-wish-list-tg-mini-app-caddy-data` and `personal-wish-list-tg-mini-app-caddy-config`
survive app/image updates. Do not delete these volumes. Old certificate GitHub secrets are unused.
Public DNS for `wish-bot-app.dev-api-services.com` must point to this server; inbound TCP 80/443 must be open.
The deploy checks public HTTPS with normal certificate verification, without `curl -k`.

Validation: `bash -n scripts/deploy-production.sh`, `shellcheck scripts/deploy-production.sh`,
`actionlint .github/workflows/production-deploy.yml`, `node --test scripts/production-deploy.test.mjs`.
Do not trigger the production workflow until the server migration and DNS are ready.

Production deployment is manual only: GitHub → Actions → Production Deploy → Run workflow
(select `main` after merging the PR). Merging or pushing a commit does not deploy.

Pull requests run `Deployment Checks` automatically without production secrets.
These checks never connect to the VPS or start a production deployment.

The WishList servers currently have only Compose v1. If `docker compose` is missing,
the first manual deployment installs Ubuntu's `docker-compose-v2` package before
stopping any application containers. A failed installation aborts the deployment.
