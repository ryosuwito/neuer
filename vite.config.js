import { defineConfig } from 'vite';
import { embedRelatedFiles } from './utils/vite-embedRelatedFiles';

export default defineConfig({
    plugins: [embedRelatedFiles()],
    build: {
        minify: 'terser',
        sourcemap: true,
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true,
            },
            format: {
                comments: false,
            },
        },
        lib: {
            entry: './components/index.js',
            name: 'Neuer',
            formats: ['es', 'umd'],
            fileName: (format) => `neuer.${format}.js`,
        },
        rollupOptions: {
            output: {
                globals: {},
            },
        },
    },
});
