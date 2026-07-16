# SEO / Analytics / Paid Growth Audit — АвтоМаляр

**Фаза:** A — read-only аудит  
**Дата проверки:** 13.07.2026, Europe/Moscow  
**Канонический домен:** `https://avtomalyarmrpl.ru`  
**Статус:** локальный этап Фазы C по Яндекс Метрике выполнен; деплой, изменение внешних кабинетов, реальная отправка заявки и рекламные кампании не выполнялись.

## 1. Итог для владельца

Техническая база основных HTML-страниц в целом подготовлена: главная и три кейса отдают `200`, имеют self-canonical, уникальные `title`, `description`, H1, Open Graph/Twitter; `robots.txt` разрешает обход и указывает sitemap; старые variant-URL перенаправляются на канонические адреса. Источники: live HTTP-проверка 13.07.2026; `index.html:6-24`; `cases/patriot-body-repair.html:6-23`; `robots.txt:1-4`; `vercel.json:3-39`.

Однако сейчас сайт **не готов к управляемому SEO и платному трафику** по четырём проверяемым причинам:

1. Подключённый `/_vercel/insights/script.js` возвращает `404`; вызов `lead_submit_success` остаётся в локальной очереди `window.vaq`, но загрузчика аналитики на live-сайте нет. Источники: `index.html:112-117`; `variants/premium-onepage/script.js:482-489`; live GET `https://avtomalyarmrpl.ru/_vercel/insights/script.js` — `404` 13.07.2026.
2. `SEO_AUDIT.md` и `SEO_IMPLEMENTATION_REPORT.md` опубликованы на боевом домене с `200`, типом `text/markdown`, без `X-Robots-Tag`; `.vercelignore` их не исключает, а `robots.txt` разрешает обход. Я не могу подтвердить, попали ли эти URL в индекс без Search Console/Яндекс Вебмастера. Источники: live HEAD двух URL 13.07.2026; `.vercelignore:1-16`; `robots.txt:1-4`.
3. В разрешённом локальном этапе Фазы C установлен счётчик Яндекс Метрики № 110708831; GA4 и GTM не установлены. Доступы/экспорты Search Console, Яндекс Вебмастера, Метрики и рекламных кабинетов отсутствуют, поэтому текущие позиции, показы, клики, индексирование, лиды, CPA и поисковый спрос — `N/A`. До деплоя production продолжает работать без нового локального кода.
4. Успешная доставка заявки в Telegram не проверялась: тестовый POST без разрешения владельца не отправлялся. Приложение валидирует поля и передаёт заявку в Telegram, но в репозитории нет rate limit/anti-bot слоя; наличие платформенной защиты Vercel — `N/A`. Источники: `api/request.js:3-54,89-124`; `variants/premium-onepage/script.js:452-489`; live GET `/api/request` — `405 Allow: POST` 13.07.2026.

Новая карточка «3 стапеля на СКР „АвтоМаляр“» существует локально, но на live-сайте её ещё нет: live HTML содержит прежнюю новость и не содержит `/649`. Источники: `index.html:533-545`; live GET `https://avtomalyarmrpl.ru/` 13.07.2026.

## 2. Границы доказательности

- Проверены: файлы репозитория, Git diff/status, публичные HTTP-ответы, публичные DNS-записи, конечная ссылка карты и актуальная официальная документация Google/Яндекса.
- Не проверены: Search Console, Яндекс Вебмастер, GA4, Метрика, Vercel Analytics dashboard, Яндекс Бизнес, Google Business Profile, Директ, Google Ads, CRM, звонки и фактические лиды — доступы не предоставлены.
- Я не могу подтвердить наличие сайта в индексе, текущие позиции, органический трафик, конверсии или срок выхода в топ без данных соответствующих кабинетов.
- `SEO_KEYWORD_MAP.csv` не создан: нет фактических query/impression/click/position/Wordstat-данных. Запросы и частотности не выдумывались.
- Форма не отправлялась, рекламный бюджет не расходовался, внешние свойства/счётчики не создавались.

## 3. Состояние репозитория и сохранность изменений

Рабочее дерево уже содержит пользовательские правки. На момент аудита изменены 9 отслеживаемых файлов и есть неотслеживаемые SEO-отчёты/шрифты. `git diff --check` не выявил ошибок пробелов; показаны только предупреждения будущей нормализации LF → CRLF. Никакие существующие изменения не сбрасывались и не перезаписывались.

Основной SEO-документ — корневой `index.html`; `variants/premium-onepage/index.html` является redirect-wrapper, а live-маршруты перенаправляются через `vercel.json:3-39`.

## 4. Чек-лист SEO/AEO/GEO

