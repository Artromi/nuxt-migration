<template>
  <main class="bg-vologray-100 overflow-auto">
    <div class="max-w-7xl min-w-[900px] m-8">
      <div class="flex justify-between gap-2">
        <SearchBar placeholder="Suche nach Einsatzstellen" />
        <ButtonStandard @click.prevent="newProjectModal = true"
          >Einsatzstelle anlegen</ButtonStandard
        >
      </div>
      <ProjectTable class="w-full mt-12" />
    </div>
    <!-- <ContainerModal v-if="newProjectModal">
      <ProjectFormular @close="newProjectModal = false" />
    </ContainerModal> -->
  </main>
</template>

<script setup>
const newProjectModal = ref(false);
</script>
