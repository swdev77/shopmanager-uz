// Application Constants  
const APP_VERSION = "2.33.2025";
const GITHUB_REPO = "https://github.com/swdev77/shopmanager-uz";
const GITHUB_RELEASES = "https://github.com/swdev77/shopmanager-uz/releases";

// Download Links Constants
const DOWNLOAD_LINKS = {
  FULL_SETUP: {
    url: "https://github.com/swdev77/shopmanager-uz/releases/download/v2.33.2025/ShopManager-full-Setup-2.33.2025.exe",
    name: "ShopManager Full Setup",
    // version: "v2.33.2025",
    size: "99 MB",
    type: "Installer"
  },
  CLIENT_SETUP: {
    url: "https://github.com/swdev77/shopmanager-uz/releases/download/v2.33.2025/ShopManager-client-Setup-2.33.2025.exe",
    name: "ShopManager Client Setup",
    // version: "v2.33.2025",
    size: "59 MB",
    type: "Installer"
  },
  UPDATE_SETUP: {
    url: "https://github.com/swdev77/shopmanager-uz/releases/download/v2.33.2025/ShopManager-update-2.33.2025.exe",
    name: "ShopManager Update Setup",
    // version: "v2.33.2025",
    size: "5 MB",
    type: "Updater"
  },
  CASHIER_SETUP: {
    url: "https://github.com/swdev77/shopmanager-uz/releases/download/v2.33.2025/Cashier-Setup-2.33.2025.exe",
    name: "Cashier Setup",
    // version: "v2.33.2025",
    size: "48 MB",
    type: "Installer"
  },
  CASHIER_UPDATE: {
    url: "https://github.com/swdev77/shopmanager-uz/releases/download/v2.33.2025/Cashier-update-2.33.2025.exe",
    name: "Cashier Update",
    // version: "v2.33.2025",
    size: "6 MB",
    type: "Updater"
  }
};

// Initialize download links
document.addEventListener('includesLoaded', function() {
  document.querySelectorAll('[data-download]').forEach(btn => {
    const key = btn.dataset.download;
    const link = DOWNLOAD_LINKS[key];
    if (link) {
      btn.href = link.url;
      const versionEl = btn.closest('.download-card')?.querySelector('[data-version]');
      if (versionEl) {
        versionEl.textContent = `${APP_VERSION} • ${link.size} • ${link.type}`;
      }
    }
  });
});
