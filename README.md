# ShopManager.uz — POS tizimlarini rivojlantirish uchun qulay yechim

**ShopManager** — savdo nuqtalari (POS), ombor hisobi (inventarizatsiya), kassa amaliyotlari va mijozlar bilan ishlash (CRM/sodiqlik) jarayonlarini avtomatlashtirish uchun mo'ljallangan dasturiy majmuaning rasmiy veb-sayti.

- **Rasmiy sayt:** [http://shopmanager.uz](http://shopmanager.uz)
- **GitHub Pages manzili:** [https://swdev77.github.io/shopmanager-uz/](https://swdev77.github.io/shopmanager-uz/)
- **Dastur turi:** Windows Desktop ilova (Offline / lokal tarmoqda ishlaydi)
- **Joriy dastur talqini:** `v2.33.2025`

---

## Dastur haqida

ShopManager kichik va o'rta biznes, chakana savdo do'konlari hamda savdo tarmoqlari uchun quyidagi imkoniyatlarni taqdim etadi:

1. **Qulay sotuvlar:** Intuitiv interfeys va tezkor kassa (POS) jarayonlari.
2. **Inventarizatsiyani boshqarish:** Real vaqt rejimida ombor qoldiqlarini kuzatish, mahsulotlar kirimi/chiqimi va yetkazib beruvchilarga buyurtmalar.
3. **Real vaqt rejimida tahlil:** Savdo, foyda, mahsulotlar aylanmasi va mijozlar bo'yicha keng qamrovli hisobotlar.
4. **Mijozlarga sodiqlik (CRM):** Bonuslar, chegirmalar va mijozlar bazasini yagona tizimda boshqarish.

---

## Yuklab olish paketlari

Sayt orqali foydalanuvchilar GitHub Releases'da joylashgan quyidagi o'rnatish (installer) va yangilash (updater) paketlarini yuklab olishlari mumkin:

| Paket nomi | Kalit (`data-download`) | Hajmi | Turi | Tavsifi |
| :--- | :--- | :--- | :--- | :--- |
| **ShopManager Full** | `FULL_SETUP` | ~99 MB | Installer | To'liq o'rnatish paketi (ma'lumotlar bazasi va Firebird 5.0 server bilan) |
| **ShopManager Client** | `CLIENT_SETUP` | ~59 MB | Installer | Tarmoq orqali ishlovchi ishchi stansiyalar uchun (Firebird 5.0 client) |
| **ShopManager Update** | `UPDATE_SETUP` | ~5 MB | Updater | Mavjud ShopManager dasturini yangi talqinga yangilash |
| **Cashier Setup** | `CASHIER_SETUP` | ~48 MB | Installer | Savdo nuqtasi (kassir) terminali uchun maxsus o'rnatish paketi |
| **Cashier Update** | `CASHIER_UPDATE` | ~6 MB | Updater | Kassir dasturini yangi talqinga yangilash |

### Tizim talablari
- **Operatsion tizim:** Windows 7, 8, 10, 11
- **Protsessor:** Minimal Intel Core i3 yoki AMD ekvivalenti
- **Tezkor xotira (RAM):** Minimal 4 GB (8 GB tavsiya etiladi)
- **Doimiy xotira:** Kamida 300 MB bo'sh joy
- **Tarmoq:** Barqaror internet yoki lokal tarmoq aloqasi

---

## Loyiha tuzilmasi va arxitekturasi

Sayt hech qanday murakkab yig'uvchi (bundler) yoki tashqi JS freymvorklarsiz **HTML5, CSS3 va Vanilla JavaScript** yordamida modulli tarzda qurilgan:

```text
shopmanager-uz/
├── index.html               # Asosiy sahifa (SEO JSON-LD, meta teglar va pre-rendered HTML bilan)
├── CNAME                    # GitHub Pages uchun maxsus domen sozlamasi (shopmanager.uz)
├── robots.txt               # Qidiruv tizimlari (Google, Yandex) va AI botlar uchun ruxsatnoma
├── sitemap.xml              # Qidiruv tizimlari uchun XML sayt xaritasi
├── llms.txt                 # AI qidiruv tizimlari (ChatGPT, Perplexity, Claude, Gemini) uchun ma'lumotnoma
├── README.md                # Loyiha hujjati
├── AGENTS.md                # AI agentlar va dasturchilar uchun texnik qo'llanma
├── CLAUDE.md                # Claude Code / AI modellar uchun qisqa kontekst
├── GEMINI.md                # Gemini / Antigravity AI modellar uchun kontekst
├── css/
│   └── style.css            # Barcha bo'limlar va responsiv dizayn uchun yagona uslublar fayli
├── images/
│   ├── logo.png                   # Asosiy logotip va favicon
│   ├── shopmanager-logo.png       # Qo'shimcha logotip
│   ├── hero-store-automation.svg  # Hero bo'limi uchun abstrakt do'konni avtomatlashtirish tasviri
│   └── hero-pos-dashboard.svg     # Zaxira POS va Ombor Dashboard illyustratsiyasi
├── js/
│   ├── main.js                    # Dinamik HTML yuklovchi, interaktiv tablar, sticky header va mobil menyu
│   └── constants.js               # Dastur versiyasi va yuklab olish havolalari konfiguratsiyasi
└── sections/                      # Modulli HTML bo'limlar (design.md asosida)
    ├── header.html                # Sticky Conversion Header
    ├── hero.html                  # Asosiy banner (Hero) va suzuvchi holat kartochkalari
    ├── metrics.html               # Asosiy ko'rsatkichlar (100% oflayn, 5 paket, 4 GB RAM, FB 5.0)
    ├── features.html              # Interaktiv funksiyalar tablari (Savdo, Ombor, Analitika, CRM)
    ├── hardware.html              # Uskunalar mosligi paneli (Kompyuter, skaner, printer, tarozi, kassa)
    ├── download.html              # Yuklab olish kartochkalari va tizim talablari
    ├── faq.html                   # Ko'p beriladigan savollar (Accordion)
    ├── cta.html                   # Harakatga chaqiruv (Call-to-Action) qismi
    ├── footer.html                # Pastki ma'lumotlar va aloqa qismi
    ├── pricing.html               # Tariflar jadvali andozasi (zaxirada / izohga olingan)
    ├── trust.html                 # Hamkorlar bloki (zaxirada / izohga olingan)
    ├── testimonials.html          # Mijozlar fikri (zaxirada / izohga olingan)
    └── contact.html               # Aloqa formasi/bloki (zaxirada / izohga olingan)
```

---

## Lokal ishga tushirish (Local Development)

Sayt bo'limlari `js/main.js` ichida `fetch()` orqali yuklangani sababli, `index.html` faylini brauzerda to'g'ridan-to'g'ri (`file://` protokoli bilan) ochganda CORS cheklovi tufayli bo'limlar yuklanmaydi. Loyihani lokal tekshirish uchun oddiy HTTP serverdan foydalaning:

**Bun orqali (Tavsiya etiladi):**
```bash
bunx serve -l 8080 .
```

**Python orqali:**
```bash
python -m http.server 8080
```

**Node.js (`npx`) orqali:**
```bash
npx serve .
```

**VS Code orqali:**
* **Live Server** kengaytmasini o'rnating va `index.html` ustida **"Open with Live Server"** tugmasini bosing.

So'ng brauzerda `http://localhost:8080` manzilini oching.

---

## Dastur versiyasini yangilash tartibi

Yangi talqin (release) chiqqanda saytdagi barcha yuklab olish havolalarini yangilash uchun faqatgina `js/constants.js` faylini tahrirlash kifoya:

1. `APP_VERSION` qiymatini yangilang (masalan, `"2.34.2026"`).
2. `DOWNLOAD_LINKS` obyektidagi har bir paketning `url` va `size` (fayl hajmi) qiymatlarini yangilang.
3. O'zgarishlarni `git push` qiling — GitHub Pages avtomatik ravishda saytni yangilaydi.

---

## Bog'lanish

- **Manzil:** Toshkent sh., Islom Karimov ko'chasi, 16A
- **Telefonlar:** [+998 97 740 1551](tel:+998977401551), [+998 33 750 1551](tel:+998337501551)
- **Telegram:** [@ZafarjonOlimov](https://t.me/ZafarjonOlimov)
- **Email:** [swdev77@gmail.com](mailto:swdev77@gmail.com)
