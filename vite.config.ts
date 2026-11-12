import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { defineConfig } from 'vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'
import netlify from '@netlify/vite-plugin-tanstack-start'

export default defineConfig(({ command }) => ({
  server: {
    port: 3000,
  },
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    // Netlify's plugin prepares the build for deployment. In `vite dev` it also starts
    // Netlify Dev, which calls the Netlify API on every start (the site is linked) and
    // stops the server if that request fails, so only use it for builds.
    command === 'build' ? netlify() : null,
    tailwindcss(),
    tanstackStart({
      srcDirectory: 'src',
    }),
    viteReact(),
    nitro(),
  ],
}))
