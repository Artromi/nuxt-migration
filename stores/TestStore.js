import { vdbFetchData } from "@/api/api";
import { defineStore } from "pinia";

const config = useRuntimeConfig();
const apiUrl = config.public.baseUrl;

export const useTestStore = defineStore("Test", {
  actions: {
    async login(email, password) {
      this.fetching = true;
      await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email,
          password,
        }),
      })
        .then((res) => {
          if (!res.ok)
            throw Error(`VoloDB-ERROR\n🙅‍♀️ login failed! (${res.status}`);
          return res.json();
        })
        .then((res) => {
          this.latestToken = res.accessToken;
          this.tokenRefreshTime = Date.now();
          this.getUser();
        })
        // .catch((error) => {
        //   this.loginErrorMessage = error
        // })
        .finally(() => (this.fetching = false));
    },
  },
});
