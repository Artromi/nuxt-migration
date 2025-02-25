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
});
