# SEO implementation report — АвтоМаляр

Дата: 10.07.2026, Europe/Moscow.
Статус: локальное внедрение завершено; деплой, DNS, внешние аккаунты, карточки бизнеса и аналитика не изменялись.

## 1. Executive summary

- Существующие незакоммиченные изменения сохранены: reset, checkout, clean, commit, staging и удаление пользовательских файлов не выполнялись.
- Исправлены только доказуемые локальные проблемы: подготовлен постоянный редирект /index.html → /; согласованы title, description, H1, canonical и JSON-LD; удалены неподтверждённые числа и обещания; созданы три страницы кейсов с прямыми first-party источниками и границами подтверждённых данных.
- Фактический путь заявки отражён в коде и правовых страницах: JSON POST на /api/request → Telegram Bot API. Хранение имени, телефона и задачи в localStorage удалено; legacy-запись очищается. Событие lead_submit_success вызывается только после подтверждённого сервером успеха и не включает введённые PII. Источники: api/request.js:1-48, 91-122; variants/premium-onepage/script.js:253, 412-441; privacy-policy.html:77-94.
- Страницы услуг и SEO_KEYWORD_MAP.csv не созданы: реальных данных спроса, GSC/Яндекс Вебмастера и достаточных бизнес-фактов нет.
- Следующая граница — отдельное разрешение на деплой и доступ к внешним аккаунтам.

## 2. Исходное состояние

Снимок до моих изменений получен через git status --short и git diff --stat.

**Modified tracked:** .vercelignore; index.html; robots.txt; sitemap.xml; variants/premium-onepage/index.html; variants/premium-onepage/offer.html; variants/premium-onepage/personal-data-consent.html; variants/premium-onepage/privacy-policy.html; variants/premium-onepage/script.js; variants/premium-onepage/styles.css.

**Untracked:** 404.html; SEO_AUDIT.md; SEO_IMPLEMENTATION_PROMPT.md; legal.css; offer.html; personal-data-consent.html; privacy-policy.html; vercel.json.

Начальный tracked diff-stat: 1236 добавлений, 925 удалений. .vercelignore, четыре redirect-shell в variants/premium-onepage, SEO_AUDIT.md и SEO_IMPLEMENTATION_PROMPT.md в этой задаче не редактировались.

## 3. Проблема → доказательство → влияние → исправление → приоритет → проверка

Приоритет — оценка риска, не обещание роста позиций.

