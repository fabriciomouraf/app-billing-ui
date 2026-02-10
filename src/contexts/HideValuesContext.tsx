import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const STORAGE_KEY = "billing-ui-hide-values";

function getStored(): boolean {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === "true";
  } catch {
    return false;
  }
}

function setStored(value: boolean) {
  try {
    localStorage.setItem(STORAGE_KEY, String(value));
  } catch {
    // ignore
  }
}

interface HideValuesContextValue {
  hideValues: boolean;
  toggleHideValues: () => void;
}

const HideValuesContext = createContext<HideValuesContextValue | null>(null);

export function HideValuesProvider({ children }: { children: ReactNode }) {
  const [hideValues, setHideValues] = useState(getStored);

  const toggleHideValues = useCallback(() => {
    setHideValues((prev) => {
      const next = !prev;
      setStored(next);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ hideValues, toggleHideValues }),
    [hideValues, toggleHideValues]
  );

  return (
    <HideValuesContext.Provider value={value}>
      {children}
    </HideValuesContext.Provider>
  );
}

export function useHideValues(): HideValuesContextValue {
  const ctx = useContext(HideValuesContext);
  if (!ctx) {
    throw new Error("useHideValues must be used within HideValuesProvider");
  }
  return ctx;
}

/** Retorna o valor formatado ou máscara quando ocultar valores está ativo */
export const MASKED_VALUE = "••••••";

export function maskValue(formattedValue: string, hidden: boolean): string {
  return hidden ? MASKED_VALUE : formattedValue;
}
