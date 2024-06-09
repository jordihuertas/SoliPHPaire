import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/sass/app.scss',
                'resources/js/app.js',
                'resources/js/drag-and-drop.js',
                'resources/js/win-game.js',
                'resources/js/game-controller.js',
            ],
            refresh: true,
        }),
    ],
});
