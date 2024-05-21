<script setup>
import {useStore} from "vuex";
import {computed} from "vue";

const store = useStore();
const selectedTeamId = computed(() => store.getters.selectedTeamId);

</script>

<template>
  <div>
    <template v-if="selectedTeamId != null">
      Team records here || Team ID: {{selectedTeamId}}
    </template>
  </div>
</template>

<style scoped>

</style>
