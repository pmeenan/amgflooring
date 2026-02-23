import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
    output: 'static',
    integrations: [
        tailwind({ applyBaseStyles: false }),
        react(),
    ],
    adapter: cloudflare(),
    site: 'https://amgflooring.us',
});
