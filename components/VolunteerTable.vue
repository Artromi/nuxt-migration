<template>
  <div v-bind="$attrs">
    <div v-if="volunteerStore.volunteersPage">
      <table class="table-fixed w-full">
        <col class="w-56" />
        <thead class="text-nowrap">
          <tr>
            <td
              v-for="(title, index) in tableHead"
              @click="sortVolunteersList(sortParameter[index])"
              :key="index"
              class="pb-3 text-sm cursor-pointer pl-4"
              :class="{
                'pl-4': index === 0,
                'text-voloblue-200': sortBy === sortParameter[index],
                'text-black opacity-80': !(sortBy === sortParameter[index]),
              }"
            >
              {{ title }}
              <IconTableSortArrows
                :upArrowColor="
                  sortParameter[index] === sortBy && sortOrder === 'asc'
                    ? '#0025FF'
                    : 'darkgray'
                "
                :downArrowColor="
                  sortParameter[index] === sortBy && sortOrder === 'desc'
                    ? '#0025FF'
                    : 'darkgray'
                "
                class="pl-2 inline w-5"
              />
            </td>
          </tr>
        </thead>
        <tbody class="bg-white">
          <tr
            v-for="(volunteer, index) of volunteerStore.volunteersPage.content"
            class="border-b h-14 cursor-pointer hover:text-voloblue-100 hover:bg-gray-50"
            :key="volunteer.id"
            @click="goToDetails(volunteer.id)"
          >
            <td
              class="font-bold pl-4 truncate"
              :class="{ 'rounded-tl-md': index === 0 }"
              :title="volunteer.person.lastname"
            >
              {{ volunteer.person.lastname }}
            </td>
            <td
              class="font-bold pl-4 truncate"
              :title="volunteer.person.firstname"
            >
              {{ volunteer.person.firstname }}
            </td>
            <td class="pl-4 truncate" :title="volunteer.birthplace">
              {{ volunteer.birthplace }}
            </td>
            <td class="pl-4 truncate">2023/24</td>
            <td class="pl-4 truncate">2/5</td>
            <td class="pl-4 truncate">25/25</td>
            <td
              class="text-voloblue-200 md:pr-1"
              :class="{ 'rounded-tr-md ': index === 0 }"
            >
              <IconArrowGoto
                class="text-voloblue-200 opacity-50 ml-auto mr-2"
              />
            </td>
          </tr>
        </tbody>
      </table>
      <!-- </div> -->
      <PaginationController
        class="mt-[2px]"
        :currentPage="volunteerStore.volunteersPage.pageable.pageNumber"
        :totalPages="volunteerStore.volunteersPage.totalPages"
        :pageLength="pageSize"
        @updatePage="updateVolunteerPage"
        @updateLength="(length) => updateVolunteerListLenght(length)"
      />
    </div>
  </div>
  <!-- <ContainerModal v-if="volunteerStore.fetching" :delay="500">
    <div class="p-4 flex flex-row gap-2 items-center text-md"><IconSpinner />loading ...</div>
  </ContainerModal> -->
</template>

<script setup>
import { useVolunteerStore } from "@/stores/VolunteerStore";
import { useRouter } from "vue-router";

const volunteerStore = useVolunteerStore();
const router = useRouter();

const searchQuery = ref({ type: string, default: "" });
const tableHead = ref([
  "Name",
  "Vorname",
  "Einsatzstelle",
  "Jahrgang",
  "Unterlagen",
  "gebuchte Seminare",
]);
const sortParameter = [
  "person.lastname",
  "person.firstname",
  "project",
  "year",
  "documents",
  "seminars",
];
const sortOrder = ref("asc");
const sortBy = ref("person.lastname");
const page = ref(0);
const pageSize = ref(15);

const goToDetails = (volunteerId) => {
  router.push("/volunteerdetail" + volunteerId);
};

const updateVolunteerPage = (pageNumber) => {
  volunteerStore.volunteersPage.pageable.pageNumber = pageNumber;
  let params = {
    sortOrder: sortOrder.value,
    sortBy: sortBy.value,
    page: pageNumber,
    pageSize: pageSize.value,
  };
  volunteerStore.getVolunteers(params);
};

const updateVolunteerListLenght = (length) => {
  pageSize.value = length;
  volunteerStore.volunteersPage.pageable.pageNumber = 0;
  let params = {
    sortOrder: sortOrder.value,
    sortBy: sortBy.value,
    page: volunteerStore.volunteersPage.pageable.pageNumber,
    pageSize: length,
  };
  volunteerStore.getVolunteers(params);
};

const sortVolunteersList = (sortBy) => {
  if (sortBy.value === sortBy) {
    // Toggle sort order if the sortBy is the same
    sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
  } else {
    // Keep the current sort order when changing the sortBy
    sortBy.value = sortBy;
  }

  getVolunteers();
};

const getVolunteers = async (params) => {
  if (!params)
    params = {
      sortOrder: sortOrder.value,
      sortBy: sortBy.value,
      page: page.value,
      pageSize: pageSize.value,
      search: searchQuery.value,
    };

  try {
    await volunteerStore.getVolunteers({
      sortOrder: params.sortOrder,
      sortBy: params.sortBy,
      page: params.page,
      pageSize: params.pageSize,
      search: params.search,
    });
  } catch (error) {
    console.error("Error fetching volunteers:", error);
  }
};

watch(
  searchQuery.value,
  async () => {
    await volunteerStore.getVolunteers();
  },
  { immediate: true } // Ruft die Funktion direkt beim Mounten auf
);
</script>
