/// <reference types="vite/client" />

declare module '*.jpg' | '*.jpeg' | '*.png' | '*.svg' {
  const src: string
  export default src
}
