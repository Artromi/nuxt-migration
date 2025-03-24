<template>
  <div class="grid grid-cols-[70px,auto] h-screen divide-x overflow-hidden">
    <NavigationBar />
    <NuxtPage />
  </div>
</template>

<script setup>
const config = useRuntimeConfig();
const baseUrl = config.public.baseUrl;
const tokenDuration = config.public.tokenDuration;
</script>
