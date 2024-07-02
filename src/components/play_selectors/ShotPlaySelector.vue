<script setup>

import {ref, watch} from "vue";

const props = defineProps({
  types: {
    type: Array,
    required: true
  },
  player: {
    type: Object,
    required: true
  }
});


const shotPlay = ref({
  id: null,
  comments: null,
  contested: null,
  duration: null,
  gameId: null,
  hand: null,
  made: null,
  offTheDribble: null,
  playType: null,
  statPlayerId: props.player.statPlayerId,
  type: null,
  worth: null,
  zone: null

});

watch(
    () => props.player,
    (newPlayer) => {
      shotPlay.value.statPlayerId = newPlayer.statPlayerId;
    },
    { immediate: true }
);

</script>

<template>
  <div class="container">
    {{shotPlay}}
    <select v-model="shotPlay.type">
      <option v-for="type in types" :value="type">
        {{type}}
      </option>
    </select>
    <input v-model="shotPlay.statPlayerId">
  </div>
</template>

<style scoped>

</style>
