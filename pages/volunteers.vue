<template>
  <main class="bg-vologray-100 overflow-auto">
    <div class="m-8 max-w-7xl min-w-[900px]">
      <div class="flex justify-between gap-2">
        <SearchBar
          v-model="searchQuery"
          placeholder="Suche nach Freiwilligen"
        />
        <ButtonStandard @click.prevent="newVolunteerModal = true"
          >Freiwillige:n anlegen</ButtonStandard
        >
      </div>
      <VolunteerTable
        :searchQuery="debouncedSearchQuery"
        class="w-full mt-12"
      />
    </div>
    <!-- <ContainerModal v-if="newVolunteerModal">
      <VolunteerFormular
        @saved="redirectToCreatedVolunteer"
        @cancel="newVolunteerModal = false"
      />
    </ContainerModal> -->
  </main>
</template>

<script setup>
import { useVolunteerStore } from "@/stores/VolunteerStore";
import debounce from "lodash.debounce";

const router = useRouter();
const route = useRoute();
// const volunteerStore = useVolunteerStore();
const newVolunteerModal = ref(false);
const searchQuery = ref("");
const debouncedSearchQuery = ref("");

const debouncedSearch = debounce((input, searchFunction) => {
  searchFunction(input);
}, 1000);

const redirectToCreatedVolunteer = (volunteerId) => {
  router.push("/volunteers/" + volunteerId);
  newVolunteerModal.value = false;
};

watch(searchQuery, (newValue) => {
  router.push({ query: { search: newValue } });
  debouncedSearch(newValue);
});

onMounted(() => {
  debouncedSearchQuery.value = route.query.search || "";
  searchQuery.value = debouncedSearchQuery.value;
});
</script>
