<script setup>

import {ref} from "vue";

const highlightedZone = ref(null);

const highlightZone = (zone) => {
  highlightedZone.value = zone;
};

const handleMouseLeave = () => {
  highlightedZone.value = null;
};

</script>

<template>
  <div>
    <svg
        width="500"
        height="470"
        viewBox="0 0 500 470"
        xmlns="http://www.w3.org/2000/svg"
        @mousemove="handleMouseMove"
        @mouseleave="handleMouseLeave"
    >
      <!-- Court outline -->
      <rect x="0" y="0" width="500" height="470" fill="#e3e3e3" />

      <!-- Paint area -->
      <rect
          :fill="highlightedZone === 'paint' ? 'rgba(255, 0, 0, 0.5)' : '#d3d3d3'"
          x="170"
          y="0"
          width="160"
          height="190"
          @mouseover="highlightZone('paint')"
      />

      <!-- Three-point arc -->
      <path
          :fill="highlightedZone === '3pt' ? 'rgba(0, 0, 255, 0.5)' : 'transparent'"
          stroke="#d3d3d3"
          stroke-width="4"
          d="M170 190 Q 250 350 330 190"
          @mouseover="highlightZone('3pt')"
      />

      <!-- Left wing 3-point -->
      <rect
          :fill="highlightedZone === 'left-wing' ? 'rgba(0, 255, 0, 0.5)' : 'transparent'"
          x="0"
          y="0"
          width="170"
          height="190"
          @mouseover="highlightZone('left-wing')"
      />

      <!-- Right wing 3-point -->
      <rect
          :fill="highlightedZone === 'right-wing' ? 'rgba(0, 255, 0, 0.5)' : 'transparent'"
          x="330"
          y="0"
          width="170"
          height="190"
          @mouseover="highlightZone('right-wing')"
      />
    </svg>
  </div>
</template>

<style scoped>

</style>
