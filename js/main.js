/**
 * Simple include loader: fetches partial HTML and injects it into elements with `data-include`.
 * This allows for modular HTML development without a complex build system.
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
                console.error('Include failed:', url, err);
                el.innerHTML = `<p style="color: red;">Failed to load section: ${url}</p>`;
            });
    });

    // After all includes are fetched and injected, dispatch a custom event
    Promise.all(promises).then(() => document.dispatchEvent(new CustomEvent('includesLoaded')));
})();