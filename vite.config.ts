import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig(({ mode }) => ({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
    ...(mode === 'analyze'
      ? [
          visualizer({
            filename: 'dist/stats.html',
            template: 'treemap',
            gzipSize: true,
            brotliSize: true,
            open: false,
          }),
        ]
      : []),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  server: mode === 'nohmr'
    ? {
        hmr: false,
      }
    : undefined,

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],

  // Generate sourcemaps for production builds to enable bundle analysis
  build: {
    minify: 'esbuild',
    sourcemap: mode === 'analyze',
    target: 'es2020',
    modulePreload: {
      polyfill: false,
    },
    reportCompressedSize: true,
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            return
          }

          if (id.includes('framer-motion') || id.includes('motion-dom') || id.includes('motion-utils')) {
            return 'vendor-motion'
          }

          if (id.includes('react-router')) {
            return 'vendor-router'
          }

          if (id.includes('i18next') || id.includes('react-i18next')) {
            return 'vendor-i18n'
          }

          if (id.includes('react-icons') || id.includes('lucide-react')) {
            return 'vendor-icons'
          }

          if (id.includes('react') || id.includes('react-dom') || id.includes('scheduler')) {
            return 'vendor-react'
          }
        },
      },
    },
  },
  esbuild: {
    legalComments: 'none',
  },
}))
