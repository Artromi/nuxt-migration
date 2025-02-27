<template>
  <div class="h-screen overflow-hidden grid grid-cols-[70px,auto] divide-x">
    <NavigationBar />
    <NuxtPage />
  </div>
</template>

<script setup>
const config = useRuntimeConfig();
const apiUrl = config.public.baseUrl;
const token = config.public.tokenDuration;
</script>
