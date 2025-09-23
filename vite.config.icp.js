import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// ICP Configuration for Canister 93343-A7BDB-4F45F
// تكوين ICP لـ Canister 93343-A7BDB-4F45F

const CANISTER_ID = '93343-A7BDB-4F45F'
const ICP_NETWORK = process.env.VITE_ICP_NETWORK || 'ic'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    // ICP Environment Variables
    'process.env.VITE_ICP_NETWORK': JSON.stringify(ICP_NETWORK),
    'process.env.VITE_CANISTER_ID': JSON.stringify(CANISTER_ID),
    'process.env.VITE_FRONTEND_URL': JSON.stringify(`https://${CANISTER_ID}.ic0.app`),
    'process.env.VITE_BACKEND_URL': JSON.stringify(`https://${CANISTER_ID}.ic0.app/api`),
  },
  server: {
    host: '0.0.0.0',
    port: 5000,
    allowedHosts: true,
    cors: true,
    proxy: {
      '/api': {
        target: `https://${CANISTER_ID}.ic0.app`,
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    esbuild: {
      drop: ['console', 'debugger']
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          web3: ['ethers', 'web3'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-tabs'],
          icp: ['@dfinity/agent', '@dfinity/candid']
        }
      }
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'ethers', 'web3', 'framer-motion']
  },
  // ICP specific configuration
  base: ICP_NETWORK === 'ic' ? `https://${CANISTER_ID}.ic0.app/` : '/',
  publicDir: 'public',
  assetsInclude: ['**/*.wasm', '**/*.candid']
})
