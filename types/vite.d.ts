/// <reference types="vite/client" />

declare interface ImportMetaEnv {
  // 端口
  readonly VITE_PORT: number

  // 网站标题
  readonly VITE_APP_TITLE: string

  // 资源公共路径
  readonly VITE_PUBLIC_PATH: string

  // 基础服务地址
  readonly VITE_SERVICE_BASE: string | ProxyType

  // 企业 id
  readonly VITE_CORP_ID: string

  // 应用 id
  readonly VITE_AGENT_ID: string

  // 应用密钥
  readonly VITE_SECRET: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
