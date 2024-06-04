<script setup>
import {ref} from "vue";

const props = defineProps({
  seasons: {
    type: Array,
    required: true
  },
  selectedSeason: {
    type: String,
    required: true
  }
});

const emits = defineEmits(['updateSelectedSeason'])
const all = ref('all');

const updateSeason = (value) => {
  emits('updateSelectedSeason', value);
};

</script>

<template>
  <template v-if="seasons.length !== 0">
    <select
        id="season-select"
        class="form-control w-50 small-text text-center"
        :value="selectedSeason"
        @input="updateSeason($event.target.value)"
    >
      <option :value="all" value="all">All seasons</option>
      <option v-for="season in seasons" :key="season" :value="season">
        {{ season }}
      </option>
    </select>
  </template>
</template>

<style scoped>

</style>
