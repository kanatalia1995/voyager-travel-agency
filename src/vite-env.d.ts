/// <reference types="vite/client" />

// Injected by `define` in vite.config.ts (Vite only exposes VITE_* by default).
interface ImportMetaEnv {
	readonly STORYBLOK_DELIVERY_API_TOKEN: string;
	readonly STORYBLOK_REGION?: string;
	readonly STORYBLOK_API_BASE_URL?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
