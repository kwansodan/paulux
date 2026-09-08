import { createContext, useContext, useEffect, useState, useMemo, type ReactNode } from "react";

export interface CurrencyConfig {
  code: string;
  symbol: string;
  name: string;
  flag: string;
  defaultRate: number; // relative to USD (1 USD = X Local)
  decimals: number;
}

export const SUPPORTED_CURRENCIES: Record<string, CurrencyConfig> = {
  USD: { code: "USD", symbol: "$", name: "US Dollar", flag: "🇺🇸", defaultRate: 1.0, decimals: 0 },
  GHS: { code: "GHS", symbol: "GH₵", name: "Ghana Cedi", flag: "🇬🇭", defaultRate: 15.5, decimals: 0 },
  NGN: { code: "NGN", symbol: "₦", name: "Nigerian Naira", flag: "🇳🇬", defaultRate: 1500, decimals: 0 },
  GBP: { code: "GBP", symbol: "£", name: "British Pound", flag: "🇬🇧", defaultRate: 0.78, decimals: 0 },
  EUR: { code: "EUR", symbol: "€", name: "Euro", flag: "🇪🇺", defaultRate: 0.92, decimals: 0 },
  CAD: { code: "CAD", symbol: "CA$", name: "Canadian Dollar", flag: "🇨🇦", defaultRate: 1.38, decimals: 0 },
  AUD: { code: "AUD", symbol: "A$", name: "Australian Dollar", flag: "🇦🇺", defaultRate: 1.52, decimals: 0 },
  KES: { code: "KES", symbol: "KSh", name: "Kenyan Shilling", flag: "🇰🇪", defaultRate: 130, decimals: 0 },
  ZAR: { code: "ZAR", symbol: "R", name: "South African Rand", flag: "🇿🇦", defaultRate: 18.2, decimals: 0 },
  AED: { code: "AED", symbol: "AED", name: "UAE Dirham", flag: "🇦🇪", defaultRate: 3.67, decimals: 0 },
};

/**
 * Maps common timezones and locale indicators to preferred currencies with zero latency.
 */
function detectCurrencyFromEnvironment(): string {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    const locale = (navigator.language || "").toLowerCase();

    // Ghana
    if (tz.includes("Accra") || locale.includes("-gh")) return "GHS";

    // Nigeria
    if (tz.includes("Lagos") || locale.includes("-ng")) return "NGN";

    // United Kingdom
    if (tz.includes("London") || locale.includes("-gb")) return "GBP";

    // Europe (Eurozone)
    if (
      tz.startsWith("Europe/") &&
      !tz.includes("London") &&
      !tz.includes("Kiev") &&
      !tz.includes("Moscow") &&
      !tz.includes("Istanbul")
    ) {
      return "EUR";
    }

    // Canada
    if (
      tz.includes("Toronto") ||
      tz.includes("Vancouver") ||
      tz.includes("Edmonton") ||
      tz.includes("Winnipeg") ||
      tz.includes("Halifax") ||
      tz.includes("Montreal") ||
      locale.includes("-ca")
    ) {
      return "CAD";
    }

    // Australia
    if (tz.startsWith("Australia/") || locale.includes("-au")) return "AUD";

    // Kenya
    if (tz.includes("Nairobi") || locale.includes("-ke")) return "KES";

    // South Africa
    if (tz.includes("Johannesburg") || locale.includes("-za")) return "ZAR";

    // UAE / Middle East
    if (tz.includes("Dubai") || tz.includes("Riyadh") || tz.includes("Qatar")) return "AED";
  } catch {
    // ignore
  }

  return "USD";
}

interface CurrencyContextValue {
  currency: string;
  config: CurrencyConfig;
  symbol: string;
  rate: number;
  rates: Record<string, number>;
  convert: (usdAmount: number) => number;
  formatAmount: (
    usdAmount: number,
    options?: {
      maximumFractionDigits?: number;
      minimumFractionDigits?: number;
      compact?: boolean;
    }
  ) => string;
  localizeText: (text: string) => string;
  setCurrency: (code: string) => void;
  isAutoDetected: boolean;
  currencies: CurrencyConfig[];
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

const STORAGE_KEY = "paulux_visitor_currency";

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<string>("USD");
  const [rates, setRates] = useState<Record<string, number>>(() => {
    const defaultRates: Record<string, number> = {};
    Object.values(SUPPORTED_CURRENCIES).forEach((c) => {
      defaultRates[c.code] = c.defaultRate;
    });
    return defaultRates;
  });
  const [isAutoDetected, setIsAutoDetected] = useState<boolean>(true);

