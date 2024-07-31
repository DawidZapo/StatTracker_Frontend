<script setup>

import {onMounted, ref} from "vue";

const props = defineProps({
  successful: {
    required: true,
    type: Boolean
  },
  message: {
    required: true,
    type: String
  }
});

// const message = ref(props.successful ? 'Play has been successfully edited' : 'Ops, there was an error while editing play');

</script>

<template>
  <div class="reduced-opacity my-alert" :class="{'alert alert-success' : props.successful , 'alert alert-danger' : !props.successful}">
    {{ message }}
  </div>
</template>

<style scoped>
.reduced-opacity{
  opacity: 80%;
}
.my-alert{
  padding: 6px;
  margin-bottom: 0;
}
</style>
