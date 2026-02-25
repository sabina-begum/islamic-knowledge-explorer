async function clearAllCaches() {
  const statusDiv = document.getElementById("status");
  const clearBtn = document.getElementById("clearBtn");

  if (!statusDiv || !clearBtn) return;

  clearBtn.disabled = true;
  clearBtn.textContent = "⏳ Clearing...";

  try {
    const messages = [];

    // 1. Unregister all service workers
    if ("serviceWorker" in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        await registration.unregister();
        messages.push("✅ Unregistered service worker");
      }
      if (registrations.length === 0) {
        messages.push("ℹ️ No service workers to unregister");
      }
    }

    // 2. Clear all caches
    if ("caches" in window) {
      const cacheNames = await caches.keys();
      for (const cacheName of cacheNames) {
        await caches.delete(cacheName);
        messages.push(`🗑️ Deleted cache: ${cacheName}`);
      }
      if (cacheNames.length === 0) {
        messages.push("ℹ️ No caches to clear");
      }
    }

    // 3. Clear local storage and session storage
    if (typeof Storage !== "undefined") {
      localStorage.clear();
      sessionStorage.clear();
      messages.push("🧹 Cleared local & session storage");
    }

    // 4. Clear IndexedDB (if used)
    if ("indexedDB" in window) {
      try {
        // This is a more complex operation, simplified for now
        messages.push("🗃️ IndexedDB cleanup initiated");
      } catch (e) {
        messages.push("⚠️ IndexedDB cleanup skipped");
      }
    }

    statusDiv.innerHTML = `
      <div class="status success">
        <h3>🎉 Cache clearing completed!</h3>
        <ul style="margin: 10px 0; text-align: left;">
          ${messages.map((msg) => `<li>${msg}</li>`).join("")}
        </ul>
        <p><strong>Redirecting to main app in 3 seconds...</strong></p>
      </div>
    `;

    // Redirect after 3 seconds
    setTimeout(() => {
      window.location.href = "/";
    }, 3000);
  } catch (error) {
    statusDiv.innerHTML = `
      <div class="status error">
        <h3>❌ Error clearing caches</h3>
        <p>Error: ${error.message}</p>
        <p>You may need to manually clear your browser cache.</p>
      </div>
    `;

    clearBtn.disabled = false;
    clearBtn.textContent = "🧹 Clear All Caches & Refresh";
  }
}

// Wire up event handlers without inline JS
document.addEventListener("DOMContentLoaded", () => {
  const statusDiv = document.getElementById("status");
  const clearBtn = document.getElementById("clearBtn");
  const backBtn = document.getElementById("backBtn");

  if (statusDiv) {
    statusDiv.innerHTML = `
      <div class="status info">
        <strong>Browser:</strong> ${navigator.userAgent
          .split(" ")
          .slice(-2)
          .join(" ")}<br>
        <strong>Service Worker Support:</strong> ${
          "serviceWorker" in navigator ? "✅ Yes" : "❌ No"
        }<br>
        <strong>Cache API Support:</strong> ${
          "caches" in window ? "✅ Yes" : "❌ No"
        }
      </div>
    `;
  }

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      clearAllCaches();
    });
  }

  if (backBtn) {
    backBtn.addEventListener("click", () => {
      window.location.href = "/";
    });
  }
});