  // Initial detection & saved preference check
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && SUPPORTED_CURRENCIES[saved]) {
        setCurrencyState(saved);
        setIsAutoDetected(false);
        return;
      }
    } catch {
      // ignore
    }

    // 1. Instant timezone detection
    const detected = detectCurrencyFromEnvironment();
    setCurrencyState(detected);

    // 2. Async IP check (non-blocking fallback to verify country)
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);

    fetch("https://api.country.is/", { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        clearTimeout(timeout);
        const country = data?.country;
        if (!country) return;

        const countryMap: Record<string, string> = {
          GH: "GHS",
          NG: "NGN",
          GB: "GBP",
          CA: "CAD",
          AU: "AUD",
          KE: "KES",
          ZA: "ZAR",
          AE: "AED",
          DE: "EUR",
          FR: "EUR",
          IT: "EUR",
          ES: "EUR",
          NL: "EUR",
          BE: "EUR",
          IE: "EUR",
          PT: "EUR",
          AT: "EUR",
          FI: "EUR",
          GR: "EUR",
        };

        if (countryMap[country] && SUPPORTED_CURRENCIES[countryMap[country]]) {
          setCurrencyState(countryMap[country]);
        }
      })
      .catch(() => {
        // Fallback already active, silently continue
      });

    return () => clearTimeout(timeout);
  }, []);

  // Fetch updated exchange rates in background (cached / gentle)
  useEffect(() => {
    fetch("https://open.er-api.com/v6/latest/USD")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.rates) {
          setRates((prev) => {
            const updated = { ...prev };
            Object.keys(SUPPORTED_CURRENCIES).forEach((code) => {
              if (data.rates[code] && typeof data.rates[code] === "number") {
                updated[code] = data.rates[code];
              }
            });
            return updated;
          });
        }
      })
      .catch(() => {
        // use default pre-configured benchmark rates
      });
  }, []);

  const config = SUPPORTED_CURRENCIES[currency] || SUPPORTED_CURRENCIES.USD;
  const rate = rates[currency] || config.defaultRate;

  const setCurrency = (code: string) => {
    if (SUPPORTED_CURRENCIES[code]) {
      setCurrencyState(code);
      setIsAutoDetected(false);
      try {
        localStorage.setItem(STORAGE_KEY, code);
      } catch {
        // ignore
      }
    }
  };

  const convert = (usdAmount: number): number => {
    return usdAmount * rate;
  };

  const formatAmount = (
    usdAmount: number,
    options?: {
      maximumFractionDigits?: number;
      minimumFractionDigits?: number;
      compact?: boolean;
    }
  ): string => {
    const converted = convert(usdAmount);

    // If currency is large-denomination (e.g. NGN, KES, GHS), default to 0 decimals unless specifically asked
    const defaultMaxDecimals =
      currency === "NGN" || currency === "KES" || currency === "GHS" || currency === "USD"
        ? 0
        : 2;

    const maxDecimals =
      options?.maximumFractionDigits !== undefined
        ? options.maximumFractionDigits
        : defaultMaxDecimals;
    const minDecimals =
      options?.minimumFractionDigits !== undefined ? options.minimumFractionDigits : 0;

    let formattedNumber: string;
    if (options?.compact && converted >= 1000) {
      if (converted >= 1_000_000) {
        formattedNumber = `${(converted / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
      } else {
        formattedNumber = `${(converted / 1000).toFixed(0)}k`;
      }
    } else {
      formattedNumber = converted.toLocaleString("en-US", {
        maximumFractionDigits: maxDecimals,
        minimumFractionDigits: minDecimals,
      });
    }

    // Prefix with symbol or code
    if (currency === "AED") {
      return `${formattedNumber} AED`;
    }
    return `${config.symbol}${formattedNumber}`;
  };

  /**
   * Automatically parses and localizes any USD amounts embedded in strings (e.g. "$19,400", "$240k+", "$31,200")
   */
  const localizeText = (text: string): string => {
    if (!text) return text;
    if (currency === "USD") return text;

    return text.replace(
      /\$([0-9]{1,3}(?:,[0-9]{3})*(?:\.[0-9]+)?)([kKmMbB]?\+?)/g,
      (match, numStr: string, suffix: string) => {
        const rawNum = parseFloat(numStr.replace(/,/g, ""));
        if (isNaN(rawNum)) return match;

        let multiplier = 1;
        const lowerSuffix = suffix.toLowerCase();
        if (lowerSuffix.startsWith("k")) multiplier = 1000;
        else if (lowerSuffix.startsWith("m")) multiplier = 1000000;

        const totalUsd = rawNum * multiplier;
        const converted = totalUsd * rate;

        if (multiplier > 1) {
          if (converted >= 1000000) {
            const val = (converted / 1000000).toFixed(1).replace(/\.0$/, "");
            return `${config.symbol}${val}M${suffix.includes("+") ? "+" : ""}`;
          }
          const val = Math.round(converted / 1000);
          return `${config.symbol}${val}k${suffix.includes("+") ? "+" : ""}`;
        }

        const rounded = Math.round(converted);
        return `${config.symbol}${rounded.toLocaleString()}${suffix}`;
      }
    );
  };

  const currenciesList = useMemo(() => Object.values(SUPPORTED_CURRENCIES), []);

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        config,
        symbol: config.symbol,
        rate,
        rates,
        convert,
        formatAmount,
        localizeText,
        setCurrency,
        isAutoDetected,
        currencies: currenciesList,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return ctx;
}
