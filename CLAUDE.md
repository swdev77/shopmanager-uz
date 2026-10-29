# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> To'liq texnik arxitektura, dizayn tokenlari va bo'limlar jadvali: [`AGENTS.md`](./AGENTS.md) va [`DESIGN.md`](./DESIGN.md).

## Loyiha qisqacha tavsifi
- **Nomi:** `shopmanager-uz` (`shopmanager.uz`, GitHub Pages — `CNAME` faylini o'zgartirmang).
- **Maqsadi:** **ShopManager** POS va ombor boshqaruv dasturi (Windows, Firebird 5.0) uchun statik landing va yuklab olish sayti.
- **Stek:** HTML5 + CSS3 (`css/style.css`, `:root` CSS o'zgaruvchilari) + Vanilla JS (`js/main.js`, `js/constants.js`). Build, `package.json`, linter va testlar yo'q — `main` ga `git push` qilish saytni deploy qiladi.
- **Til:** O'zbek tili (Lotin yozuvi). Foydalanuvchiga ko'rinadigan barcha matnlar o'zbekcha bo'lishi kerak.

## Lokal ishga tushirish
Bo'limlar `fetch()` orqali yuklanadi, shuning uchun `file://` da faqat `index.html` dagi fallback HTML ko'rinadi. HTTP server ishlating:
```bash
bunx serve -l 8080 .        # tavsiya etiladi
python -m http.server 8080  # muqobil
```

## Arxitektura (bir nechta fayllarni o'qimasdan tushunilmaydigan qismlar)
1. **Ikki nusxali kontent.** `index.html` dagi har bir `<div data-include="sections/X.html">` ichida o'sha bo'limning **pre-render qilingan nusxasi** bor (SEO va JS bajarmaydigan AI crawlerlar uchun). `js/main.js` ishga tushgach, bu nusxani `sections/X.html` dan `fetch()` qilingan HTML bilan almashtiradi. Demak `sections/X.html` dagi har qanday matn/markup o'zgarishi `index.html` dagi mos fallback blokda ham takrorlanishi shart.
2. **`includesLoaded` hodisasi.** Barcha include'lar tugagach `main.js` `document` ga `includesLoaded` yuboradi. Bo'lim DOM'iga tegadigan JS (tablar, mobil menyu, sticky header, billing toggle, yuklab olish havolalari) faqat shu hodisa ichida bog'lanadi — `DOMContentLoaded` ishlatmang.
3. **Yuklab olish havolalari.** `js/constants.js` dagi `APP_VERSION` va `DOWNLOAD_LINKS` (`FULL_SETUP`, `CLIENT_SETUP`, `UPDATE_SETUP`, `CASHIER_SETUP`, `CASHIER_UPDATE`) GitHub Releases URL'larini `[data-download="KEY"]` tugmalariga, `${APP_VERSION} • size • type` matnini esa `[data-version]` ga yozadi.
4. **Rus tilidagi sahifa** (`ru/index.html`) — `data-include` ishlatmaydigan to'liq statik sahifa (yo'llar `../css`, `../images`, `../js`). `main.js` include topmagach darhol `includesLoaded` yuboradi, shuning uchun tablar va yuklab olish havolalari u yerda ham ishlaydi. O'zbekcha bo'limlar o'zgarsa, rus sahifasidagi mos matnni (va uning JSON-LD `FAQPage` ini) ham yangilang. Sahifalar `hreflang` (head + `sitemap.xml`) va headerdagi `.lang-switch` havolasi orqali bog'langan.
5. **Faol bo'limlar** `index.html` dagi izohga olinmagan `data-include` lar bilan belgilanadi (hozir: header, hero, features, hardware, download, faq, cta, footer). `metrics`, `trust`, `testimonials`, `pricing`, `contact` — izohga olingan zaxira qoliplar. Bo'limni yoqish = `index.html` dagi izohni olib tashlash (+ fallback HTML qo'shish).

## Talqin (versiya) yangilash — barcha joylar
Versiya qatori (masalan `2.33.2025`) bir nechta joyda qo'lda yozilgan; JS faqat download kartochkalarini yangilaydi. Hammasini sinxron o'zgartiring (`grep -rn "2.33.2025" .` bilan tekshiring):
- `js/constants.js` — `APP_VERSION`, har bir `DOWNLOAD_LINKS[*].url` va `size`.
- `index.html` — JSON-LD (`softwareVersion`, `downloadUrl`), fallback download kartochkalari, hero badge, footer.
- `sections/hero.html` (badge) va `sections/footer.html` ("Talqin: v…").
- `ru/index.html` — JSON-LD, download kartochkalari, hero badge, footer.
- `llms.txt`, `README.md`; kerak bo'lsa `sitemap.xml` dagi `lastmod`.

FAQ matni o'zgarsa, `index.html` dagi JSON-LD `FAQPage` ni ham yangilang.

## Muhim qoidalar
- Fayl yo'llari doim nisbiy (`images/...`, `css/...`, `sections/...`); `/css/...` kabi ildiz yo'llar ishlatilmasin.
- Dizayn: tugma/tab/badge'lar pill (`--rounded-full`), kartochkalar yassi (`1px solid var(--hairline-soft)`, og'ir soyasiz); ranglarni yangi hex bilan emas, `:root` tokenlari orqali bering (batafsil `AGENTS.md` §4).
- Ikonkalar FontAwesome 6.5.1 CDN orqali (`index.html` `<head>`).
- **Kunduzgi/tungi rejim:** tungi palitra `css/style.css` da `:root[data-theme="dark"]` va `@media (prefers-color-scheme: dark)` bloklarida (ikkalasi bir xil, birini o'zgartirsangiz ikkinchisini ham). `--canvas`/`--ink-*` rejimga qarab almashadi, shuning uchun rangli fon ustidagi matn uchun `--on-fill`, to'q ko'k fon uchun `--fill-strong` ishlating (`color: var(--canvas)` yozmang). Tanlov `localStorage.theme` da saqlanadi; `<head>` dagi inline skript uni birinchi chizishdan oldin qo'llaydi, `initThemeToggle()` (`main.js`) tugmani boshqaradi.

<!-- imported-from: gemini:project:instructions -->
# GEMINI.md — AI Workspace Instructions (`shopmanager-uz`)

> To'liq texnik tahlil va qoidalar [`AGENTS.md`](./AGENTS.md) faylida joylashgan.

## Kontekst
Ushbu repozitoriy **ShopManager** (savdo nuqtalari — POS va inventarizatsiya tizimi) dasturining rasmiy veb-sayti (`shopmanager.uz`) hisoblanadi.

## Arxitektura xulosasi
- **Statik va modulli:** `index.html` sahifasi `js/main.js` yordamida `sections/*.html` fayllarini asinxron (`fetch`) tarzda yuklaydi.
- **Hodisaga asoslangan initsializatsiya:** Barcha HTML qismlar yuklangach `includesLoaded` (`CustomEvent`) ishga tushadi. `js/constants.js` shu hodisaga tayanib yuklab olish kartochkalarini (`[data-download]` va `[data-version]`) to'ldiradi.
- **Konfiguratsiya markazi:** Dastur versiyasi (`APP_VERSION`) va 5 ta o'rnatish/yangilash paketlari (`FULL_SETUP`, `CLIENT_SETUP`, `UPDATE_SETUP`, `CASHIER_SETUP`, `CASHIER_UPDATE`) `js/constants.js` ichida boshqariladi.
- **Uslublar:** Barcha CSS qoidalari va `:root` rang o'zgaruvchilari `css/style.css` faylida jamlangan.

## Kod yozishda e'tibor beriladigan jihatlar
1. Tashqi kutubxona yoki npm paketlar qo'shmang (agar CDN orqali zarur bo'lmasa, masalan FontAwesome yoki inline SVG).
2. `sections/` ichidagi elementlarga murojaat qiluvchi JS kodlarini `includesLoaded` hodisasidan keyin ishga tushiring.
3. Sayt matnlarini o'zbek tilida (to'g'ri imlo qoidalari bilan: `yechim`, `ma'lumot`, `mahsulot`, `savdo nuqtasi`) yozing.
4. SEO va AI qidiruv tizimlari (GEO/AEO) uchun `robots.txt`, `sitemap.xml`, `llms.txt` hamda `index.html` ichidagi JSON-LD (`SoftwareApplication`, `Organization`, `FAQPage`) va pre-rendered HTML bloklarini doim yangilangan holatda saqlang.
