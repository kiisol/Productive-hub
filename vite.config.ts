import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@app': resolve(__dirname, 'src/app'),
            '@shared': resolve(__dirname, 'src/shared'),
            '@entities': resolve(__dirname, 'src/entities'),
            '@features': resolve(__dirname, 'src/features'),
            '@pages': resolve(__dirname, 'src/pages'),
            '@widgets': resolve(__dirname, 'src/widgets')
        }
    }
});
