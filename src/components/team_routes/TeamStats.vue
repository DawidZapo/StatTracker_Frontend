<script setup>
import {useStore} from "vuex";
import {computed} from "vue";

const store = useStore();
const selectedTeamId = computed(() => store.getters.selectedTeamId);
</script>

<template>
  <div>
    <!--      <h3>{{ selectedTeam.name }}</h3>-->
    <!--      <p>Location: {{ selectedTeam.location }}</p>-->
    <!--      <p>Founded: {{ selectedTeam.founded }}</p>-->
    <template v-if="selectedTeamId != null">
      team stats here || TeamWithPlayers ID: {{selectedTeamId}}
    </template>
  </div>
</template>

<style scoped>

</style>