| Проверка | Статус | Доказательство | Вывод |
|---|---:|---|---|
| HTTPS canonical origin | есть | `https://avtomalyarmrpl.ru/` → `200`; HTTP → HTTPS `308` | bare HTTPS выбран последовательно |
| `www` → canonical | нет DNS | публичный DNS: `www.avtomalyarmrpl.ru` не существует 13.07.2026 | P2; не ломает bare origin, но нет защитного redirect-host |
| robots.txt | есть | `robots.txt:1-4`; live `200` | обход не заблокирован, sitemap указан |
| sitemap.xml | есть | `sitemap.xml:1-31`; live `200`, XML валиден, 7 URL | все 7 URL отдают final `200` |
| Unique title/description/H1 | есть | локальный парсинг 7 canonical HTML 13.07.2026 | дублей не найдено |
| Self-canonical | есть | `index.html:8`; case/legal heads | 7 canonical совпадают с live URL |
| OG/Twitter | есть | `index.html:9-23`; case/legal heads | обязательные основные поля присутствуют |
| Home schema | есть | `index.html:24-109` | валидный JSON: `WebSite`, `AutoRepair`, `FAQPage` |
| Case schema | частично | `cases/patriot-body-repair.html:23-46` и два аналогичных кейса | есть `WebPage` + `BreadcrumbList`; `Article` не добавлен без подтверждённых дат/автора |
| 404 | есть | live случайный URL → `404`; live HTML содержит `noindex,follow` и ссылку на `/` | корректно |
| Internal links/assets | частично | 29 same-origin ресурсов проверены | единственный live `404` — Vercel Analytics script |
| AI-crawler policy | не зафиксирована | только `User-agent: *` в `robots.txt:1-2` | общий allow применяется; решение владельца отдельно не документировано |
| `llms.txt` | нет | файла нет в репозитории | не является стандартом/ranking factor; добавление не рекомендовано как P0/P1 |
| IndexNow | нет | нет key/publish/ping кода | только опциональное уведомление поддерживающих систем, не гарантия индексации и не Google-инструмент |

## 5. Live HTTP и маршрутизация

Проверка выполнена 13.07.2026 без авторизации.

| URL/группа | Результат |
|---|---|
| `/` | `200`, HTML, self-canonical, один H1, валидный JSON-LD |
| три `/cases/*.html` | `200`, self-canonical, уникальные title/description/H1, валидный JSON-LD |
| `/offer.html`, `/privacy-policy.html`, `/personal-data-consent.html` | `200`, self-canonical, сейчас индексируемые |
| `/index.html` | `308` → `/` |
| `/variants/premium-onepage`, `/variants/premium-onepage/`, `/variants/premium-onepage/index.html` | `308` → `/` |
| HTTP origin | `308` → HTTPS |
| случайный несуществующий URL | `404`, `noindex,follow` в HTML |
| `/_vercel/insights/script.js` | `404` — дефект измерения |
| `/api/request` GET | `405`, `Allow: POST` — метод ограничен корректно |
| `SEO_AUDIT.md`, `SEO_IMPLEMENTATION_REPORT.md` | `200`, `text/markdown`, без `X-Robots-Tag` — служебные файлы публичны |

## 6. Карта URL и интентов

| URL | Фактический интент страницы | Статус | Действие |
|---|---|---:|---|
| `/` | локальный коммерческий: кузовной ремонт, покраска, после ДТП, автослесарные работы | indexable | основной URL; сейчас смешивает несколько услуг |
| `/cases/patriot-body-repair.html` | кейс/доказательство до–после | indexable | сохранить; расширять только подтверждёнными фактами |
| `/cases/honda-accord-after-accident.html` | кейс после ДТП | indexable | сохранить |
| `/cases/kia-sportage-after-accident.html` | кейс после ДТП | indexable | сохранить |
| три legal URL | правовые документы | indexable и в sitemap | нужен выбор владельца: индексировать осознанно или `noindex,follow` + убрать из sitemap |
| отдельные URL услуг | отсутствуют | N/A | создавать 3–5 страниц только после фактических данных спроса и подтверждения материалов |
| собственная news-страница про 3 стапеля | отсутствует | N/A | карточка ведёт в соцсети; owned-страницу создавать только как осознанный editorial URL, без выдуманных характеристик |

Текущий sitemap сигнализирует поисковикам, что legal URL желательны в поисковой выдаче. Официальная документация Google рекомендует включать URL, которые владелец хочет видеть в результатах; это не техническая ошибка, а нерешённая стратегия. Источники: `sitemap.xml:19-30`; [Google sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).

## 7. Реестр проблем: доказательство → механизм → исправление

