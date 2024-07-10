<script setup>

import {computed, onMounted, ref, watch} from "vue";
import {formatTypeText} from "../../assets/scripts/utilts.js";

const props = defineProps({
  hands: {
    type: Array,
    required: true
  },
  player: {
    type: Object,
    required: true
  },
  timeStamp: {
    type: Number,
    required: true
  },
  gameId: {
    type: Number,
    required: true
  },
  possibleBlockOnPlayers: {
    type: Array,
    required: true
  }
});

const block = ref({
      comments: null,
      duration: props.timeStamp,
      gameId: props.gameId,
      hand: props.player.dominantHand,
      id: null,
      playType : "block",
      statPlayerId : props.player.statPlayerId,
      blockedStatPlayerId : null,
      inThePaint : true
});

const emit = defineEmits(['update:block', 'update:playSubmission']);

const handleCommentsInput = (text) => {
  if(text.trim() === ''){
    block.value.comments = null;
  }
};

watch(
    () => props.player,
    (newPlayer) => {
      block.value.statPlayerId = newPlayer.statPlayerId;
      block.value.hand = newPlayer.dominantHand;
    },
    { immediate: true }
);


onMounted(()=>{
  emit('update:block', block.value);
});
watch(block, (newValue) => {
  emit('update:block', newValue);
}, {deep: true});

watch(()=>props.possibleBlockOnPlayers, (newPlayers)=>{
  block.value.blockedStatPlayerId = null;
},{ immediate: true });


// validation
// watch(()=>block.value.blockedStatPlayerId, (newValue)=>{
//   emit('update:playSubmission', newValue !== null);
// });

</script>

<template>
  <div class="container">
    <div class="row text-center d-flex align-items-center">
      <div class="col">
        <select class="form-select small small-text" :class="{'reduced-opacity' : block.blockedStatPlayerId === null}" v-model="block.blockedStatPlayerId">
          <option disabled selected :value="null">Block on</option>
          <option v-for="player in possibleBlockOnPlayers" :value="player.statPlayerId">{{'#' + player.shirtNumber + ' ' + player.firstName + ' ' + player.lastName}}</option>
        </select>
      </div>
      <div class="col d-flex align-items-center justify-content-center">
        <input type="checkbox" class="form-check-input mx-1" v-model="block.inThePaint" id="within">
        <label class="form-check-label" for="within">Within perimeter</label>
      </div>
      <div class="col">
        <select class="form-select small small-text" v-model="block.hand">
          <option v-for="hand in hands" :value="hand">{{hand}}</option>
        </select>
      </div>
    </div>
    <div class="row mt-1">
      <div class="col">
        <input @input="handleCommentsInput(block.comments)" placeholder="Add comments" type="text" class="form-control small small-text" v-model="block.comments">
      </div>
    </div>
    {{block}}
  </div>
</template>

<style scoped>

</style>
