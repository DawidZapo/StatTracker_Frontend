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
  }
});

const foul = ref({
      comments: null,
      duration: props.timeStamp,
      gameId: props.gameId,
      hand: props.player.dominantHand,
      id: null,
      playType : "foul",
      statPlayerId : props.player.statPlayerId,
      foulOnStatPlayerId : null,
      type : "REGULAR"
});

const emit = defineEmits(['update:foul']);

const handleCommentsInput = (text) => {
  if(text.trim() === ''){
    foul.value.comments = null;
  }
};

watch(
    () => props.player,
    (newPlayer) => {
      foul.value.statPlayerId = newPlayer.statPlayerId;
      foul.value.hand = newPlayer.dominantHand;
    },
    { immediate: true }
);

onMounted(()=>{
  emit('update:foul', foul.value);
});
watch(foul, (newValue) => {
  emit('update:foul', foul.value);
}, {deep: true});



</script>

<template>
  <div class="container">
    <div class="row text-center d-flex align-items-center">
      <div class="col">
        <select class="form-select small small-text" v-model="foul.type" :class="{'reduced-opacity' : foul.type === null}">
          <option disabled selected :value="null">Type</option>
          <option v-for="type in types" :value="type">{{formatTypeText(type)}}</option>
        </select>
      </div>
      <div class="col">
        <select class="form-select small small-text" :class="{'reduced-opacity' : foul.foulOnStatPlayerId === null}" v-model="foul.foulOnStatPlayerId">
          <option disabled selected :value="null">on player</option>
          <option v-for="player in possibleFoulOnPlayers" :value="player.statPlayerId">{{player.lastName}}</option>
        </select>
      </div>
      <div class="col">
        <select class="form-select small small-text" v-model="foul.hand">
          <option v-for="hand in hands" :value="hand">{{formatTypeText(hand)}}</option>
        </select>
      </div>
    </div>
    <div class="row mt-1">
      <div class="col">
        <input @input="handleCommentsInput(foul.comments)" placeholder="Add comments" type="text" class="form-control small small-text" v-model="foul.comments">
      </div>
    </div>
    {{foul}}
  </div>
</template>

<style scoped>

</style>
