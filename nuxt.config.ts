// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  css: ["~/assets/main.css"],
  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt"],
  tailwindcss: {
    cssPath: ["~/assets/tailwind.css", { injectPosition: "first" }],
    // config: {}, // could be used instead of tailwind.config
    viewer: true,
    exposeConfig: false,
  },
  runtimeConfig: {
    public: {
      baseUrl: process.env.NUXT_BASE_URL,
      tokenDuration: process.env.NUXT_Token_Duration,
    },
  },
  typescript: {
    typeCheck: true,
    // strict: false // kann während umstellung auf TS hilfreich sein auf false zu setzen (true ist default)
  },
});
