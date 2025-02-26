import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import { useRouter } from "vue-router";
import { useRuntimeConfig } from "#app";
import { vdbFetchData } from "@/api/api";

export const useUserStore = defineStore("userStore", () => {
  const config = useRuntimeConfig();
  const apiUrl = config.public.baseUrl;
  const router = useRouter();

  const latestToken = useStorage("latestToken", null);
  const tokenRefreshTime = useStorage("tokenRefreshTime", null);
  const user = useStorage("user", null);
  const fetching = ref(false);

  async function login(email, password) {
    fetching.value = true;
    try {
      const res = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        throw new Error(`VoloDB-ERROR\n🙅‍♀️ login failed! (${res.status})`);
      }

      const data = await res.json();
      latestToken.value = data.accessToken;
      tokenRefreshTime.value = Date.now();
      await getUser();
    } catch (error) {
      console.error(error);
    } finally {
      fetching.value = false;
    }
  }

  async function getUser() {
    fetching.value = true;
    user.value = await vdbFetchData("user", "GET");
    fetching.value = false;
  }

  function logout() {
    latestToken.value = null;
    user.value = null;
    router.replace({ name: "login" });
  }

  function refreshToken() {
    const tokenDuration = 1000 * 60 * Number(config.public.tokenDuration);
    if (tokenRefreshTime.value > Date.now() - tokenDuration) return;

    fetch(`${apiUrl}/auth/refresh`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${latestToken.value}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          logout();
          throw new Error(
            `VoloDB-ERROR\n🙅‍♀️ invalid token: Token expired. (${res.status})`
          );
        }
        return res.json();
      })
      .then((token) => {
        latestToken.value = token.accessToken;
        tokenRefreshTime.value = Date.now();
      });
  }

  const loggedIn = computed(() => Boolean(latestToken.value));
  const token = computed(() => {
    refreshToken();
    return latestToken.value;
  });

  return {
    latestToken,
    tokenRefreshTime,
    user,
    fetching,
    login,
    getUser,
    logout,
    refreshToken,
    loggedIn,
    token,
  };
});
