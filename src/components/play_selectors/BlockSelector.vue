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
  quarter: {
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
  },
  data: {
    type: Object,
    required: false
  }
});

const block = ref({
      comments: props.data ? props.data.comments : null,
      timeRemaining: props.data ? props.data.timeRemaining : props.timeStamp,
      quarter: props.data ? props.data.quarter : props.quarter,
      gameId: props.data ? props.data.gameId : props.gameId,
      hand: props.data ? props.data.hand : props.player.dominantHand,
      id: props.data ? props.data.id : null,
      playType: props.data ? props.data.playType : "BLOCK",
      statPlayerId: props.data ? props.data.statPlayerId : props.player.statPlayerId,
      blockedStatPlayerId: props.data ? props.data.blockedStatPlayerId : null,
      inThePaint: props.data ? props.data.inThePaint : true
});

const emit = defineEmits(['update:block', 'update:playSubmission']);

// watch(
//     () => props.data,
//     (newData) => {
//       block.value = newData;
//     }
// )

const handleCommentsInput = (text) => {
  if(text.trim() === ''){
    block.value.comments = null;
  }
};

watch(
    () => props.player,
    (newPlayer) => {
      block.value.statPlayerId = newPlayer.statPlayerId;
      if(!props.data){
        block.value.hand = newPlayer.dominantHand;
      }
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
  if (!newPlayers.find(player => player.statPlayerId === block.value.blockedStatPlayerId)) {
    block.value.blockedStatPlayerId = null;
  }
},{ immediate: true });


// validation
// watch(()=>block.value.blockedStatPlayerId, (newValue)=>{
//   emit('update:playSubmission', newValue !== null);
// });

</script>

<template>
  <div class="container p-1">
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
  </div>
</template>

<style scoped>

</style>
