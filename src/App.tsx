import React, { Suspense, lazy, useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { DarkModeProvider } from "./contexts/DarkModeContext";
import { AccessibilityProvider } from "./contexts/AccessibilityContext";
import { FirebaseProvider } from "./contexts/FirebaseContext";
import { useAppReady, AppReadyGate } from "./contexts/AppReadyContext";
import Navbar from "./components/layout/Navbar";
import Sidebar from "./components/layout/Sidebar";
import Footer from "./components/layout/Footer";

// Import performance optimization utilities
import { monitorCSSPerformance } from "./utils/cssLoader";

// Lazy load major components for code splitting
const HomePageWrapper = lazy(() =>
  import("./components/HomePageWrapper").then((module) => ({
    default: module.default,
  }))
);
const FavoritesPage = lazy(() =>
  import("./pages/Favorites").then((module) => ({ default: module.default }))
);
const ProfilePage = lazy(() =>
  import("./pages/Profile").then((module) => ({ default: module.default }))
);
const LoginPage = lazy(() =>
  import("./pages/Login").then((module) => ({ default: module.default }))
);
const CopyrightPage = lazy(() =>
  import("./pages/Copyright").then((module) => ({ default: module.default }))
);
const TermsPage = lazy(() =>
  import("./pages/Terms").then((module) => ({ default: module.default }))
);
const PrivacyPage = lazy(() =>
  import("./pages/Privacy").then((module) => ({ default: module.default }))
);
const InstallAppPage = lazy(() =>
  import("./pages/InstallApp").then((module) => ({ default: module.default }))
);

// Full-page loader: matches index.html placeholder exactly (parent provides background)
const FullPageLoader: React.FC = () => (
  <div
    style={{
      width: "100%",
      height: "100%",
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
    role="status"
    aria-label="Loading"
  >
    <div
      style={{
        width: 48,
        height: 48,
        border: "3px solid #e7e5e4",
        borderTopColor: "#16a34a",
        borderRadius: "50%",
        boxSizing: "border-box",
      }}
      className="animate-spin dark:!border-stone-700 dark:!border-t-green-500"
    />
  </div>
);

// In-main loader for subsequent route changes (when shell is already visible)
const PageLoader: React.FC = () => (
  <div
    className="flex items-center justify-center min-h-[60vh] bg-stone-50 dark:bg-stone-900"
    role="status"
    aria-label="Loading"
  >
    <div className="animate-spin rounded-full h-12 w-12 border-2 border-stone-200 dark:border-stone-700 border-t-green-600" />
  </div>
);

function App() {
  // State for sidebar visibility
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Function to toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Function to close sidebar
  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  // Initialize performance optimizations
  useEffect(() => {
    // Start CSS performance monitoring
    monitorCSSPerformance();

    // Register service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .then((registration) => {
          // Handle service worker updates
          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (
                  newWorker.state === "installed" &&
                  navigator.serviceWorker.controller
                ) {
                  // New service worker available; could show user notification about update
                }
              });
            }
          });
        })
        .catch(() => {
          // Service Worker registration failed
        });
    }

    // Initialize route prefetching after a delay
    setTimeout(() => {
      // Route prefetcher is already initialized as singleton
    }, 2000);

    // Performance monitoring
    if ("performance" in window) {
      // Monitor largest contentful paint
      new PerformanceObserver(() => {
        // LCP monitoring (metrics can be sent to analytics if needed)
      }).observe({ entryTypes: ["largest-contentful-paint"] });

      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const e = entry as { hadRecentInput?: boolean };
          if (!e.hadRecentInput) {
            // CLS monitoring (metrics can be sent to analytics if needed)
            void e;
          }
        }
      }).observe({ entryTypes: ["layout-shift"] });
    }

    // Cleanup function
    return () => {
      // Cleanup if needed
    };
  }, []);

  const { appReady } = useAppReady() ?? { appReady: false };

  return (
    <FirebaseProvider>
      <DarkModeProvider>
        <AccessibilityProvider>
          {/* Overlay: same full-page loader as index.html until first route has loaded (layout still mounts underneath so lazy route loads) */}
          {!appReady && (
            <div
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 9999,
                background: "#fafaf9",
              }}
              className="dark:!bg-stone-900"
              aria-hidden="true"
            >
              <FullPageLoader />
            </div>
          )}
          {/* Shell always mounted so Routes run and lazy route can load; hidden until appReady to avoid layout jump */}
          <div
            className="min-h-screen bg-stone-50 dark:bg-stone-900 flex flex-col main-container"
            style={{ visibility: appReady ? "visible" : "hidden" }}
          >
            <Navbar onMenuToggle={toggleSidebar} />
            <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
            <main
              className={`flex-1 container mx-auto max-w-7xl px-4 py-8 content-container transition-all duration-300 ${
                isSidebarOpen ? "md:mr-80" : ""
              }`}
            >
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<AppReadyGate><HomePageWrapper /></AppReadyGate>} />
                  <Route path="/favorites" element={<AppReadyGate><FavoritesPage /></AppReadyGate>} />
                  <Route path="/profile" element={<AppReadyGate><ProfilePage /></AppReadyGate>} />
                  <Route path="/login" element={<AppReadyGate><LoginPage /></AppReadyGate>} />
                  <Route path="/install" element={<AppReadyGate><InstallAppPage /></AppReadyGate>} />
                  <Route path="/copyright" element={<AppReadyGate><CopyrightPage /></AppReadyGate>} />
                  <Route path="/terms" element={<AppReadyGate><TermsPage /></AppReadyGate>} />
                  <Route path="/privacy" element={<AppReadyGate><PrivacyPage /></AppReadyGate>} />
                </Routes>
              </Suspense>
            </main>
            <Footer />
          </div>
        </AccessibilityProvider>
      </DarkModeProvider>
    </FirebaseProvider>
  );
}

export default App;