| Проблема | Доказательство | Возможное влияние | Исправление | Приоритет | Проверка |
|---|---|---|---|---|---|
| /index.html на live отдавал 200 и дублировал / | GET 10.07.2026: https://avtomalyarmrpl.ru/ и /index.html; canonical: index.html:8 | Два адреса одного документа и раздельные метрики | vercel.json:5-7 — permanent redirect на / | P0 | JSON валиден; live 308 возможен после деплоя |
| Точные числа, скидка, гарантия и срок без доступного первичного подтверждения | Начальный diff; публикации https://t.me/colordrivemrpl/629 и /633 не подтверждают все прежние заявления | Недостоверный контент | Удалены «15 минут», «до 40%», гарантия и точные числа; условия привязаны к осмотру: index.html:207-312, 479-520, 587-594 | P0 | Запрещённые фразы: 0; HTML/JSON-LD валидны |
| sameAs был неоднозначен | MAX по номеру — 404; brand invite — 403 анонимно; Telegram вёл на личный и брендовый каналы | Неподтверждённая связь сущности с профилями | sameAs удалён; видимые ссылки не названы верифицированными: index.html:26-52, 568-574 | P0 | sameAs отсутствует; JSON-LD валиден |
| Кейсы не имели самостоятельных evidence pages | Публикации станции /538, /556, /596 | Источник и ограничения было трудно проверить | Созданы 3 case pages с unique title/H1/canonical, WebPage + BreadcrumbList, фото и источником | P1 | cases/*.html:6-90; ссылки, ресурсы, JSON-LD валидны |
| В источниках конфликтовала марка Patriot | /556: «ВАЗ Patriot»; прежний сайт: «УАЗ Patriot» | Любой выбор марки был бы домыслом | Оставлена только модель; конфликт указан: cases/patriot-body-repair.html:58-73 | P0 | Марка не заявлена |
| Правовые страницы описывали другой data flow; PII хранились локально | api/request.js:1-48; начальный diff script.js | Публичное описание не совпадало с кодом; лишнее хранение PII | Синхронизированы 3 документа; localStorage PII удалён; pageUrl сокращён до path: privacy-policy.html:77-94; consent:44-45; offer:75-87; script.js:253,412; api/request.js:91-104 | P0 | Mock 200/400/502; query/hash удалены; localStorage get/set заявки: 0 |
| Sitemap live содержал 4 URL и не включал кейсы | https://avtomalyarmrpl.ru/sitemap.xml | Новые canonical URL не были бы перечислены | Локальный sitemap: 7 URL, без priority/changefreq | P1 | XML валиден; 7/7 локальных целей существуют |
| Touch targets и modal semantics имели дефекты | До исправления: case CTA 34 px, brand 36 px; неверный aria-controls; input type=text; success timer | Мобильные и клавиатурные ошибки | button, aria-controls=case-modal, data-source-panel, type=tel, legend, 44 px, success без таймера | P1 | Регрессия 390×844 и 1440×900 пройдена |
| Изображения не имели responsive candidates | Были локальные 640/1280 варианты | Возможна лишняя передача данных | srcset/sizes для 12 изображений: index.html:383-459; cases/*.html:79-84 | P2 | Все src/srcset существуют |
| Для service pages нет доказательной базы | GSC/Яндекс аккаунты недоступны; direct SERP ненадёжен; цены, часы, гарантия, специалисты не подтверждены | Страницы потребовали бы выдумать факты или спрос | Service pages не созданы | Gate | Нужны exports и подтверждения владельца |

## 4. Live-аудит 10.07.2026

Метод: прямые HTTP GET и DNS-проверки, 19:11–19:20 MSK. Это снимок, не мониторинг.

| Проверка | Результат |
|---|---|
| /, 3 legal pages, robots.txt, sitemap.xml | HTTP 200 |
| Старые variants/premium-onepage URL | Прямой 308 на корневые canonical URL |
| Случайный отсутствующий URL | HTTP 404 и noindex,follow |
| HTTP → HTTPS | 308 |
| HSTS | Присутствовал |
| www.avtomalyarmrpl.ru | DNS не разрешился |
| /index.html | HTTP 200, тот же документ, что / |
| Live sitemap | 4/4 URL вернули 200; lastmod 2026-07-06 |
| Live vs local | Main/legal отличались от текущих локальных файлов |
| Google Business Profile / Яндекс Бизнес | N/A: карточки и аккаунты не подтверждены |
| Карта | Ссылка ведёт на координату Yandex Maps, не доказывает карточку организации |
| Field CWV | N/A: PSI API mobile/desktop вернул 429 |

Локальные redirects, case pages и новый sitemap ещё не опубликованы.

## 5. Спрос, конкуренты и карта запросов/URL

**Карта с реальными метриками: N/A.** Нет GSC, Яндекс Вебмастера, рекламных экспортов или контролируемой региональной SERP. Google вернул окружение без надёжно извлекаемой локальной выдачи, Яндекс — CAPTCHA. Поэтому позиции, частотность, intent split, local pack, конкуренты, AI citations и SoV не заявляются.

Темы «кузовной ремонт Мариуполь», «покраска авто Мариуполь», «ремонт после ДТП Мариуполь», «автослесарные работы Мариуполь» наблюдались в обычном web-поиске, но это не данные спроса. Безопасный текущий target для уже видимых услуг — главная / (index.html:207-365). SEO_KEYWORD_MAP.csv не создан.

## 6. Бизнес-факты

«Заявлено» означает first-party заявление, не независимую верификацию.

| Факт | Статус | Источник / ограничение |
|---|---|---|
| Название «АвтоМаляр» | заявлено на сайте | index.html:32-38,123-126; /633 |
| Сервисный адрес: Мариуполь, ул. Макара Мазая, 9 | заявлено на сайте | index.html:44-51,574; карта подтверждает точку, не карточку |
| Телефоны | заявлено на сайте | index.html:42,132-138,569-570 |
| E-mail avtomalyarmrpl@mail.ru | заявлено на сайте | index.html:43,573 |
| Кузовные, покрасочные, стапельные и автослесарные работы | заявлено first-party | index.html:207-365; /633 не подтверждает каждый процесс |
| ИП, ОГРНИП, ИНН, юрадрес | заявлено на сайте | privacy-policy.html:43-45,107-109; offer.html:44-45,100-101; выписка не проверялась |
| Часы | не подтверждено | Надёжного графика нет |
| Цены, скидки, гарантия, точные сроки | не подтверждено | Точные обещания удалены |
| Число мастеров/мест/стапелей | не подтверждено | /629 подтверждает новый стационарный стапель, не прежние количества |
| Honda Accord Type S и Kia Sportage | заявлено first-party | /538 и /596; цена, срок, полный список операций не добавлены |
| Марка Patriot | противоречие | /556 расходится с прежним сайтом; оставлена модель |
| Telegram brand channel | заявлено first-party | https://t.me/colordrivemrpl |
| MAX brand channel | заявлено, анонимно не подтверждено | Ссылка из /633; target 403 |
| VK | заявлено ссылкой, верификация N/A | Аккаунт не изменялся |
| Google Business Profile / Яндекс Бизнес | не подтверждено | Доступа и достоверной карточки нет |
| Отзывы, рейтинг, награды | не подтверждено | Не добавлялись |

## 7. Изменённые файлы

- index.html — evidence-bound metadata/copy/schema, видимый e-mail, кейсы, responsive images, form/modal fixes.
- api/request.js — pageUrl нормализуется до path.
- variants/premium-onepage/script.js — удалены PII/history localStorage; legacy cleanup; корректный case source; success event после серверного успеха; нет auto-close.
- variants/premium-onepage/styles.css — 44 px touch targets и legend.
- privacy-policy.html, personal-data-consent.html, offer.html — data flow синхронизирован с кодом; редакция 10.07.2026.
- vercel.json — /index.html → /; старые redirects сохранены.
- sitemap.xml — 7 canonical URL с lastmod 2026-07-10.
- robots.txt — только завершающий перевод строки.
- 404.html — абсолютный /favicon.svg.
- cases/cases.css и 3 cases/*.html — новые evidence pages.
- SEO_IMPLEMENTATION_REPORT.md — этот отчёт.

## 8. Data flow и legal gate

1. Форма собирает name, phone, task и два согласия: index.html:609-627.
2. Клиент отправляет JSON POST на /api/request; pageUrl = pathname: script.js:404-432.
3. Сервер очищает/ограничивает поля, валидирует и отправляет через Telegram Bot API: api/request.js:1-48,91-122.
4. lead_submit_success с form и source вызывается только после response.ok и data.ok=true: script.js:431-441; PII в event нет.
5. Новые contact_click события не добавлены: план Vercel неизвестен, а Custom Events доступны Pro/Enterprise: https://vercel.com/docs/analytics/custom-events.
6. Реальная Telegram-заявка не отправлялась без внешнего разрешения.

Это не юридическое заключение. 152-ФЗ проверен по официальному тексту, помеченному 01.09.2025: https://ips.pravo.gov.ru/api/ips/legislation/document?baseid=None&hash=98490812b3409e2a8d78a11ca9010f434ea3d9250a11dbbdb78690cd5551bdd6. Я не могу подтвердить достаточность документов на 10.07.2026 без актуальной юридической проверки, статуса оператора и инфраструктуры Telegram/Vercel.

## 9. Проверки

| Проверка | Результат | Ограничение |
|---|---|---|
| git diff --check | PASS | Только LF→CRLF warnings |
| node --check: script.js, api/request.js | PASS | — |
| vercel.json / sitemap.xml | PASS | JSON/XML parse; sitemap 7/7 локальных целей |
| HTML/JSON-LD/links/resources | PASS | 12 HTML; unique title/H1 у содержательных страниц; IDs/ARIA/source-panel/src/srcset без ошибок |
| FAQ visible ↔ JSON-LD | PASS | Совпадают; непроверенные советы нейтрализованы: index.html:55-104,502-520 |
| Local HTTP | PASS | /, 3 cases, 3 legal, sitemap, CSS и image → 200 на 127.0.0.1:8088 |
| API mocks | PASS | 200 success; 400 invalid; 502 Telegram failure; query/hash stripped |
| Actual Telegram | N/A | Внешняя отправка не разрешена |
| Mobile 390×844 | PASS | overflow 0; brand 342×44; case CTA 179×44 |
| Desktop 1440×900 | PASS | overflow 0; brand 416×46; case CTA 179×44 |
| Modal/keyboard | PASS | dialog opened; aria-expanded=true; focus on close |
| Phone/success | PASS | type=tel/inputmode=tel; success не закрывается автоматически |
| Lighthouse mobile | Performance 89; FCP 2.3 s; LCP 3.3 s; TBT 0; CLS 0 | Один lab run Lighthouse 13.4.0; AdGuard вмешивался |
| Lighthouse desktop | Performance 100; FCP 0.5 s; LCP 0.7 s; TBT 0; CLS 0 | Один lab run, не production field data |
| INP / p75 CWV | N/A | PSI 429 |
| Rich result tools | Deferred | Только после деплоя |
| Pixel-level screenshot review | N/A | DOM/a11y tree/геометрия проверены; просмотр PNG был недоступен |

Открытая P2-оптимизация: PNG-логотип около 95 KB и большой CSS. Они не рефакторились поверх уже грязного visual layer без измеряемой необходимости.

## 10. Baseline и KPI

| Метрика | Baseline | Расчёт |
|---|---|---|
| Live sitemap URL availability | 100% | 4 URL с 200 / 4 × 100 = 100% |
| Локальная готовность sitemap | 100% | 7 существующих целей / 7 × 100 = 100%; это не индексация |
| Local validation errors | 0 | 0 найдено по 12 HTML |
| Lighthouse Performance | mobile 89 / desktop 100 | Один lab run |
| GSC clicks/impressions/CTR/position | N/A | Нет export |
| Yandex impressions/clicks/CTR/position | N/A | Нет export |
| Local pack visibility | N/A | Нет controlled tracker |
| Google AI / Yandex Alice AI | N/A | Аккаунты недоступны; N/A не означает отсутствия AI visibility |
| Confirmed organic leads/CVR | N/A | Нет CRM/атрибуции/dashboard |
| Success event | Есть в коде; приём N/A | script.js:431-441 |

Формулы:

- Organic CTR = clicks / impressions × 100%.
- Organic lead CVR = confirmed organic leads / organic sessions × 100%.
- Form success rate = success events / submit attempts × 100%.
- Local visibility share = запросы с присутствием / все отслеживаемые запросы × 100%.
- Indexed candidate share = indexed canonical URLs / submitted canonical URLs × 100%.
- Change = (current − baseline) / baseline × 100%; при baseline=0 процент не считать.

Числовые цели не заданы: baseline трафика и лидов отсутствует.

## 11. Блокеры / TODO владельца

1. P0 — отдельное разрешение на деплой.
2. P0 — подтвердить ИП/реквизиты, юридический и сервисный адреса, часы, телефоны, e-mail, официальные GBP, Яндекс Бизнес, VK, MAX, Telegram.
3. P0 — юридическая проверка consent/privacy/offer, хранения, третьих лиц Telegram/Vercel, локализации и уведомлений.
4. P1 — дать read-only exports GSC/Яндекс/analytics/лиды и доступные AI reports.
5. P1 — подтвердить цены/метод расчёта, гарантию, специалистов, оборудование, этапы, запчасти; до этого service pages не создавать.
6. P1 — разрешить одну E2E-заявку, analytics verification и URL Inspection после деплоя.
7. P2 — разрешить измеряемую оптимизацию logo/CSS с visual regression.
8. P2 — уточнить марку Patriot по первичному документу; до этого оставлять модель.

## 12. Наблюдение после отдельного деплоя

**7 дней:** live HTTP/redirect/canonical/robots/sitemap; 7/7 targets; rich result tools; одна согласованная E2E-заявка; baseline GSC/Яндекс без ранних выводов.

**30 дней:** queries/pages/country/device, CTR, confirmed organic leads/CVR, индексация cases, canonical selection, crawl/image errors, доступность Google AI и Yandex Alice AI reports; отсутствующее = N/A.

**90 дней:** сравнение одинаковых окон по формулам; решение о 3–5 service pages только при подтверждённом спросе и фактах; новые кейсы — только с первичным источником. Позиции не обещаются.

## 13. Повторно открытые первичные источники

Все обязательные URL ниже открыты 10.07.2026 и вернули 200; доступ к отчётам сайта это не подтверждает.

**Google:**
https://developers.google.com/search/docs/fundamentals/ai-optimization-guide
https://developers.google.com/search/docs/appearance/ai-features
https://support.google.com/webmasters/answer/16908024
https://support.google.com/webmasters/answer/16984139
https://developers.google.com/search/docs/fundamentals/creating-helpful-content
https://support.google.com/business/answer/7091
https://support.google.com/business/answer/3038177
https://developers.google.com/search/docs/essentials/spam-policies
https://developers.google.com/search/docs/appearance/google-images
https://developers.google.com/search/docs/appearance/structured-data/sd-policies
https://developers.google.com/search/docs/appearance/core-web-vitals
https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
Дополнительно: https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls

**Яндекс:**
https://yandex.ru/support/webmaster/ru/epos
https://yandex.ru/support/webmaster/ru/service/alice-answers
https://yandex.ru/support/webmaster/ru/service/queries-selection
https://yandex.ru/support/webmaster/ru/service/queries-export
https://yandex.ru/support/webmaster/ru/site-geography/site-region
https://yandex.ru/support/webmaster/ru/yandex-indexing/rank
https://webmaster.yandex.ru/blog/updating-search-algorithms-and-high-quality-content-on-websites
https://yandex.ru/support/webmaster/ru/search-appearance/organization-list
https://yandex.ru/support/webmaster/ru/service/reviews
https://yandex.ru/support/webmaster/ru/indexing-options/sitemap

## 14. Точка остановки

Работа остановлена до деплоя и изменений внешних аккаунтов, карточек, DNS, аналитики, Search Console и Яндекс Вебмастера. Рабочая копия не staged и не закоммичена.