| Приоритет | Проблема и доказательство | Почему важно | Следующее исправление | Проверка |
|---:|---|---|---|---|
| P0 | Vercel Analytics script live `404`; `index.html:112-117` | page view и custom event этим тегом не передаются | либо включить Web Analytics в правильном Vercel project, либо удалить broken snippet; для маркетинга установить согласованную GA4/Метрика архитектуру | GET script `200`; network: один page_view и одно событие |
| P0 | SEO-отчёты live `200`; `.vercelignore:1-16` их не исключает | служебный контент доступен роботам и пользователям | добавить `SEO_*.md` в `.vercelignore`, redeploy; проверить удаление; при подтверждённой индексации использовать штатное удаление URL | live `404/410`; URL Inspection/Яндекс проверка |
| P0 | GSC/Webmaster/GA4/Метрика access = `N/A` | нельзя доказать индекс, спрос и результат | получить owner-managed доступы и публичные IDs; не запрашивать пароли/секреты | access matrix заполнена; sitemap processed |
| P0 до рекламы | успешный POST не тестировался; app-level anti-bot/rate limit не найден в `api/request.js` | нельзя подтвердить лид; реклама повысит риск спама/расхода без конверсий | после разрешения выполнить одну тестовую заявку, добавить измеримую защиту от злоупотреблений без PII в аналитике | API `200`, Telegram receipt, ровно один `lead_form_success`, abuse test |
| P1 | нет dedicated service URL; все услуги в `/` (`index.html:321-355`) | отдельные подтверждённые интенты нельзя сопоставить отдельным посадочным | сначала экспорт запросов, затем только 3–5 доказанных service pages | query→URL map, unique content, live 200/canonical |
| P1 | Яндекс Бизнес/GBP не подтверждены; map-link ведёт на coordinate pin, не карточку организации | локальные данные и управление карточкой не проверены | получить прямые owner URLs/доступ, сверить NAP/категорию/часы | карточка владельца, URL организации, NAP parity |
| P1 | часы работы, точная зона обслуживания, приоритет услуг и qualified lead не подтверждены | нельзя корректно настроить local profile, расписание и кампанию | письменное подтверждение владельца | заполненный business brief |
| P1 | локальная новая новость не на live; homepage lastmod `2026-07-10` | опубликованный контент отстаёт от одобренной локальной версии | после QA/deploy обновить homepage lastmod на дату реального существенного изменения | live содержит `/649`; sitemap date совпадает с публикацией |
| P1/P2 | legal URL индексируются без подтверждённой цели | возможен нерелевантный индекс и размытая карта URL | принять осознанное решение; если не нужны в поиске — `noindex,follow`, убрать из sitemap | HTML/meta + sitemap + URL Inspection |
| P2 | `www` host отсутствует в DNS | ошибочный ручной ввод `www` не перенаправляется | при наличии доступа добавить alias и permanent redirect на bare origin | DNS + single-hop `308` |
| P2 | статические HTML/CSS/JS/изображения отдают `Cache-Control: public, max-age=0, must-revalidate` | браузер будет перепроверять ресурсы; это может влиять на повторные загрузки | настроить versioned immutable cache для assets, не для HTML | response headers и повторная загрузка |
| P2 | кейсы размечены как `WebPage`, не `Article` | упускается семантическая детализация, но ranking-рост не гарантируется | добавлять Article только при подтверждённых author/date/image/mainEntity данных | Rich Results/Schema validator; видимый контент совпадает |
| P2 | нет CSP, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`; HSTS есть | перед подключением third-party tags нужен управляемый security baseline | отдельно согласовать headers с allowlist аналитики | response headers; форма/теги не сломаны |

## 8. Матрица доступов и идентификаторов

| Система | Статус 13.07.2026 | Что требуется |
|---|---|---|
| Домен/DNS | публичный домен подтверждён; owner access `N/A` | приглашение/сопровождение владельца для DNS verification |
| Vercel project | live сервер = Vercel; dashboard access `N/A` | owner/team access; выяснить, почему Insights endpoint 404 |
| Google Search Console | `N/A`; meta/file/TXT verification не найден | owner property или создание после отдельного разрешения |
| Яндекс Вебмастер | `N/A`; verification token не найден | owner site access или создание после разрешения |
| GA4 | measurement ID не найден | существующий `G-...` или решение создать property |
| GTM | container ID не найден | существующий `GTM-...` или решение создать container |
| Яндекс Метрика | локально установлен ID `110708831`; dashboard/цели `N/A` | owner-доступ к счётчику и создание целей после отдельного разрешения |
| Vercel Web Analytics | snippet есть, live script 404, dashboard `N/A` | enable/fix или удалить broken integration |
| Яндекс Бизнес | `N/A` | прямой URL организации и owner access |
| Google Business Profile | `N/A` | прямой URL и owner confirmation; точную доступность для локации проверить в аккаунте |
| Яндекс Директ | `N/A` | login/access без передачи пароля, billing/legal readiness |
| Google Ads | `N/A — platform restriction/availability gate` | проверять только официальную доступность аккаунта/географии; обход запрещён |
| CRM/коллтрекинг | `N/A` | решение владельца; phone click не считать звонком |
| Бюджет/CPA | `N/A` | валюта, недельный лимит, target/ceiling CPA, stop-loss |

Публичные measurement IDs и verification tokens не являются паролями, но добавлять их в сайт можно только после получения от владельца. Bot token, API secret, cookie, пароль, одноразовый код и приватный ключ не требуются и не должны попадать в HTML/Git.

## 9. Локальная сущность и NAP

| Поле | Факт/статус | Источник |
|---|---|---|
| Бренд | «АвтоМаляр» | `index.html:32-38,123-128` |
| Сервисный адрес | Мариуполь, ул. Макара Мазая, 9 | `index.html:45-51,571` |
| Телефоны | `+7 949 715-59-14`, `+7 951 516-76-66` | `index.html:42,132-138,566-567` |
| Email | `avtomalyarmrpl@mail.ru` | `index.html:43,570` |
| Услуги | кузовные/покрасочные/стапельные и указанные автослесарные | `index.html:207-245,321-355` |
| Юридический адрес/реквизиты | заявлены на legal pages; внешняя выписка не проверялась | `privacy-policy.html:43-45,103-109` |
| Часы | `НЕ ПОДТВЕРЖДЕНО` | в репозитории не найдены |
| Зона обслуживания | на сайте указано «Мариуполь»; точные границы `НЕ ПОДТВЕРЖДЕНЫ` | `index.html:51` |
| Карта | shortlink ведёт к coordinate pin | live redirect `https://clck.ru/3MRTvS` 13.07.2026 |
| Карточка организации | `НЕ ПОДТВЕРЖДЕНО` | прямого organization URL/доступа нет |
| Соцсети | ссылки на Telegram/MAX/VK есть; ownership каждой сущности требует подтверждения | `index.html:165,538-553,568-569` |

