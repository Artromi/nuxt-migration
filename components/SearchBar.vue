<template>
  <div
    class="flex justify-between items-center w-96 h-11 bg-white px-4 py-2 border rounded-md"
  >
    <input
      class="outline-none placeholder-black placeholder-opacity-80 w-full"
      type="text"
      :placeholder="placeholder"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <IconSearch class="opacity-60" />
  </div>
</template>
<script>
import IconSearch from "../components/IconSearch.vue";

export default {
  components: { IconSearch },
  props: {
    placeholder: String,
    modelValue: {
      type: String,
    },
  },
  emits: ["update:modelValue"],
};
</script>
