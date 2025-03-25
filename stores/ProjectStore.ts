import { vdbFetchData } from "@/api/api";
import { defineStore } from "pinia";

let mostRecentRequest: string = "";

export const useProjectStore = defineStore("ProjectStore", {
  state: (): State => {
    return {
      fetching: false,
      projectsPage: null as ProjectsPage | null,
      selectedProject: null,
      sortOrder: "asc",
      activeSortProperty: null,
    };
  },

  actions: {
    async setProject(project: Project) {
      this.fetching = true;
      try {
        this.selectedProject = await vdbFetchData("projects", "POST", project);
      } catch (error) {
        console.error(error);
        throw error;
      } finally {
        this.fetching = false;
      }
    },

    async getProject(projectId: ProjectId) {
      // clear selected project
      this.selectedProject = null;

      this.fetching = true;
      try {
        this.selectedProject = await vdbFetchData(
          `projects/${projectId}`,
          "GET"
        );
      } catch (error) {
        console.error(error);
      } finally {
        this.fetching = false;
      }
    },

    async getProjects(queryObj?: QueryObj): Promise<void> {
      if (!queryObj) {
        queryObj = {
          page: 1,
          pageSize: 10,
          sortBy: "name",
          sortOrder: "asc",
        };
      }

      const thisRequest = `projects?page=${queryObj.page || 0}&pageSize=${
        queryObj.pageSize || 10
      }&sortBy=${queryObj.sortBy || "name"}&sortOrder=${
        queryObj.sortOrder || "asc"
      }&search=${queryObj.search || ""}`;
      mostRecentRequest = thisRequest;

      this.fetching = true;

      try {
        const projectsPage = await vdbFetchData(thisRequest, "GET");
        if (mostRecentRequest != thisRequest) return;
        this.projectsPage = projectsPage;
      } catch (error) {
        console.error(error);
      } finally {
        this.fetching = false;
      }
    },
  },
});
