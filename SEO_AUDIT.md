# Technical SEO audit

Дата аудита: 2026-07-06. Источник аудита: локальные файлы репозитория `C:\Users\Имя_Пользователя\Documents\Авто-маляр`. Внешний crawl, Google Search Console, Lighthouse/PageSpeed и live HTTP-заголовки не проверялись, потому что в задаче использовалась локальная рабочая копия.

## Стек и структура

| Пункт | Вывод | Источник |
|---|---|---|
| Стек | Статический HTML/CSS/JS сайт без `package.json` и без доступных npm scripts. | `index.html`, `variants/premium-onepage/*.html`, `variants/premium-onepage/script.js`, проверка `Test-Path package.json` |
| Основная страница | Основной публичный вариант сайта расположен в `variants/premium-onepage/index.html`; корневой `index.html` выполняет переход на `/variants/premium-onepage/`. | `index.html`, `variants/premium-onepage/index.html` |
| Домен | В metadata, `robots.txt` и `sitemap.xml` используется `https://avtomalyar.vercel.app`. | `robots.txt`, `sitemap.xml`, `variants/premium-onepage/*.html` |
| Язык | Все проверенные HTML-страницы имеют `html lang="ru"`. | `index.html`, `404.html`, `variants/premium-onepage/*.html` |
| Тип сайта | Локальная структура и контент соответствуют сайту автосервиса/станции кузовного ремонта с формой заявки и правовыми страницами. | `variants/premium-onepage/index.html`, `variants/premium-onepage/offer.html`, `variants/premium-onepage/privacy-policy.html`, `variants/premium-onepage/personal-data-consent.html` |

## Что уже было реализовано до аудита

| SEO-зона | Состояние | Источник |
|---|---|---|
| `robots.txt` | Файл существует, разрешает crawl для всех user-agent и содержит ссылку на sitemap. | `robots.txt` |
| `sitemap.xml` | Файл существовал, но содержал только один URL. | `sitemap.xml` |
| Title/description | У основной и правовых страниц уже были title и meta description. | `variants/premium-onepage/*.html` |
| Canonical | У основной и правовых страниц уже были canonical URL; у основной страницы canonical указывал на `/index.html`. | `variants/premium-onepage/*.html` |
| Open Graph | У основной и правовых страниц уже были базовые OG-теги. | `variants/premium-onepage/*.html` |
| JSON-LD | На основной странице уже был `AutoRepair` / `LocalBusiness` JSON-LD. | `variants/premium-onepage/index.html` |
| H1 | У основной страницы и правовых страниц есть H1. | `variants/premium-onepage/*.html` |

## Что изменено

| Файл | Изменение |
|---|---|
| `index.html` | Корневой redirect переведен на `/variants/premium-onepage/`, добавлены `noindex,follow`, description и абсолютный canonical на основную страницу. |
| `sitemap.xml` | Sitemap расширен до 4 URL: основная страница, оферта, политика конфиденциальности, согласие на обработку персональных данных. `lastmod` обновлен до даты этого аудита, потому что эти файлы изменены в текущем проходе. |
| `variants/premium-onepage/index.html` | Canonical и `og:url` согласованы с `/variants/premium-onepage/`; добавлены Twitter/X title, description, image, image alt; OG image заменен на существующее изображение `assets/optimized/paint-car-brown-hero-1440.jpg` с размерами 1440x810; JSON-LD расширен до `WebSite`, `AutoRepair`/`LocalBusiness`, `FAQPage`. |
| `variants/premium-onepage/index.html` | Alt для изображений кейсов заменены с общих `Фото 1/Фото 2` на описания состояния автомобиля до/после ремонта. |
| `variants/premium-onepage/offer.html` | Добавлены OG image dimensions/alt и Twitter/X metadata. |
| `variants/premium-onepage/privacy-policy.html` | Добавлены OG image dimensions/alt и Twitter/X metadata. |
| `variants/premium-onepage/personal-data-consent.html` | Добавлены OG image dimensions/alt и Twitter/X metadata. |
| `404.html` | Добавлена минимальная 404-страница с `lang="ru"`, `noindex,follow`, title, description и ссылкой на основной сайт. |

## Scorecard