Сервисный адрес и юридический адрес различаются, но подписаны разными ролями; это не считается противоречием NAP. В schema не добавлены неподтверждённые часы, рейтинги, цены и гарантии — это корректное ограничение.

## 10. Текущий поток заявки и приватность

Фактический поток:

`форма → POST /api/request → серверная валидация → Telegram Bot API → HTTP 200 → thanks state → попытка Vercel event`.

Источники: `variants/premium-onepage/script.js:452-489,490-535`; `api/request.js:3-54,89-124`.

- Имя, телефон и задача входят в POST и Telegram message; consent-чекбоксы валидируются. Источники: `api/request.js:89-124`.
- Клиент удаляет устаревший `avtomalyarRequestHistory` и не сохраняет новые поля в localStorage. Источник: `variants/premium-onepage/script.js:298-302`.
- Custom event содержит только `form` и `source`, без имени/телефона/текста. Источник: `variants/premium-onepage/script.js:482-489`.
- Privacy copy соответствует этому коду по основному потоку. Источник: `privacy-policy.html:76-78,91-94`.
- Фактическая доставка Telegram и наличие production env variables — `N/A`, потому что POST не выполнялся и Vercel env недоступен.
- Яндекс Метрика и Вебвизор установлены локально по явному решению владельца. До деплоя профильный юрист должен проверить consent/cookies, retention и применимые требования. Этот отчёт не является юридическим заключением.

## 11. Tracking plan

Рекомендуемый транспорт для Фазы B: один `window.dataLayer` + один GTM container для Google-тегов и согласованной установки Метрики. Причина: сайту нужны одинаковые события для GA4, Метрики и будущей рекламы; централизованный контейнер уменьшает дублирование. Если владелец не сможет поддерживать GTM, fallback — прямой `gtag.js` + одна прямая установка Метрики; одновременно GTM и прямой Google tag для одной конфигурации не ставить.

| Event | Триггер | Параметры без PII | Key event/цель |
|---|---|---|---|
| `lead_form_success` | только после `response.ok && data.ok === true` | `form_name`, `placement`, `page_type` | да |
| `lead_form_error` | сервер/сеть вернули ошибку | `form_name`, нормализованный `error_type` | нет |
| `phone_click` | клик по конкретному `tel:` | `phone_label`, `placement`, `page_type` | микроцель, не подтверждённый звонок |
| `messenger_click` | Telegram/MAX/VK contact CTA | `channel`, `placement`, `page_type` | микроцель |
| `map_click` | клик по адресу/маршруту | `placement`, `page_type` | микроцель |
| `case_source_click` | переход в исходную публикацию кейса/новости | `channel`, `case_slug` | нет |
| `service_cta_click` | услуга открывает форму/CTA | `service_slug`, `placement` | микроцель |

