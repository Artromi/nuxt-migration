import { useUserStore } from "@/stores/UserStore";

// fetch for data
export const vdbFetchData = async (subdirectory, method, data) => {
  const token = useUserStore().token;

  const config = useRuntimeConfig();
  const apiUrl = config.public.baseUrl;

  // If first character is a slash -> delete it
  if (String(subdirectory).charAt(0) === "/")
    subdirectory = String(subdirectory).substring(1);
  // Fetch Data from the Backend
  return fetch(`${apiUrl}/${subdirectory}`, {
    method,
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })
    .then((res) => {
      if (!res.ok)
        throw Error(`VoloDB-ERROR\n🙅‍♀️ fetching failed! (${res.status}`);
      if (res.headers.get("Content-Length") == 0) return;

      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return res.json();
      } else {
        return res.text();
      }
    })
    .then((data) => {
      return data;
    });
};

// fetch for formData/files

export const vdbFetchFormData = async (subdirectory, method, formData) => {
  const token = useUserStore().token;
  // If first character is a slash -> delete it
  if (String(subdirectory).charAt(0) === "/")
    subdirectory = String(subdirectory).substring(1);

  return fetch(`${apiUrl}/${subdirectory}`, {
    method,
    headers: {
      authorization: `Bearer ${token}`,
    },
    body: formData,
  })
    .then((res) => {
      if (!res.ok) {
        const errorText = res.text();
        throw new Error(
          `VoloDB-ERROR\n🙅‍♀️ fetching failed! (${res.status}): ${errorText}`
        );
      }
    })
    .then((data) => {
      return data;
    });
};
