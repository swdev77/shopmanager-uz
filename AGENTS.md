# AGENTS.md — AI Coding Agents Guide for `shopmanager-uz`

Ushbu fayl AI modellar va avtonom dasturlash agentlari (Antigravity, Claude Code, Cursor, GitHub Copilot, Windsurf, OpenAI Codex va b.) uchun `shopmanager-uz` repozitoriysining arxitekturasi, qoidalari va texnik xususiyatlarini tushuntiradi.

---

## 1. Loyiha maqsadi va texnologik stek

- **Loyiha:** **ShopManager** (POS, savdo nuqtalari va ombor boshqaruv dasturi) uchun rasmiy promo va yuklab olish veb-sayti (`shopmanager.uz`).
- **Xosting:** GitHub Pages (`CNAME` faylida `shopmanager.uz` ko'rsatilgan).
- **Texnologiyalar:**
  - Toza **HTML5** (modulli bo'limlar `sections/*.html` ichida).
  - Toza **CSS3** (`css/style.css`, CSS Custom Properties / Variables bilan).
  - **Vanilla JavaScript (ES6+)** (`js/main.js` va `js/constants.js`).
  - **Build tizimi yo'q:** Loyihada `package.json`, bundler (Vite/Webpack) yoki kompilyator ishlatilmaydi. Barcha fayllar statik holatda to'g'ridan-to'g'ri xizmat qiladi.
- **Asosiy til:** O'zbek tili (Lotin alifbosi, `<html lang="uz">`).

---

## 2. Arxitektura va ishlash oqimi (Runtime Flow)

### 2.1. Dinamik HTML yuklash (`js/main.js`)
1. `index.html` faqatgina asosiy skelet va `<div data-include="sections/<nomi>.html"></div>` teglarini o'z ichiga oladi.
2. Sahifa yuklanganda `js/main.js` barcha `[data-include]` elementlarini topadi va `fetch()` orqali tegishli HTML qismlarni olib, `el.innerHTML` ichiga joylaydi.
3. Barcha `fetch` so'rovlari yakunlangach (`Promise.all`), `document` ustida **`includesLoaded`** nomli maxsus hodisa (`CustomEvent`) chaqiriladi:
   ```javascript
   Promise.all(promises).then(() => document.dispatchEvent(new CustomEvent('includesLoaded')));
   ```
4. **Muhim qoida:** `sections/*.html` ichidagi DOM elementlari bilan ishlaydigan har qanday JavaScript kodi `DOMContentLoaded` emas, balki **`includesLoaded`** hodisasiga bog'lanishi shart! Aks holda DOM elementlari hali yuklanmagan bo'ladi.

### 2.2. Yuklab olish havolalari va talqinlar (`js/constants.js`)
- `APP_VERSION` o'zgaruvchisi joriy dastur talqinini belgilaydi (masalan, `"2.33.2025"`).
- `DOWNLOAD_LINKS` obyekti 5 ta yuklab olish paketini saqlaydi:
  - `FULL_SETUP` — ShopManager Full (Firebird 5.0 server va DB bilan)
  - `CLIENT_SETUP` — ShopManager Client (Firebird 5.0 client bilan)
  - `UPDATE_SETUP` — ShopManager Update
  - `CASHIER_SETUP` — Cashier Setup (Savdo nuqtasi / kassa uchun)
  - `CASHIER_UPDATE` — Cashier Update
- `includesLoaded` hodisasi ishlaganda `js/constants.js`:
  - `[data-download="KEY"]` atributiga ega `<a>` teglarining `href` qiymatini `DOWNLOAD_LINKS[KEY].url` ga o'zgartiradi.
  - Shu `.download-card` ichidagi `[data-version]` elementining matnini `${APP_VERSION} • ${link.size} • ${link.type}` ko'rinishida to'ldiradi.

---

## 3. Bo'limlar (`sections/`) holati

| Fayl | Holati (`index.html` da) | Vazifasi |
| :--- | :--- | :--- |
| `sections/header.html` | **Faol** | Sticky Conversion Header (shisha effektli `backdrop-filter`), logotip, menyu, telefon va yashil CTA |
| `sections/hero.html` | **Faol** | Asosiy sarlavha, versiya nishoni (`v2.33.2025`), CTA tugmalar va suzuvchi kartochkali abstrakt illyustratsiya |
| `sections/metrics.html` | *Izohga olingan* | 4 ta asosiy ko'rsatkich bloki (`100% Internetsiz`, `5 ta paket`, `4 GB RAM`, `FB 5.0`) |
| `sections/features.html` | **Faol** (`#features`) | Interaktiv funksiyalar tablari (`Chakana savdo`, `Ombor nazorati`, `Analitika`, `Mijozlar / CRM`) va jonli UI maketlari |
| `sections/hardware.html` | **Faol** (`#hardware`) | Uskunalar mosligi paneli (Windows kompyuter, shtrix-kod skaneri, chek printeri, tarozi, pul qutisi, lokal tarmoq) |
| `sections/download.html` | **Faol** (`#download`) | 5 ta yuklab olish kartochkasi (`ShopManager Full` ajratib ko'rsatilgan) va Tizim talablari |
| `sections/faq.html` | **Faol** (`#faq`) | Ko'p beriladigan savollar (accordion `<details>`) — JSON-LD `FAQPage` bilan mos |
| `sections/cta.html` | **Faol** (`#cta`) | Ko'k gradientli yakuniy chaqiruv bloki |
| `sections/footer.html` | **Faol** (`#footer`) | To'q (`#0F172A`) zamonaviy footer, logotip, havolalar, Toshkent manzili va aloqa kontaktlari |
| `sections/pricing.html` | *Izohga olingan* | Tariflar va Oylik/Yillik o'tkazgich andozasi (haqiqiy narxlar kiritilgach faollashtiriladi) |
| `sections/trust.html` | *Izohga olingan* | Hamkorlar logotiplari uchun qolip |
| `sections/testimonials.html`| *Izohga olingan* | Mijozlar fikrlari qolipi |
| `sections/contact.html` | *Izohga olingan* | Alohida aloqa bo'limi |

---

## 4. Dizayn tizimi va CSS qoidalari ([DESIGN.md](file:///C:/Projects/shopmanager-uz/DESIGN.md) & [css/style.css](file:///C:/Projects/shopmanager-uz/css/style.css))

- **Ranglar palitrasi (`:root` tokenlari — `#0C4E8C` · `#0C81E4` · `#11C4D4` · `#009E2F`):**
  - `--primary: #0c81e4;` (Vibrant Azure — asosiy yuklab olish / buy-now CTA tugmasi `.btn-buy-cta` va `.download-card--featured` chegarasi uchun)
  - `--primary-deep: #0c4e8c;` (Deep Ocean Navy — tugma bosilgan holati)
  - `--primary-soft: #11c4d4;` va `--accent-cyan: #11c4d4;` (Bright Cyan — ikonkalar foni va ikkilamchi aksentlar uchun)
  - `--ink-button: #0c4e8c;` (Asosiy `.btn-primary` tugmalar uchun faol tab rangi bilan bir xil to'q ko'k rang)
  - `--accent: #009e2f;` (Aksent yashil rang — `.btn-accent`, `.badge-promo`, `.download-card__ribbon` va `.btn-canvas` uchun)
  - `--canvas: #ffffff;` (Asosiy oq sahifa va kartochkalar foni)
  - `--surface-soft: #f0f7fc;` (Yumshoq muz-moviy ikkinchi darajali fon)
  - `--ink-deep: #0c4e8c;`, `--ink: #0c4e8c;`, `--charcoal: #2d4a68;`, `--slate: #456280;`, `--steel: #5c7a99;`, `--stone: #849eb8;`
  - Chegaralar: `--hairline: #cbdceb;`, `--hairline-soft: #e1edf7;`
  - Semantik ranglar: `--success: #009e2f;`, `--attention: #f2a918;`, `--warning: #f7b928;`, `--critical: #e41e3f;`
- **Tipografika (`Optimistic VF` fallback zanjiri: `Inter`, `Montserrat`, `Helvetica`, `Arial`):**
  - `hero-display`: `64px / 500 / 1.16` (`ss01, ss02`)
  - `display-lg`: `48px / 500 / 1.17` (`ss01, ss02`)
  - `heading-lg`: `36px / 500 / 1.28` (`ss01, ss02`)
  - `heading-md`: `28px / 300` (Light editorial subhead, `ss01, ss02`)
  - `heading-sm`: `24px / 500 / 1.25`
  - `body-md`: `16px / 400 / 1.50` (`letter-spacing: -0.16px`)
  - `button-md` / `body-sm-bold`: `14px / 700 / 1.43` (`letter-spacing: -0.14px`)
- **Shakl va Elevation (Flat Architecture):**
  - Barcha tugmalar, pill-tablar va badge'lar **`--rounded-full: 100px`** (pill) shaklda bo'lishi shart.
  - Hero rasm ramkasi, funksiyalar kartasi va qora promo-strip **`--rounded-xxxl: 32px`** burchak radiusiga ega.
  - Marketing kartochkalarida og'ir soya ishlatilmaydi (`1px solid var(--hairline-soft)` yassi dizayn); faqat asosiy yuklab olish kartasida (`card-checkout-summary`) `rgba(20, 22, 26, 0.3) 0px 1px 4px 0px` soyasi ishlatiladi.

---

## 5. Amalga oshirilgan tuzatishlar va keyingi qadamlar

Quyidagi kamchiliklar bartaraf etilgan:

1. **FontAwesome ulandi:** `index.html` `<head>` qismiga FontAwesome 6.5.1 CDN havolasi qo'shildi (`sections/download.html`, `sections/footer.html` va mobil menyudagi ikonkalar uchun).
2. **Hero rasmi va CSS tartibga keltirildi:** `sections/hero.html` dagi ishlatilmagan Tailwind klasslari olib tashlanib, `css/style.css` da `.image-placeholder img` uchun `width: 100%; height: 100%; object-fit: cover;` uslubi belgilandi.
3. **HTML sintaksis va imlo xatolari tuzatildi:**
   - `sections/footer.html`: noto'g'ri `<p></p>` teglari va `"MAXSULOT"` -> `"MAHSULOT"` tuzatildi.
   - `sections/download.html`: `"Savdo nuqtasi uchun..."`, `"Doimiy xotira"`, `"Protsessor"`, `"Ma'lumotlar bazasi"` imlolari to'g'rilandi.
   - `sections/features.html`: `"buyurtma bering"` tuzatildi.
   - `index.html` va `sections/hero.html`: `"yechim"` tuzatildi.
4. **Mobil navigatsiya qo'shildi (`sections/header.html`, `js/main.js`, `css/style.css`):**
   - Brend nomi (`.brand-title`) logotip bilan birga `.nav-logo` ichiga olindi (mobil ekranda yo'qolib qolmaydi).
   - Mobil menyu tugmasi (`#mobileMenuBtn`) va ochiluvchi menyu (`#navMenu.active`) qo'shildi.
5. **SEO, Schema.org (JSON-LD) va AI Qidiruv Tizimlari (GEO / AEO) optimizatsiyasi:**
   - **[index.html](file:///C:/Projects/shopmanager-uz/index.html):**
     - `canonical`, `keywords` (O'zbek va Rus tillaridagi qidiruv so'rovlari: *POS tizimi, do'kon dasturi, kassa dasturi, ombor dasturi, программа для магазина*), OpenGraph va Twitter Card teglari qo'shildi.
     - **Schema.org JSON-LD (`application/ld+json`):** `Organization`, `WebSite`, `SoftwareApplication` va `FAQPage` strukturalangan ma'lumotlari qo'shildi.
     - **SSR / Pre-rendered Fallback HTML:** Qidiruv tizimi botlari (Google, Yandex, Bing) hamda JavaScript `fetch()` ishlatmaydigan AI qidiruv agentlari (ChatGPT Search, Perplexity, Claude, Gemini) sahifa matnini to'liq o'qiy olishi uchun `<div data-include="sections/...">` konteynerlari ichiga oldindan render qilingan HTML joylashtirildi.
   - **[robots.txt](file:///C:/Projects/shopmanager-uz/robots.txt):** Barcha qidiruv botlari (`Googlebot`, `Yandex`, `Bingbot`) va AI agent botlari (`GPTBot`, `OAI-SearchBot`, `ChatGPT-User`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`) uchun ruxsat berildi va `sitemap.xml` ko'rsatildi.
   - **[sitemap.xml](file:///C:/Projects/shopmanager-uz/sitemap.xml):** Qidiruv tizimlarida tez indekslanishi uchun XML xarita yaratildi.
   - **[llms.txt](file:///C:/Projects/shopmanager-uz/llms.txt):** [llmstxt.org](https://llmstxt.org/) standarti asosida LLM va AI qidiruv tizimlari uchun ShopManager haqidagi barcha ma'lumotlar, tizim talablari, yuklab olish havolalari va kontaktlar jamlangan maxsus fayl yaratildi.

---

## 6. AI Agentlar uchun ishlash qoidalari (Best Practices)

1. **GitHub Pages mosligi:** `CNAME` faylini o'chirmang yoki o'zgartirmang. Nisbiy yo'llardan (`css/style.css`, `sections/header.html`, `images/logo.png`) foydalaning (`/css/...` kabi ildizga bog'langan yo'llar `swdev77.github.io/shopmanager-uz/` manzilida xato berishi mumkin).
2. **Versiya yangilash (Muhim):** Dastur versiyasi yangilanganda quyidagi joylarni sinxron yangilang:
   - `js/constants.js` dagi `APP_VERSION` va `DOWNLOAD_LINKS` obyektini.
   - SEO va AI agentlar uchun `llms.txt` hamda `index.html` dagi JSON-LD (`SoftwareApplication.softwareVersion`, `downloadUrl`) va pre-render qilingan fallback havolalarni.
3. **Bo'limlarni o'zgartirish:** `sections/*.html` ichidagi matnlar o'zgartirilganda qidiruv botlari uchun `index.html` ichidagi mos `<div data-include="...">` fallback blokini ham yangilab qo'ying.
4. **Lokal tekshirish:** O'zgarishlarni tekshirish uchun lokal HTTP server sifatida asosan **Bun** (`bunx serve -l 8080 .`) ishlating (fallback HTML tufayli `file://` da ham sahifa ko'rinaveradi, lekin `sections/*.html` dagi dinamik o'zgarishlar HTTP server orqali yuklanadi).
