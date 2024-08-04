<script setup>
import {onMounted, ref, watch} from "vue";

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
  data: {
    type: Object,
    required: false
  }
});

const violation = ref({
  comments: props.data ? props.data.comments : null,
  timeRemaining: props.data ? props.data.timeRemaining : props.timeStamp,
  quarter: props.data ? props.data.quarter : props.quarter,
  gameId: props.data ? props.data.gameId : props.gameId,
  hand: props.data ? props.data.hand : props.player.dominantHand,
  id: props.data ? props.data.id : null,
  playType: props.data ? props.data.playType : "VIOLATION",
  statPlayerId: props.data ? props.data.statPlayerId : props.player.statPlayerId,
  type: props.data ? props.data.type : null
});

watch(
    () => props.data,
    (newData) => {
      violation.value = newData;
    }
)


const emit = defineEmits(['update:violation']);

const handleCommentsInput = (text) => {
  if(text.trim() === ''){
    violation.value.comments = null;
  }
};

onMounted(()=>{
  emit('update:violation', violation.value);
});
watch(violation, ()=>{
  emit('update:violation', violation.value);
}, {deep: true});

watch(
    () => props.player,
    (newPlayer) => {
      violation.value.statPlayerId = newPlayer.statPlayerId;
      if(!props.data){
        violation.value.hand = newPlayer.dominantHand;
      }
    },
    { immediate: true }
);

</script>

<template>
  <div class="container p-1">
    <div class="row text-center d-flex align-items-center">
      <div class="col">
        <select class="form-select small small-text" v-model="violation.type" :class="{'reduced-opacity' : violation.type === null}">
          <option disabled selected :value="null">Type</option>
          <option v-for="type in types" :value="type">{{type}}</option>
        </select>
      </div>
      <div class="col">
        <input @input="handleCommentsInput(violation.comments)" placeholder="Add comments" type="text" class="form-control small small-text" v-model="violation.comments">
      </div>
      <div class="col">
        <select class="form-select small small-text" v-model="violation.hand">
          <option v-for="hand in hands" :value="hand">{{hand}}</option>
        </select>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
