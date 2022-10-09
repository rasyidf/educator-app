// create default vite for react
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    server: {
        port: 4000,
    },
    plugins: [react()]
});