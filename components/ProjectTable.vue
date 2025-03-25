<template>
  <div v-bind="$attrs">
    <div v-if="projectStore.projectsPage">
      <table class="table-fixed w-full">
        <colgroup>
          <col class="w-2/5" />
          <col class="w-3/12" />
          <col class="w-3/12" />
          <col class="w-1/6" />
          <col class="w-1/6" />
          <col class="w-1/12" />
        </colgroup>
        <thead class="text-nowrap">
          <tr>
            <td
              v-for="(title, index) in tableHead"
              :key="index"
              class="pb-3 text-sm cursor-pointer pl-4"
              :class="{
                'pl-4': index === 0,
                'text-voloblue-200': sortBy === sortParameter[index],
                'text-black opacity-80': !(sortBy === sortParameter[index]),
              }"
              @click="sortProjectsList(sortParameter[index])"
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
            class="border-b h-14 cursor-pointer hover:text-voloblue-100 hover:bg-gray-50"
            v-for="(project, index) of projectStore.projectsPage.content"
            :key="project.id"
          >
            <td
              class="font-bold pl-4 truncate"
              :class="{ 'rounded-tl-md': index === 0 }"
              :title="project.name"
            >
              {{ project.name }}
            </td>
            <td class="pl-4 truncate" :title="project.city">
              {{ project.city }}
            </td>
            <td class="pl-4 truncate" :title="project.email">
              {{ project.email }}
            </td>
            <td class="pl-4 truncate">2023/24</td>
            <td class="pl-4 truncate">{{ project.capacity }}</td>
            <td
              class="text-voloblue-200 pr-4 md:pr-1"
              :class="{ 'rounded-tr-md ': index === 0 }"
            >
              <IconArrowGoto
                class="text-voloblue-200 opacity-50 ml-auto mr-2"
              />
            </td>
          </tr>
        </tbody>
      </table>
      <PaginationController
        class="mt-[2px]"
        :currentPage="projectStore.projectsPage.pageable.pageNumber"
        :totalPages="projectStore.projectsPage.totalPages"
        :pageLength="pageSize"
        @updatePage="updateProjectPage"
        @updateLength="(length) => updateProjectListLenght(length)"
      />
    </div>
  </div>
  <!-- <ModalContainer v-if="projectStore.fetching">
    <div class="p-4 flex flex-row gap-2 items-center text-md"><IconSpinner />loading ...</div>
  </ModalContainer> -->
</template>

<script setup lang="ts">
import { useProjectStore } from "~/stores/ProjectStore.js";

const projectStore = useProjectStore();

const tableHead = ref([
  "Name",
  "Standort",
  "Ansprechpartner",
  "Aktive FW",
  "Unterlagen",
  "Offene Stellen",
]);

const sortParameter = ["name", "city", "email", "volunteers", "capacity"];

let sortOrder = ref<"asc" | "desc">("asc");
let sortBy = ref<string>("person.lastname");
let page = ref<number>(0);
let pageSize = ref<number>(15);

interface Props {
  searchQuery: string;
}
// const props = defineProps<{ searchQuery: string }>();
const props = defineProps<Props>();

const updateProjectListLenght = (length: number): void => {
  pageSize.value = length;
  projectStore.projectsPage?.pageable.pageNumber ?? 0;
  let params = {
    sortOrder: sortOrder.value,
    sortBy: sortBy.value,
    page: projectStore.projectsPage?.pageable.pageNumber ?? 0,
    pageSize: length,
  };
  projectStore.getProjects(params);
};

const updateProjectPage = (pageNumber: number): void => {
  if (!projectStore.projectsPage) return;
  if (!projectStore.projectsPage.pageable) return;

  projectStore.projectsPage.pageable.pageNumber = pageNumber;

  let params = {
    sortOrder: sortOrder.value,
    sortBy: sortBy.value,
    page: pageNumber,
    pageSize: pageSize.value,
  };

  projectStore.getProjects(params);
};

const sortProjectsList = (sortKey: string): void => {
  if (sortBy.value === sortKey) {
    // Toggle sort order if sortBy is the same
    sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
  } else {
    // Keep the current sort order when changing sortBy
    sortBy.value = sortKey;
  }

  getProjects();
};

const getProjects = async (params?: QueryObj): Promise<void> => {
  if (!params)
    params = {
      sortOrder: sortOrder.value,
      sortBy: sortBy.value,
      page: page.value,
      pageSize: pageSize.value,
      search: props.searchQuery,
    };

  try {
    await projectStore.getProjects({
      sortOrder: params.sortOrder,
      sortBy: params.sortBy,
      page: params.page,
      pageSize: params.pageSize,
      search: params.search,
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
  }
};

watch(
  () => props.searchQuery,
  async () => {
    await getProjects();
  },
  { immediate: true }
);
</script>
