import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';
import plugin from 'tailwindcss/plugin';

// Palet gray & slate dibaca dari CSS variable agar bisa dibalik di mode gelap
// (mengikuti pengaturan OS lewat prefers-color-scheme). Lihat docs/teknis/05.
const light = {
    gray: { 50: '249 250 251', 100: '243 244 246', 200: '229 231 235', 300: '209 213 219', 400: '156 163 175', 500: '107 114 128', 600: '75 85 99', 700: '55 65 81', 800: '31 41 55', 900: '17 24 39', 950: '3 7 18' },
    slate: { 50: '248 250 252', 100: '241 245 249', 200: '226 232 240', 300: '203 213 225', 400: '148 163 184', 500: '100 116 139', 600: '71 85 105', 700: '51 65 85', 800: '30 41 59', 900: '15 23 42', 950: '2 6 23' },
};
// Dark: skala dibalik (50<->950, 100<->900, ...), 400/500 ditukar agar teks redup tetap terbaca.
const flip = { 50: 950, 100: 900, 200: 800, 300: 700, 400: 500, 500: 400, 600: 300, 700: 200, 800: 100, 900: 50, 950: 50 };
const vars = (dark) => {
    const out = {};
    for (const name of Object.keys(light)) {
        for (const shade of Object.keys(light[name])) {
            out[`--${name}-${shade}`] = light[name][dark ? flip[shade] : shade];
        }
    }
    out['--c-white'] = dark ? light.gray[900] : '255 255 255';
    out['--c-page'] = dark ? light.gray[950] : '243 244 249';
    return out;
};
const scale = (name) =>
    Object.fromEntries(Object.keys(light[name]).map((shade) => [shade, `rgb(var(--${name}-${shade}) / <alpha-value>)`]));

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
    ],

    theme: {
        extend: {
            colors: { gray: scale('gray'), slate: scale('slate') },
            backgroundColor: {
                white: 'rgb(var(--c-white) / <alpha-value>)',
                page: 'rgb(var(--c-page) / <alpha-value>)',
            },
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            keyframes: {
                marquee: {
                    '0%': { transform: 'translateX(0%)' },
                    '100%': { transform: 'translateX(-100%)' },
                },
            },
        },
    },

    plugins: [
        forms,
        plugin(({ addBase }) => {
            addBase({
                ':root, .theme-light': vars(false),
                // Mode "Sistem" (tanpa data-theme) mengikuti OS; data-theme dipilih lewat ThemeToggle
                '@media (prefers-color-scheme: dark)': { ':root:not([data-theme="light"])': vars(true) },
                ':root[data-theme="dark"]': { ...vars(true), colorScheme: 'dark' },
                ':root[data-theme="light"]': { colorScheme: 'light' },
                // Area yang harus tetap terang/gelap seperti desain asli (sidebar, tombol gelap, landing page)
                '.theme-light': { ...vars(false), colorScheme: 'light' },
                ':root': { colorScheme: 'light dark' },
            });
        }),
    ],
};
