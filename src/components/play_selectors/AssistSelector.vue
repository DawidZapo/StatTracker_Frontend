<script setup>

import {onMounted, ref, watch} from "vue";
import {formatTypeText} from "../../assets/scripts/utilts.js";

const props = defineProps({
  types: {
    type: Array,
    required: true
  },
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
  possibleAssistedPlayers: {
    type: Array,
    required: true
  },
  data: {
    type: Object,
    required: false
  }
});

const assist = ref({
  comments: props.data ? props.data.comments : null,
  timeRemaining: props.data ? props.data.timeRemaining : props.timeStamp,
  quarter: props.data ? props.data.quarter : props.quarter,
  gameId: props.data ? props.data.gameId : props.gameId,
  hand: props.data ? props.data.hand : props.player.dominantHand,
  id: props.data ? props.data.id : null,
  playType: props.data ? props.data.playType : 'ASSIST',
  statPlayerId: props.data ? props.data.statPlayerId : props.player.statPlayerId,
  toStatPlayerId: props.data ? props.data.toStatPlayerId : null,
  type: props.data ? props.data.type : null
});

watch(
    () => props.data,
    (newData) => {
      assist.value = newData;
    }
)

const emit = defineEmits(['update:assist']);

const handleCommentsInput = (text) => {
  if(text.trim() === ''){
    assist.value.comments = null;
  }
};

watch(
    () => props.player,
    (newPlayer) => {
      assist.value.statPlayerId = newPlayer.statPlayerId;
      assist.value.hand = newPlayer.dominantHand;
    },
    { immediate: true }
);

onMounted(()=>{
  emit('update:assist', assist.value);
});
watch(assist, (newValue) => {
  emit('update:assist', newValue);
}, {deep: true});

</script>

<template>
  <div class="container p-1">
    <div class="row text-center d-flex align-items-center">
      <div class="col">
        <select class="form-select small small-text" v-model="assist.type" :class="{'reduced-opacity' : assist.type === null}">
          <option disabled selected :value="null">Type</option>
          <option v-for="type in types" :value="type">{{type}}</option>
        </select>
      </div>
      <div class="col">
        <select class="form-select small small-text" :class="{'reduced-opacity' : assist.toStatPlayerId === null}" v-model="assist.toStatPlayerId">
          <option disabled selected :value="null">To player</option>
          <option v-for="player in possibleAssistedPlayers" :value="player.statPlayerId">{{'#' + player.shirtNumber + ' ' + player.firstName + ' ' + player.lastName}}</option>
        </select>
      </div>
      <div class="col">
        <select class="form-select small small-text" v-model="assist.hand">
          <option v-for="hand in hands" :value="hand">{{hand}}</option>
        </select>
      </div>
    </div>
    <div class="row mt-1">
      <div class="col">
        <input @input="handleCommentsInput(assist.comments)" placeholder="Add comments" type="text" class="form-control small small-text" v-model="assist.comments">
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