| Зона | Оценка | Evidence | Остаточный риск / действие |
|---|---:|---|---|
| Crawlability | 8/10 | `robots.txt` есть; `sitemap.xml` парсится как XML и содержит 4 уникальных URL. | Live crawl не запускался; после деплоя проверить `https://avtomalyar.vercel.app/robots.txt` и sitemap в Google Search Console. |
| Indexability | 7/10 | Публичные страницы имеют canonical; корневой redirect и 404 закрыты через `noindex,follow`; sitemap не содержит API route. | Корневой переход остается client/meta refresh, не server-side redirect; server-side redirect стоит добавлять только после проверки deployment-настроек. |
| Titles/descriptions | 8/10 | Все проверенные HTML имеют title и description. | Сниппеты нужно проверять по live SERP/Search Console после индексации. |
| Social preview | 8/10 | У основной и правовых страниц есть OG и Twitter/X metadata; image взят из существующего файла `assets/optimized/paint-car-brown-hero-1440.jpg`. | Нужно проверить live preview в валидаторах соцсетей после деплоя. |
| Structured data | 8/10 | JSON-LD локально парсится; типы: `WebSite`, `AutoRepair`/`LocalBusiness`, `FAQPage`; FAQ-вопросы совпадают с видимым контентом страницы. | Rich Results Test не запускался; не добавлялись цены, рейтинги, часы работы и отзывы, потому что их нельзя подтвердить из текущей страницы. |
| Images | 8/10 | На основной странице найдено 13 `<img>`, все имеют `alt`. | CSS background hero не имеет HTML `alt`; это ожидаемо для background-image, но social image нужно проверить после деплоя. |
| Mobile | 6/10 | Все проверенные страницы имеют viewport. | Rendered mobile HTML/overflow/tap targets не проверялись браузером в этом проходе. |
| Security/HTTPS | N/A | Локальные файлы не содержат HTTP-заголовков. | Проверить HTTPS enforcement, HSTS и security headers на live-домене после деплоя. |
| International SEO | N/A | Сайт на русском языке; alternate/hreflang не найден. | Hreflang не добавлялся, потому что в проекте не найдены альтернативные языковые версии. |

## Данные, которые требуют ручного подтверждения

- Финальный production-домен, если он отличается от `https://avtomalyar.vercel.app`.
- Нужно ли индексировать правовые страницы или оставить их публичными, но убрать из sitemap.
- Live Search Console данные: coverage, sitemap discovery, crawl errors.
- Core Web Vitals / Lighthouse по мобильной и desktop-версии.
- HTTPS redirects, HSTS и security headers на продакшене.
- Часы работы, рейтинги, отзывы, цены и точные сроки ремонта: они не добавлялись в schema, потому что в текущем видимом контенте их нельзя надежно подтвердить.

## Запущенные проверки

| Проверка | Результат |
|---|---|
| `git diff --check` | Ошибок whitespace не найдено; Git вывел только предупреждения о будущей замене LF на CRLF. |
| XML parse `sitemap.xml` | Успешно; 4 URL, 4 уникальных URL. |
| JSON-LD parse основной страницы | Успешно; 3 узла: `WebSite`, `AutoRepair+LocalBusiness`, `FAQPage`. |
| Metadata scan HTML | `lang`, title и description есть у `index.html`, `404.html` и всех страниц `variants/premium-onepage/*.html`; canonical есть у индексируемых страниц и у корневого redirect. |
| Image alt scan | На `variants/premium-onepage/index.html` найдено 13 изображений, missing alt: 0. |
| `Test-Path package.json` | `False`; package scripts для lint/typecheck/test/build отсутствуют. |

## Следующие действия после merge/deploy

1. Проверить live `robots.txt` и `sitemap.xml`, затем отправить sitemap в Google Search Console.
2. Проверить основную страницу в Rich Results Test, уделив внимание `LocalBusiness` и `FAQPage`.
3. Запустить Lighthouse/PageSpeed для мобильной и desktop-версии, зафиксировать LCP/INP/CLS.
4. Проверить live HTTP: canonical host/protocol, redirect root URL, 404 status, HTTPS enforcement, HSTS и security headers.
5. Проверить social preview для основной страницы и правовых страниц в валидаторах соцсетей.