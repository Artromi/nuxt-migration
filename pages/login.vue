<template>
  <div class="flex">
    <main
      class="flex flex-col bg-white justify-center w-full items-center lg:px-64 px-6"
    >
      <div>
        <img
          src="/logo-volodb-regular.svg"
          alt="volodb-logo"
          class="lg:hidden pb-8"
        />
        <h1 class="text-3xl text-voloblue-200">Willkommen zurück!</h1>
        <h2 class="text-vologray-400 text-xl mt-2">
          Bitte logge dich in deinen Account ein.
        </h2>
        <form @submit.prevent="onSubmit" class="flex flex-col mt-12" novalidate>
          <div
            class="flex flex-col border-l-4 border-transparent h-16 w-96 focus-within:border-l-4 focus-within:border-l-voloblue-200 outline outline-1 outline-vologray-200 relative"
            :class="{ 'error-animation': errorMail }"
          >
            <label for="email" class="text-sm text-vologray-300 pl-4 pt-2"
              >E-mail Adresse</label
            >
            <input
              class="outline-none pl-4 placeholder-transparent"
              type="text"
              id="email"
              name="email"
              v-model="email"
              placeholder="E-Mail Adresse"
              required
              autocomplete="off"
              v-if="!errorMail"
            />
          </div>
          <div
            class="flex flex-col border-l-4 border-transparent h-16 w-96 focus-within:border-l-4 focus-within:border-l-voloblue-200 outline outline-1 outline-vologray-200 relative"
            :class="{ 'error-animation': errorPassword }"
          >
            <label for="password" class="text-sm text-vologray-300 pl-4 pt-2"
              >Passwort</label
            >
            <input
              class="outline-none pl-4 placeholder-transparent"
              type="password"
              id="password"
              name="password"
              v-model="password"
              placeholder="Passwort"
              required
              v-if="!errorPassword"
            />
          </div>

          <ButtonStandard class="mt-16 self-start" type="submit"
            >Einloggen</ButtonStandard
          >
        </form>

        <!-- <ContainerModal v-if="userStore.fetching">
          <div class="flex flex-row p-4 text-md gap-2 items-center">
            <IconSpinner />logging in ...
          </div>
        </ContainerModal> -->
      </div>
    </main>

    <div
      class="bg-vologray-100 justify-center w-full hidden items-center lg:flex px-4"
    >
      <img src="/logo-volodb-regular.svg" alt="volodb-logo" />
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from "@/stores/UserStore";

const userStore = useUserStore();
const router = useRouter();

// Falls User bereits eingeloggt ist, weiterleiten
if (userStore.loggedIn) {
  router.replace({ name: "volunteers" });
}

const email = ref("");
const password = ref("");
const errorMail = ref(false);
const errorPassword = ref(false);

const errorAnimationMail = () => {
  errorMail.value = true;
  setTimeout(() => {
    errorMail.value = false;
  }, 1000);
};

const errorAnimationPassword = () => {
  errorPassword.value = true;
  setTimeout(() => {
    errorPassword.value = false;
  }, 1000);
};

const onSubmit = async () => {
  validate();
  if (errorMail.value || errorPassword.value) {
    return;
  }
  try {
    await userStore.login(email.value, password.value);
    router.push("/projects");
  } catch (error) {
    console.error(error);
    errorAnimationMail();
    errorAnimationPassword();
    email.value = "";
    password.value = "";
  }
};

const validate = () => {
  if (!email.value) {
    console.error(`VoloDB-ERROR:\n🤌 no email provided`);
    errorAnimationMail();
  }
  if (!password.value) {
    console.error(`VoloDB-ERROR:\n🤌 no password provided`);
    errorAnimationPassword();
  }
};
</script>
