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
