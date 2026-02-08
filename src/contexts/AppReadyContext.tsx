import React, { createContext, useContext, useState, useCallback } from "react";

type AppReadyContextValue = {
  appReady: boolean;
  setAppReady: () => void;
};

const AppReadyContext = createContext<AppReadyContextValue | null>(null);

export function AppReadyProvider({ children }: { children: React.ReactNode }) {
  const [appReady, setAppReadyState] = useState(false);
  const setAppReady = useCallback(() => setAppReadyState(true), []);
  return (
    <AppReadyContext.Provider value={{ appReady, setAppReady }}>
      {children}
    </AppReadyContext.Provider>
  );
}

export function useAppReady() {
  const ctx = useContext(AppReadyContext);
  return ctx;
}

/**
 * Call setAppReady when this component mounts (after lazy child has loaded).
 * Wrap route elements so we only show Navbar/Footer after first route is ready.
 */
export function AppReadyGate({ children }: { children: React.ReactNode }) {
  const { setAppReady } = useAppReady() ?? {};
  const didSet = React.useRef(false);
  React.useEffect(() => {
    if (setAppReady && !didSet.current) {
      didSet.current = true;
      setAppReady();
    }
  }, [setAppReady]);
  return <>{children}</>;
}
