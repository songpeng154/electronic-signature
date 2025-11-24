import process from 'node:process'
import { fileURLToPath, URL } from 'node:url'
import Uni from '@uni-helper/plugin-uni'
import UniHelperComponents from '@uni-helper/vite-plugin-uni-components'
import UniLayouts from '@uni-helper/vite-plugin-uni-layouts'
import UniHelperManifest from '@uni-helper/vite-plugin-uni-manifest'
import UniHelperPages from '@uni-helper/vite-plugin-uni-pages'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { defineConfig, loadEnv } from 'vite'
import UniPolyfill from 'vite-plugin-uni-polyfill'
import { proxyConfig } from './build/proxy.ts'
import { getMetaEnv } from './src/utils/env.ts'
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const root = process.cwd()
  // 获取并包装 .env 环境变量
  const viteEnv = getMetaEnv(loadEnv(mode, root))
  return {
    plugins: [
      // https://uni-helper.js.org/vite-plugin-uni-manifest
      UniHelperManifest(),
      // https://uni-helper.js.org/vite-plugin-uni-pages
      UniHelperPages({
        dts: 'types/uni-pages.d.ts',
        exclude: ['**/components/**'],
        subPackages: ['src/pages-sub'],
        // homePage: '/pages/launch/index',
      }),
      // https://uni-helper.js.org/vite-plugin-uni-layouts
      UniLayouts(),
      // https://uni-helper.js.org/vite-plugin-uni-components
      UniHelperComponents({
        dts: 'types/auto-components.d.ts',
        directoryAsNamespace: true,
        resolvers: [
          (componentName) => {
            function kebabCase(str: string) {
              return str.replace(/[A-Z]/g, (letter, index) => {
                return index === 0 ? letter.toLowerCase() : `-${letter.toLowerCase()}`
              })
            }
            if (componentName.startsWith('Sar')) {
              const name = kebabCase(componentName.slice(3))
              return { name, from: `sard-uniapp/components/${name}/${name}` }
            }
          },
        ],
      }),
      // https://uni-helper.js.org/plugin-uni
      Uni(),
      UniPolyfill(),
      // https://github.com/antfu/unplugin-auto-import
      AutoImport({
        imports: ['vue', '@vueuse/core', 'uni-app'],
        dts: 'types/auto-imports.d.ts',
        dirs: ['src/composables', 'src/stores', 'src/utils'],
        vueTemplate: true,
      }),
      // https://github.com/antfu/unocss
      // see unocss.config.ts for config
      UnoCSS(),
    ],
    server: {
      host: true,
      port: viteEnv.VITE_PORT,
      proxy: proxyConfig(viteEnv),
    },
    resolve: {
      // 别名
      alias: {
        '~': fileURLToPath(new URL('./', import.meta.url)),
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '#': fileURLToPath(new URL('./types', import.meta.url)),
      },
    },
    optimizeDeps: {
      exclude: ['sard-uniapp'],
    },
    css: {
      preprocessorOptions: {
        scss: {
          silenceDeprecations: ['import', 'legacy-js-api'],
        },
      },
    },
  }
})
