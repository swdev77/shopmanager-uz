/**
 * Simple include loader: fetches partial HTML and injects it into elements with `data-include`.
 * This allows for modular HTML development without a complex build system, while preserving
 * pre-rendered SEO/AI-crawler fallback content if fetch fails (e.g. on file:// protocol).
 */
(function(){
    const includeElements = document.querySelectorAll('[data-include]');
    const promises = Array.from(includeElements).map(el => {
        const url = el.getAttribute('data-include');
        return fetch(url)
            .then(res => {
                if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.statusText}`);
                return res.text();
            })
            .then(html => {
                el.innerHTML = html;
            })
            .catch(err => {
                console.warn('Include fetch skipped or failed, using fallback HTML:', url, err);
                if (!el.innerHTML.trim()) {
                    el.innerHTML = `<p style="color: red;">Failed to load section: ${url}</p>`;
                }
            });
    });

    // After all includes are fetched and injected, dispatch a custom event
    Promise.all(promises).then(() => {
        document.dispatchEvent(new CustomEvent('includesLoaded'));
    });
})();

/**
 * UI behaviours. Bound to `includesLoaded` because the markup lives in sections/*.html.
 */
document.addEventListener('includesLoaded', function() {
    initStickyHeader();
    initMobileMenu();
    initTabs();
    initBillingToggle();
});

// Sticky header: add border/shadow after scrolling
function initStickyHeader() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    const update = () => navbar.classList.toggle('is-scrolled', window.scrollY > 8);
    update();
    window.addEventListener('scroll', update, { passive: true });
}

// Mobile navigation toggle
function initMobileMenu() {
    const btn = document.getElementById('mobileMenuBtn');
    const menu = document.getElementById('navMenu');
    if (!btn || !menu) return;

    const setOpen = (open) => {
        menu.classList.toggle('active', open);
        btn.setAttribute('aria-expanded', String(open));
        const icon = btn.querySelector('i');
        if (icon) icon.className = open ? 'fas fa-xmark' : 'fas fa-bars';
    };

    btn.addEventListener('click', () => setOpen(!menu.classList.contains('active')));
    menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setOpen(false)));
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') setOpen(false);
    });
}

// Accessible tabs (click + arrow keys)
function initTabs() {
    document.querySelectorAll('[data-tabs]').forEach(root => {
        const tabs = Array.from(root.querySelectorAll('[role="tab"]'));
        const activate = (tab, focus) => {
            tabs.forEach(t => {
                const selected = t === tab;
                t.classList.toggle('is-active', selected);
                t.setAttribute('aria-selected', String(selected));
                t.tabIndex = selected ? 0 : -1;
                const panel = document.getElementById(t.getAttribute('aria-controls'));
                if (panel) {
                    panel.classList.toggle('is-active', selected);
                    panel.hidden = !selected;
                }
            });
            if (focus) tab.focus();
        };

        tabs.forEach((tab, i) => {
            tab.addEventListener('click', () => activate(tab, false));
            tab.addEventListener('keydown', (e) => {
                let next = null;
                if (e.key === 'ArrowRight') next = tabs[(i + 1) % tabs.length];
                if (e.key === 'ArrowLeft') next = tabs[(i - 1 + tabs.length) % tabs.length];
                if (e.key === 'Home') next = tabs[0];
                if (e.key === 'End') next = tabs[tabs.length - 1];
                if (next) {
                    e.preventDefault();
                    activate(next, true);
                }
            });
        });
    });
}

// Pricing: monthly / yearly switch
function initBillingToggle() {
    const toggle = document.querySelector('[data-billing] [role="switch"]');
    if (!toggle) return;
    toggle.addEventListener('click', () => {
        const yearly = toggle.getAttribute('aria-checked') !== 'true';
        toggle.setAttribute('aria-checked', String(yearly));
        document.querySelectorAll('[data-price-monthly]').forEach(el => {
            const value = yearly ? el.dataset.priceYearly : el.dataset.priceMonthly;
            el.innerHTML = `${value} <small>so'm / ${yearly ? 'yil' : 'oy'}</small>`;
        });
    });
}
