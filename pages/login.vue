<template>
  <div class="flex">
    <main
      class="bg-white flex flex-col justify-center items-center px-6 w-full lg:px-64"
    >
      <div>
        <img
          src="/logo-volodb-regular.svg"
          alt="volodb-logo"
          class="lg:hidden pb-8"
        />
        <h1 class="text-3xl text-voloblue-200">Willkommen zurück!</h1>
        <h2 class="text-xl text-vologray-400 mt-2">
          Bitte logge dich in deinen Account ein.
        </h2>
        <form @submit.prevent="onSubmit" class="flex flex-col mt-12" novalidate>
          <div
            class="focus-within:border-l-voloblue-200 focus-within:border-l-4 outline outline-vologray-200 outline-1 border-l-4 border-transparent flex flex-col w-96 relative h-16"
            :class="{ 'error-animation': errorMail }"
          >
            <label for="email" class="text-vologray-300 text-sm pt-2 pl-4"
              >E-mail Adresse</label
            >
            <input
              class="placeholder-transparent outline-none pl-4"
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
            class="focus-within:border-l-voloblue-200 focus-within:border-l-4 outline outline-vologray-200 outline-1 border-l-4 border-transparent flex flex-col w-96 relative h-16"
            :class="{ 'error-animation': errorPassword }"
          >
            <label for="password" class="text-vologray-300 text-sm pt-2 pl-4"
              >Passwort</label
            >
            <input
              class="placeholder-transparent outline-none pl-4"
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
          <div class="p-4 flex flex-row gap-2 items-center text-md">
            <IconSpinner />logging in ...
          </div>
        </ContainerModal> -->
      </div>
    </main>

    <div
      class="justify-center items-center bg-vologray-100 hidden lg:flex w-full px-4"
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
  router.replace({ name: "VolunteersView" });
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
    router.push("/volunteers");
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
