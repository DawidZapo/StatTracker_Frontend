<script setup>

import {ref, watch} from "vue";
import {formatTypeText} from "../../assets/scripts/utilts.js";

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
        {{formatTypeText(type)}}
      </option>
    </select>
  </div>
</template>

<style scoped>

</style>
