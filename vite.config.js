import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.tsx',
            refresh: true,
        }),
        react(),
],
    // server: {
    //     host: true,
    //     port: 5173,
    //     cors: true,
    //     hmr: {
    //         host: '100.100.166.63'
    //         // host: '192.168.1.17' // IP ini dipake buat run di local (karena raspberry ini satu jaringan sama laptopku).
    //                              // Kalau kak Nahyar mau develop, uncomment IP yang ada di atasnya aja.
    //     }
    // }
});
