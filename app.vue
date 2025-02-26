<template>
  <div class="h-screen overflow-hidden grid grid-cols-[70px,auto] divide-x">
    <NavigationBar />
    <!-- <div class="bg-voloyellow-100">NAV</div> -->
    <NuxtPage />
  </div>
</template>

<script setup>
const config = useRuntimeConfig();
const apiUrl = config.public.baseUrl;
const token = config.public.tokenDuration;
</script>