Нельзя отправлять в dataLayer/GA4/Метрику/рекламу имя, телефон, email, текст заявки, Telegram username или URL с персональными данными. GA4 session attribution обычно получает UTM из landing URL; не нужно дублировать полный URL в custom parameters.

UTM-стандарт после согласования кампании:

```text
utm_source=yandex
utm_medium=cpc
utm_campaign={campaign_id_or_slug}
utm_content={ad_id_or_creative_slug}
utm_term={keyword_or_criterion}
```

Lowercase; без PII; значения документируются в реестре кампаний.

## 12. Поисковый спрос и контент

Фактические query datasets отсутствуют. Поэтому нельзя подтвердить, какие отдельные service pages имеют достаточный спрос и какой URL должен получать конкретный кластер.

Порядок получения данных:

1. GSC: queries/pages/device/country за сопоставимый период.
2. Яндекс Вебмастер: мониторинг запросов, URL-аналитика, региональность и подбор запросов.
3. Яндекс Вордстат: регион/период/операторы фиксируются в evidence.
4. Подтверждённые вопросы из заявок и звонков без персональных данных.
5. Только затем — `SEO_KEYWORD_MAP.csv` и решение о 3–5 service pages.

Нельзя объединять брендовые и небрендовые запросы в один KPI. Нельзя создавать массовые страницы под вариации одной фразы.

## 13. Paid-readiness

### 13.1. Яндекс Директ

**Статус: NOT READY.** Технически доступна официальная документация создания кампаний, геотаргетинга, целей и Метрики, но доступность/права конкретного рекламного аккаунта не подтверждены.

Блокеры запуска:

- Метрика установлена только локально; цели в кабинете и production-код отсутствуют;
- форма success не протестирована;
- приоритетные услуги, часы обработки лидов и точная география не подтверждены;
- нет бюджета, валюты, допустимого CPA и stop-loss;
- нет определения qualified lead;
- нет фактической семантики и search terms;
- не проверены маркировка/ЕРИР/договорные данные профильным специалистом.

Будущая структура черновика после гейтов: бренд отдельно; high-intent услуги по доказанным landing URL отдельно; РСЯ/ретаргетинг — отдельный тест; информационные и нерелевантные фразы исключаются. Автозапуск, оплата и публикация запрещены без отдельного разрешения.

### 13.2. Google Ads

