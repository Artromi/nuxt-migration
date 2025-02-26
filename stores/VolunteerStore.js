import { defineStore } from "pinia";
import { useRouter } from "vue-router";
import { useRuntimeConfig } from "#app";
import { vdbFetchData } from "@/api/api";

let mostRecentRequest = "";

export const useVolunteerStore = defineStore("volunteerStore", () => {
  const config = useRuntimeConfig();
  const apiUrl = config.public.baseUrl;
  const router = useRouter();

  const fetchingDocuments = ref(false);
  const fetching = ref(false);
  const volunteersPage = ref(null);
  const volunteerNotes = ref(null);
  const selectedVolunteer = ref(null);
  const selectedVolunteerContacts = ref(null);
  const selectedVolunteerAddresses = ref(null);
  const selectedVolunteerRelevantContract = ref(null);
  const volunteerDocuments = ref(null);
  const volunteerDocumentTypes = ref(null);

  const clearVolunteer = () => {
    volunteerNotes.value = null;
    selectedVolunteer.value = null;
    selectedVolunteerContacts.value = null;
    selectedVolunteerAddresses.value = null;
    selectedVolunteerRelevantContract.value = null;
    volunteerDocuments.value = null;
  };

  async function setVolunteer(volunteer) {
    fetching = true;
    try {
      selectedVolunteer = await vdbFetchData("volunteers", "POST", volunteer);
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      fetching.value = false;
    }
  }

  async function getVolunteer(volunteerId) {
    //clear selected volunteer
    selectedVolunteer.value = null;

    fetching.value = true;
    try {
      selectedVolunteer.value = await vdbFetchData(
        `volunteers/${volunteerId}`,
        "GET"
      );

      selectedVolunteerContacts.value = await vdbFetchData(
        `volunteers/${volunteerId}/contacts`,
        "GET"
      );

      selectedVolunteerAddresses.value = await vdbFetchData(
        `volunteers/${volunteerId}/addresses`,
        "GET"
      );

      selectedVolunteerRelevantContract.value = await vdbFetchData(
        `volunteers/${volunteerId}/contracts/relevant`,
        "GET"
      );
    } catch (error) {
      console.error(error);
    } finally {
      fetching.value = false;
    }
  }

  async function getVolunteers(queryObj) {
    const thisRequest = `volunteers?page=${queryObj.page || 0}&pageSize=${
      queryObj.pageSize || 10
    }&sortBy=${queryObj.sortBy || "person.lastname"}&sortOrder=${
      queryObj.sortOrder || "asc"
    }&search=${queryObj.search || ""}`;
    mostRecentRequest = thisRequest;

    fetching.value = true;

    try {
      const volunteersPage = await vdbFetchData(thisRequest, "GET");
      if (mostRecentRequest != thisRequest) return;
      volunteersPage.value = volunteersPage;
    } catch (error) {
      console.error(error);
    } finally {
      fetching.value = false;
    }
  }

  async function getVolunteerNotes(queryObj) {
    const thisRequest = `volunteers/${queryObj.volunteerId}/notes?sortBy=${
      queryObj.sortBy || "timestamp"
    }&sortOrder=${queryObj.sortOrder || "desc"}&search=${
      queryObj.search || ""
    }`;

    mostRecentRequest = thisRequest;

    fetching.value = true;

    try {
      const notes = await vdbFetchData(thisRequest, "GET");
      if (mostRecentRequest != thisRequest) return;
      volunteerNotes.value = notes;
    } catch (error) {
      console.error(error);
    } finally {
      fetching.value = false;
    }
  }

  async function getVolunteerDocuments(queryObj) {
    const thisRequest = `volunteers/${queryObj.volunteerId}/documents?sortBy=${
      queryObj.sortBy || "timestamp"
    }&sortOrder=${queryObj.sortOrder || "desc"}&search=${
      queryObj.search || ""
    }`;

    mostRecentRequest = thisRequest;

    fetching.value = true;
    try {
      const documents = await vdbFetchData(thisRequest, "GET");
      if (mostRecentRequest != thisRequest) return;
      volunteerDocuments.value = documents;
    } catch (error) {
      console.error(error);
    } finally {
      fetching.value = false;
    }
  }

  async function getVolunteerAddresses(volunteerId) {
    const thisRequest = `volunteers/${volunteerId}/addresses`;

    mostRecentRequest = thisRequest;

    fetching.value = true;

    try {
      const addresses = await vdbFetchData(thisRequest, "GET");
      if (mostRecentRequest != thisRequest) return;
      selectedVolunteerAddresses.value = addresses;
    } catch (error) {
      console.error(error);
    } finally {
      fetching.value = false;
    }
  }

  async function setVolunteerAddresses(volunteerId, address) {
    const method = address.id ? "PATCH" : "POST";

    const thisRequest = `volunteers/${volunteerId}/addresses${
      method === "PATCH" ? "/" + address.id : ""
    }`;
    mostRecentRequest = thisRequest;

    fetching.value = true;

    try {
      const addresses = await vdbFetchData(thisRequest, method, address);
      if (mostRecentRequest != thisRequest) return;
      selectedVolunteerAddresses.value = addresses;
    } catch (error) {
      console.error(error);
    } finally {
      fetching.value = false;
    }
  }

  async function deleteVolunteerAddress(addressId) {
    fetching.value = true;

    try {
      await vdbFetchData(
        `volunteers/${selectedVolunteer.value.id}/addresses/${addressId}`,
        "DELETE"
      );
    } catch (error) {
      console.error(error);
    } finally {
      fetching.value = false;
    }
  }

  async function setNote(note, id) {
    fetching.value = true;
    if (id) {
      try {
        await vdbFetchData(
          "volunteers/" + selectedVolunteer.value.id + "/notes/" + id,
          "PATCH",
          note
        );
      } catch (error) {
        console.error(error);
        throw error;
      } finally {
        fetching.value = false;
      }
    } else {
      try {
        await vdbFetchData(
          "volunteers/" + selectedVolunteer.value.id + "/notes",
          "POST",
          note
        );
      } catch (error) {
        console.error(error);
        throw error;
      } finally {
        fetching.value = false;
      }
    }
  }

  async function setDocument(formData, id) {
    fetchingDocuments.value = true;

    if (id) {
      try {
        await vdbFetchData(
          "volunteers/" + selectedVolunteer.value.id + "/documents/" + id,
          "PATCH",
          formData
        );
      } catch (error) {
        console.error(error);
        throw error;
      } finally {
        fetchingDocuments.value = false;
      }
    } else {
      try {
        await vdbFetchFormData(
          "volunteers/" + selectedVolunteer.value.id + "/documents",
          "POST",
          formData
        );
      } catch (error) {
        console.error(error);
        throw error;
      } finally {
        fetchingDocuments = false;
      }
    }
  }

  async function deleteNote(id) {
    fetching = true;
    try {
      await vdbFetchData(
        "volunteers/" + selectedVolunteer.value.id + "/notes/" + id,
        "DELETE"
      );
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      fetching.value = false;
    }
  }

  async function editVolunteer(volunteer, id) {
    fetching.value = true;

    try {
      await vdbFetchData("volunteers/" + id, "PATCH", volunteer);
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      fetching.value = false;
    }
  }

  async function editVolunteerAvatar(formData, id) {
    fetching.value = true;

    try {
      await vdbFetchFormData(
        "volunteers/" + id + "/avatar/",
        "PATCH",
        formData
      );
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      fetching.value = false;
    }
  }

  async function deleteDocument(id) {
    fetching.value = true;
    try {
      await vdbFetchFormData(
        "volunteers/" + selectedVolunteer.value.id + "/documents/" + id,
        "DELETE"
      );
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      fetching.value = false;
    }
  }

  async function getVolunteerDocumentTypes() {
    volunteerDocumentTypes.value = null;

    fetching.value = true;
    try {
      volunteerDocumentTypes.value = await vdbFetchData(
        `/documents/types`,
        "GET"
      );
    } catch (error) {
      console.error("Error fetching document types:", error);
    } finally {
      fetching.value = false;
    }
  }

  const getTypeList = () => {
    if (!volunteerDocumentTypes.value) return;

    let list = [];

    for (let key of Object.keys(volunteerDocumentTypes.value)) {
      list.push(volunteerDocumentTypes[key].value.name.value);
    }
    return list;
  };

  const getTitlesList = () => {
    if (!volunteerDocumentTypes.value) return;

    let titles = [];

    for (let key of Object.keys(volunteerDocumentTypes.value)) {
      titles.push(volunteerDocumentTypes[key].value.description);
    }
    return titles;
  };
});
