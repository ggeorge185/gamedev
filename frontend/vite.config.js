import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
 
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      '/api': {
<<<<<<< HEAD
        target: 'http://localhost:5000',
=======
        target: 'http://localhost:3000',
>>>>>>> cb49ee8418adf8ecf637648a7497a9d945b1cd7e
        changeOrigin: true,
      }
    }
  }
})