import { defineConfig } from 'vite';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { copyFileSync, existsSync } from 'fs';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
	// Server configuration for development
	server: {
		port: 8080,
		strictPort: false,
		open: false,
	},

	// Preview configuration
	preview: {
		port: 8080,
		strictPort: false,
	},

	root: './src/',
	base: './',

	// Build configuration
	build: {
		outDir: '../dist/src',
		target: 'es2022',
		minify: 'terser',
		sourcemap: false,
		emptyOutDir: true,
		rollupOptions: {
			input: {
				popup: resolve(__dirname, 'src/popup/index.html'),
				content: resolve(__dirname, 'src/content/index.ts'),
				background: resolve(__dirname, 'src/background/index.ts'),
				popupScript: resolve(__dirname, 'src/popup/index.ts'),
			},
			output: {
				entryFileNames: '[name]/index.js',
				chunkFileNames: '[name].js',
				assetFileNames: '[name]/index.[ext]',
			},
		},
	},

	// Module resolution
	resolve: {
		alias: {
			'@': resolve(__dirname, './src'),
		},
		extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.scss', '.css'],
	},

	// Chrome extension specific plugins
	plugins: [
		{
			name: 'copy-manifest',
			writeBundle() {
				// Copy manifest.json to dist
				const manifestSrc = resolve(__dirname, 'src/manifest.json');
				const manifestDest = resolve(__dirname, 'dist/src/manifest.json');

				if (existsSync(manifestSrc)) {
					copyFileSync(manifestSrc, manifestDest);

					// eslint-disable-next-line no-console
					console.log('✓ Copied manifest.json');
				}
			},
		},
	],

	// Optimize dependencies
	optimizeDeps: {
		include: [],
	},

	// Environment variables
	define: {
		'process.env.NODE_ENV': JSON.stringify(
			process.env['NODE_ENV'] || 'development'
		),
	},
});
