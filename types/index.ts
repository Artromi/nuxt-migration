export {};

declare global {
  // type ProjectName = string;

  type ProjectId = number;

  type QueryObj = {
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: string;
    search?: string;
  };

  interface State {
    fetching: boolean;
    projectsPage: ProjectsPage | null;
    selectedProject: string | null;
    sortOrder: string | null;
    activeSortProperty: string | null;
  }

  interface Project {
    id: string;
    name: string;
    city: string;
    email: string;
    capacity: number;
  }

  interface ProjectsPage {
    content: Project[];
    pageable: {
      pageNumber: number;
      pageSize: number;
    };
    totalPages: number;
  }
}
