/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BASE_DOMAIN?: string;
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_PLATFORM_WHATSAPP?: string;
  readonly VITE_PLATFORM_INSTAGRAM?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
