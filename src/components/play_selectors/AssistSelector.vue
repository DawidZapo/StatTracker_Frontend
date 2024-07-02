<script setup>

defineProps({
  types: {
    type: Array,
    required: true
  }
})

</script>

<template>
  <div>
    <select>
      <option v-for="type in types">
        {{type}}
      </option>
    </select>
  </div>
</template>

<style scoped>

</style>
