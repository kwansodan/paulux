import { useEffect } from "react";

declare global {
  interface Window {
    chatwootSDK?: {
      run: (config: { websiteToken: string; baseUrl: string }) => void;
    };
    $chatwoot?: {
      toggle: (state?: "open" | "close") => void;
      isOpen: () => boolean;
      setUser: (identifier: string, user: Record<string, any>) => void;
      setCustomAttributes: (attributes: Record<string, any>) => void;
      deleteCustomAttribute: (key: string) => void;
      setLocale: (locale: string) => void;
      reset: () => void;
    };
    chatwootSettings?: {
      position?: "left" | "right";
      type?: "standard" | "expanded_bubble";
      launcherTitle?: string;
      showPopoutButton?: boolean;
      darkMode?: "light" | "auto";
    };
  }
}

interface ChatwootWidgetProps {
  websiteToken?: string;
  baseUrl?: string;
}

/**
 * Programmatically open or toggle the Chatwoot live chat window.
 * Returns true if Chatwoot is active and was opened, false otherwise.
 */
export function openChatwoot(): boolean {
  if (typeof window !== "undefined" && window.$chatwoot) {
    window.$chatwoot.toggle("open");
    return true;
  }
  return false;
}

export default function ChatwootWidget({
  websiteToken = import.meta.env.VITE_CHATWOOT_WEBSITE_TOKEN || "Awys7gWzgZif6qbf8Eu2hcXU",
  baseUrl = import.meta.env.VITE_CHATWOOT_BASE_URL || "https://app.chatwoot.com",
}: ChatwootWidgetProps) {
  useEffect(() => {
    if (!websiteToken) {
      if (import.meta.env.DEV) {
        console.info(
          "💬 Chatwoot: Set VITE_CHATWOOT_WEBSITE_TOKEN (and optionally VITE_CHATWOOT_BASE_URL) to activate live chat."
        );
      }
      return;
    }

    // Configure Chatwoot widget behavior and styling
    window.chatwootSettings = {
      position: "right",
      type: "standard",
      launcherTitle: "Chat with us",
      showPopoutButton: true,
      darkMode: "light",
    };

    // If script is already initialized, run SDK directly
    if (window.chatwootSDK) {
      window.chatwootSDK.run({
        websiteToken,
        baseUrl: baseUrl.replace(/\/+$/, ""),
      });
      return;
    }

    const scriptId = "chatwoot-sdk-script";
    if (document.getElementById(scriptId)) return;

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = `${baseUrl.replace(/\/+$/, "")}/packs/js/sdk.js`;
    script.defer = true;
    script.async = true;

    script.onload = () => {
      if (window.chatwootSDK) {
        window.chatwootSDK.run({
          websiteToken,
          baseUrl: baseUrl.replace(/\/+$/, ""),
        });
      }
    };

    document.head.appendChild(script);
  }, [websiteToken, baseUrl]);

  return null;
}