**Статус: `N/A — platform restriction/availability gate`.** Официальная страница Google сообщает о приостановке показа рекламы пользователям в России и для рекламодателей, базирующихся в России. Для этого проекта нельзя планировать обход через VPN, чужую страну или платёжный профиль. Органический Google Search, Search Console и GA4 оцениваются отдельно. Источник: [Google Ads official policy](https://support.google.com/google-ads/answer/6149970?hl=en), проверено 13.07.2026.

## 14. Performance и технический baseline

Field Core Web Vitals, Lighthouse score и lab timing — `N/A`: доступ к CrUX/Search Console отсутствует, отдельный лабораторный прогон в read-only Фазе A не выполнялся. Нельзя делать вывод о LCP/INP/CLS только по размеру файлов.

Проверяемая сумма опубликованных основных файлов для первого экрана на 1x, без стороннего runtime и без учёта сжатия:

```text
57 159 HTML
+ 123 186 CSS
+ 17 089 JS
+ 64 766 hero 960
+ 95 284 logo 320
+ 550 favicon
= 358 034 байта (~350 KiB)
```

На 2x hero 1440 заменяет 64 766 на 133 841: `427 109` байт (~417 KiB). Источник: live HEAD `Content-Length` 13.07.2026. Это файловый baseline, не показатель скорости.

Live-ресурсы используют `Cache-Control: public, max-age=0, must-revalidate`; главная имеет HSTS `max-age=63072000`, остальные проверенные security headers отсутствуют. Источник: live HEAD 13.07.2026.

## 15. Проверки, выполненные в Фазе A

- `git status --short`, `git diff --stat`, `git diff --check` — существующие изменения сохранены; ошибок whitespace нет.
- `vercel.json` парсится, 7 redirect rules.
- `sitemap.xml` парсится, 7 абсолютных URL.
- 4 JSON-LD blocks парсятся без ошибок: главная + 3 кейса.
- 7 canonical pages: уникальные title/description/H1, self-canonical.
- Локальные ссылки/assets/srcset: 0 отсутствующих файлов среди проверенных production HTML.
- Live: 7 sitemap URL → final `200`; redirect routes → `308`; случайный URL → `404`.
- 29 same-origin live links/resources: 28 → `200`, Vercel Analytics script → `404`.
- `/api/request` GET → `405 Allow: POST`; POST не отправлялся.
- DNS: bare A record есть; apex TXT verification не найден; `www` DNS отсутствует.
- Live и local сравнены по новой новости: live отстаёт.

## 16. Очередь P0 / P1 / P2

### P0 — до индексационного пуша и рекламы

1. Закрыть служебные `SEO_*.md` от production deployment и удалить их с live при следующем разрешённом deploy.
2. Исправить или удалить broken Vercel Analytics integration.
3. Получить owner access/IDs для GSC, Вебмастера, GA4/GTM, Метрики и Vercel.
4. Реализовать единый dataLayer contract и протестировать одну разрешённую заявку end-to-end.
5. Добавить измеримую защиту формы от спама/злоупотребления до платного трафика.

### P1 — органический рост и local readiness

1. Подтвердить NAP, часы, географию, приоритет услуг и карточки Яндекс Бизнес/GBP.
2. Получить реальные query datasets и построить query→URL map.
3. После данных создать только обоснованные service pages с first-party материалом.
4. Принять решение об индексировании legal URL.
5. Опубликовать одобренную новую карточку и обновить homepage lastmod после фактического deploy.

### P2 — усиление качества

1. Добавить `www` alias/redirect при наличии DNS access.
2. Настроить versioned asset caching и согласованные security headers.
3. Рассмотреть Article markup для кейсов только при достаточных подтверждённых полях.
4. Выполнить отдельный mobile/desktop lab audit и затем сверить с field CWV.

## 17. Точный объём Фазы B — только после явного разрешения

Локально, без деплоя и без изменения внешних кабинетов:

1. Добавить `SEO_*.md` и будущий отчёт в `.vercelignore`; проверить preview deployment manifest.
2. Удалить broken Vercel Analytics snippet **или** оставить его только при подтверждённом плане включения; не имитировать working analytics.
3. Добавить один `window.dataLayer = window.dataLayer || []` и canonical event helpers без IDs/секретов.
4. Реализовать события из tracking plan, сохранив `lead_form_success` строго после успешного API-ответа и исключив PII.
5. Добавить app-level anti-abuse слой к `/api/request` с документированной проверкой; не менять Telegram secrets.
6. Обновить privacy/consent copy только после решения владельца/юриста по GA4, Метрике, cookies и Вебвизору.
7. Подготовить места для verification только после получения реальных tokens; никаких placeholder tokens в production.
8. Зафиксировать решение по legal URL и синхронизировать meta robots/sitemap.
9. Обновить `<lastmod>` главной только на дату реального существенного изменения.
10. Не создавать service pages и `SEO_KEYWORD_MAP.csv`, пока нет query evidence.
11. Прогнать XML/JSON-LD/links/headers/mobile/desktop/network/PII проверки и приложить результаты в этот отчёт.
12. Остановиться перед deploy, отправкой sitemap, созданием счётчиков или изменением кабинетов; для Фазы C запросить отдельное разрешение.

### Результат Фазы B — выполнено локально 13.07.2026

Статус: **готово локально, не опубликовано**.

1. `.vercelignore` исключает `SEO_*.md`, `AGENTS.md`, `.env*`, служебные каталоги и debug-файл. Preview deployment manifest не проверялся, потому что деплой и preview deployment не входят в разрешённую Фазу B.
2. Неработающий `/_vercel/insights/script.js` удалён с главной и трёх страниц кейсов. Внешний счётчик аналитики не имитируется и не установлен.
3. Добавлен `/assets/analytics-events.js`: единый `dataLayer`, белый список событий/параметров, очистка строк и отбрасывание неизвестных событий/параметров. Поддержаны `lead_form_success`, `lead_form_error`, `phone_click`, `messenger_click`, `map_click`, `case_source_click`, `service_cta_click`.
4. `lead_form_success` вызывается только после ответа `/api/request` с `ok: true`. Имя, телефон, текст заявки и URL страницы в `dataLayer` не передаются.
5. В `/api/request` добавлены: production Origin check, лимит тела 16 KiB, honeypot, проверка минимального времени заполнения 1200 ms, allowlist источника и rate limit 5 запросов за 60 секунд. Rate limit хранится в памяти одного прогретого serverless-экземпляра и **не является глобальной распределённой защитой**; для неё в следующей фазе потребуется внешнее хранилище/WAF.
6. Текст политики изменён только для устранения ложного утверждения о подключённом Vercel Web Analytics. Юридические решения по GA4, Метрике, cookies, Вебвизору и индексации legal URL не принимались.
7. Placeholder IDs/tokens Google, Яндекс или верификации не добавлялись. Telegram secrets не менялись.
8. `sitemap.xml`: дата главной изменена на `2026-07-13` как дата фактического локального изменения главной; даты остальных URL оставлены `2026-07-10`.
9. В `vercel.json` локально подготовлены `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` и `X-Frame-Options`. Их работу на production подтвердить нельзя до отдельного разрешения на deploy. CSP отложен до решения по внешним тегам и устранения/nonce-обработки inline-скриптов.
10. Service pages, keyword map, `llms.txt`, IndexNow, рекламные кампании и внешние аккаунты не создавались.

Проверки:

- `node --check`: `assets/analytics-events.js`, `variants/premium-onepage/script.js`, `api/request.js` — пройдено.
- XML/JSON: `sitemap.xml` и `vercel.json` парсятся; 4 блока JSON-LD парсятся.
- Локальные ссылки/ресурсы: проверено 12 HTML-файлов, отсутствующих локальных целей не найдено (служебные `output/` и `test-results/` исключены из проверки).
- Data layer contract: неизвестное событие и неизвестные параметры отброшены; тестовый `name`/`phone` не попал в очередь.
- API contract: пройдены 9 сценариев — 405 method, 403 неверный/отсутствующий production Origin, 413 oversized body, honeypot, слишком быстрая отправка, неверный source, успешный ответ с mocked Telegram и 429 rate limit. Реальный Telegram API не вызывался.
- Desktop 1280×900: `scrollWidth = clientWidth = 1265`; обе панели действий новостей имеют одинаковые координаты `top=6581`, `bottom=6655`.
- Mobile 390×844: `scrollWidth = clientWidth = 375`; карточки новостей по 358 px в одну колонку; открытая форма шириной 315 px заканчивается на x=345; honeypot имеет `position:absolute`, `left:-10000px`, размер 1×1 px.
- Runtime: новый analytics asset загрузился как JavaScript, helper существует в основном browser context; клик по услуге создал ровно `{event: service_cta_click, page_type: home, placement: services, service_slug: frame-straightening}`.
- Реальная отправка формы и получение сообщения в Telegram **не проверялись**, потому что это внешнее действие не разрешено в Фазе B.
## 18. TODO владельца

Нужны ответы/доступы без передачи паролей и секретов:

1. Подтвердить официальный бренд, сервисный адрес, точные часы, зону обслуживания и 3–5 приоритетных услуг.
2. Дать прямые URL карточек Яндекс Бизнес и Google Business Profile либо подтвердить, что их нет.
3. Предоставить owner/team invitations к Vercel, Search Console и Яндекс Вебмастеру.
4. Сообщить существующие публичные IDs `GTM-...`, `G-...`; ID Метрики `110708831` уже получен и установлен локально.
5. Выбрать: GTM или прямой Google tag; решение по Метрике/Вебвизору/cookies/consent согласовать с профильным юристом.
6. Разрешить одну маркированную тестовую заявку с тестовым номером и подтвердить получение в Telegram.
7. Для рекламы: недельный бюджет, валюта, допустимый CPA, stop-loss, часы обработки лидов и критерий qualified lead.
8. Подтвердить, нужно ли индексировать legal pages и нужна ли собственная news-страница для публикаций из соцсетей.

## 18.1. Локальный этап Фазы C — Яндекс Метрика

Выполнено 13.07.2026 по явному разрешению владельца, без деплоя:

1. Счётчик Яндекс Метрики № `110708831` установлен на 8 публичных HTML-страниц: главную, 404, три кейса и три правовые страницы. Redirect-wrapper файлы в `variants/` не изменялись, потому что production перенаправляет эти URL до отдачи HTML.
2. Параметры инициализации сохранены из предоставленного владельцем кода: `ssr`, `webvisor`, `clickmap`, `ecommerce="dataLayer"`, `referrer`, `url`, `accurateTrackBounce`, `trackLinks`.
3. Существующий whitelist-событий связан с `ym(110708831, "reachGoal", ...)` для `lead_form_success`, `phone_click`, `messenger_click`, `map_click`, `case_source_click`, `service_cta_click`. `lead_form_error` в цели Метрики не отправляется.
4. Цели с этими идентификаторами необходимо отдельно создать в кабинете Метрики. Доступ к кабинету не предоставлен, поэтому их наличие и приём событий сейчас подтвердить нельзя.
5. Поля имени, телефона, задачи и honeypot отмечены `ym-disable-keys`; форма отмечена `ym-disable-submit`. Это запрещает запись содержимого полей Вебвизором и отключает автоматическую аналитику отправки формы, сохраняя собственное серверно подтверждённое событие `lead_form_success`.
6. Политика конфиденциальности обновлена: указан номер счётчика, активные функции, категории технических данных и официальные документы Яндекса. Дата редакции изменена на `13.07.2026`.
7. `privacy-policy.html` в sitemap получил `lastmod=2026-07-13`; даты страниц без содержательных изменений не менялись.
8. Согласие/cookie-механизм и срок хранения должны быть проверены профильным юристом до deploy. Автоматическая загрузка счётчика сейчас соответствует предоставленному коду владельца, но юридическое заключение в рамках этой работы не выполнялось.
9. В корень сайта добавлен файл подтверждения Яндекс Вебмастера `yandex_5f353f438b06d387.html`. Имя и содержимое дословно сверены с официальной загрузкой; подтверждение прав станет возможным только после deploy файла на публичный домен.
Проверки локального этапа:

- синтаксис `assets/analytics-events.js`, основного UI-скрипта и API — пройден;
- на каждой из 8 публичных страниц найден ровно один `init` счётчика, один noscript-пиксель и одно подключение событийного слоя;
- inline-скрипты всех 8 страниц синтаксически разобраны без ошибок; JSON-LD — 4 валидных блока;
- mock-тест без сети подтвердил очередь `init`, загрузочный URL `tag.js?id=110708831` и `reachGoal("lead_form_success")` без PII;
- `lead_form_error` не отправляется как цель Метрики;
- проверено 12 HTML-файлов: отсутствующих локальных ссылок/ресурсов не найдено;
- `sitemap.xml` и `vercel.json` парсятся; `git diff --check` проходит;
- файл `yandex_5f353f438b06d387.html` содержит строку `Verification: 5f353f438b06d387`; локальный SHA-256: `54FAC2782DEB0A78E51C357FF13DD73C0BDB04C8DB587B6A56D97DB87307EB0C`;
- реальные запросы к Яндекс Метрике не выполнялись, поэтому появление визитов и целей в dashboard подтвердить нельзя до deploy и доступа к счётчику.
## 19. Официальные источники, проверены 13.07.2026

### Google

- [Build and submit a sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Canonical URLs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
- [Robots meta/X-Robots-Tag](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag)
- [Structured data policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)
- [People-first content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
- [Search Console ownership](https://support.google.com/webmasters/answer/9008080)
- [Search Console sitemap report](https://support.google.com/webmasters/answer/7451001)
- [GA4 events](https://support.google.com/analytics/answer/14144294?hl=en)
- [GA4 key events](https://support.google.com/analytics/answer/13128484)
- [Tag Manager dataLayer](https://developers.google.com/tag-platform/tag-manager/datalayer)
- [GA4 consent settings](https://support.google.com/analytics/answer/14275483)
- [Google Business local ranking](https://support.google.com/business/answer/7091)
- [Business Profile eligibility](https://support.google.com/business/answer/13763036)
- [Business Profile supported regions](https://support.google.com/business/answer/6270107)
- [Google Ads Russia serving restriction](https://support.google.com/google-ads/answer/6149970?hl=en)

### Яндекс

- [Подтверждение прав в Вебмастере](https://yandex.ru/support/webmaster/ru/service/rights)
- [Sitemap в Вебмастере](https://yandex.ru/support/webmaster/ru/indexing-options/sitemap)
- [Региональность](https://yandex.ru/support/webmaster/ru/site-geography/site-region)
- [Организации в поиске](https://yandex.ru/support/webmaster/ru/search-appearance/organization-list)
- [Подбор запросов](https://yandex.ru/support/webmaster/ru/service/queries-selection)
- [Мониторинг запросов](https://yandex.ru/support/webmaster/ru/service/popular-queries)
- [Создание счётчика Метрики](https://yandex.ru/support/metrica/ru/general/creating-counter)
- [Цели Метрики](https://yandex.ru/support/metrica/ru/general/goals)
- [Метрика в Директе](https://yandex.ru/support/direct/ru/technologies-and-services/metrika-in-direct)
- [Целевые действия Директа](https://yandex.ru/support/direct/ru/strategies/priority-goals)
- [Создание кампании](https://yandex.ru/support/direct/ru/unified-performance-campaign/create-campaign)
- [Геотаргетинг](https://yandex.ru/support/direct/ru/efficiency/geotargeting)
- [Минус-фразы](https://yandex.ru/support/direct/ru/keywords/negative-keywords)

---

**Гейт:** локальная установка Яндекс Метрики в Фазе C завершена. Деплой, preview deployment, изменение кабинета Метрики, создание целей, реальная заявка и запуск рекламы не выполнялись. Для продолжения Фазы C требуется следующее отдельное разрешение владельца.
