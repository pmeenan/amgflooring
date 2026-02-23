/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    theme: {
        extend: {
            colors: {
                'navy': '#0A192F',
                'navy-light': '#112240',
                'warm-oak': '#D0B49F',
                'slate-gray': '#8892B0',
                'off-white': '#F8F9FA',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                display: ['Montserrat', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
