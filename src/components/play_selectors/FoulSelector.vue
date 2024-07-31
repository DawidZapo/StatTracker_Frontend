<script setup>
import {onMounted, ref, watch} from "vue";
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
  types: {
    type: Array,
    required: true
  },
  possibleFoulOnPlayers: {
    type: Array,
    required: true
  },
  data: {
    type: Object,
    required: false
  }
});

const foul = ref({
      comments: props.data ? props.data.comments : null,
      timeRemaining: props.data ? props.data.timeRemaining : props.timeStamp,
      quarter: props.data ? props.data.quarter : props.quarter,
      gameId: props.data ? props.data.gameId : props.gameId,
      hand: props.data ? props.data.hand : props.player.dominantHand,
      id: props.data ? props.data.id : null,
      playType: props.data ? props.data.playType : "FOUL",
      statPlayerId: props.data ? props.data.statPlayerId : props.player.statPlayerId,
      foulOnStatPlayerId: props.data ? props.data.foulOnStatPlayerId : null,
      type: props.data ? props.data.type : "REGULAR"
});

const emit = defineEmits(['update:foul']);

watch(
    () => props.data,
    (newData) => {
      foul.value = newData;
    }
)

const handleCommentsInput = (text) => {
  if(text.trim() === ''){
    foul.value.comments = null;
  }
};

watch(
    () => props.player,
    (newPlayer) => {
      foul.value.statPlayerId = newPlayer.statPlayerId;
      if(!props.data){
        foul.value.hand = newPlayer.dominantHand;
      }
    },
    { immediate: true }
);

onMounted(()=>{
  emit('update:foul', foul.value);
});
watch(foul, (newValue) => {
  emit('update:foul', newValue);
}, {deep: true});

</script>

<template>
  <div class="container p-1">
    <div class="row text-center d-flex align-items-center">
      <div class="col">
        <select class="form-select small small-text" v-model="foul.type" :class="{'reduced-opacity' : foul.type === null}">
          <option disabled selected :value="null">Type</option>
          <option v-for="type in types" :value="type">{{type}}</option>
        </select>
      </div>
      <div class="col">
        <select class="form-select small small-text" :class="{'reduced-opacity' : foul.foulOnStatPlayerId === null}" v-model="foul.foulOnStatPlayerId">
          <option disabled selected :value="null">Foul on</option>
          <option v-for="player in possibleFoulOnPlayers" :value="player.statPlayerId">{{'#' + player.shirtNumber + ' ' + player.firstName + ' ' + player.lastName}}</option>
        </select>
      </div>
      <div class="col">
        <select class="form-select small small-text" v-model="foul.hand">
          <option v-for="hand in hands" :value="hand">{{hand}}</option>
        </select>
      </div>
    </div>
    <div class="row mt-1">
      <div class="col">
        <input @input="handleCommentsInput(foul.comments)" placeholder="Add comments" type="text" class="form-control small small-text" v-model="foul.comments">
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
