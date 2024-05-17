<script setup>
import {ref} from 'vue';

const selectedArea = ref(null);

const handleClick = (event) => {
  const svg = event.target.closest('svg');
  const pt = svg.createSVGPoint();
  pt.x = event.clientX;
  pt.y = event.clientY;

  const cursorpt = pt.matrixTransform(svg.getScreenCTM().inverse());
  selectedArea.value = `x: ${cursorpt.x}, y: ${cursorpt.y}`;
  console.log(selectedArea.value); // Or handle the selected area as needed
};


const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
};

const describeArc = (x, y, radius, startAngle, endAngle) => {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return [
    "M", start.x, start.y,
    "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
  ].join(" ");
};
</script>

<template>
  <div id="basketball-court" style="background-color: black">
    <svg
        viewBox="0 0 94 50"
        xmlns="http://www.w3.org/2000/svg"
        @click="handleClick"
        width="1090"
        height="500"
    >
      <!-- background -->
      <rect width="100%" height="100%" fill="tan"/>

      <!-- center Circle -->
      <circle cx="47" cy="25" r="6" stroke="white" stroke-width="0.2" fill="none"/>
      <line x1="47" y1="0" x2="47" y2="50" stroke="white" stroke-width="0.2"/>

      <!-- free throw lane (Left) -->
      <rect x="0" y="17" width="19" height="16" stroke="white" stroke-width="0.2" fill="none"/>
      <!--      <line x1="0" y1="0" x2="5" y2="5" stroke="white" stroke-width="0.2" />-->
      <!--      <circle cx="16" cy="25" r="6" stroke="white" stroke-width="0.2" fill="none" />-->
      <path
          :d="describeArc(19, 25, 6, 0, 180)"
          fill="none"
          stroke="white"
          stroke-width="0.2"
      />
      <path
          :d="describeArc(19, 25, 6, 180, 360)"
          fill="none"
          stroke="white"
          stroke-width="0.2"
          stroke-dasharray="0.9,0.9"
      />

      <!-- free throw lane (Right) -->
      <rect x="75" y="17" width="19" height="16" stroke="white" stroke-width="0.2" fill="none"/>
      <path
          :d="describeArc(75, 25, 6, 0, 180)"
          fill="none"
          stroke="white"
          stroke-width="0.2"
          stroke-dasharray="0.9,0.9"
      />
      <path
          :d="describeArc(75, 25, 6, 180, 360)"
          fill="none"
          stroke="white"
          stroke-width="0.2"
      />

      <!--      backboard left-->
      <line x1="4" y1="22" x2="4" y2="28" stroke="white" stroke-width="0.2"/>
      <circle cx="5" cy="25" r="1" stroke="white" stroke-width="0.2" fill="none"/>

      <!--      backboard right-->
      <line x1="90" y1="22  " x2="90" y2="28" stroke="white" stroke-width="0.2"/>
      <circle cx="89" cy="25" r="1" stroke="white" stroke-width="0.2" fill="none"/>

      <!--      Restricted area left-->
      <path
          :d="describeArc(5, 25, 4, 0, 180)"
          fill="none"
          stroke="white"
          stroke-width="0.2"
      />
      <!--            Restricted area right-->
      <path
          :d="describeArc(89, 25, 4, 180, 365)"
          fill="none"
          stroke="white"
          stroke-width="0.2"
      />

      <!--      Three point line left-->
      <path
          :d="describeArc(4, 25, 23.75, 22, 158)"
          fill="none"
          stroke="white"
          stroke-width="0.2"
      />
      <line x1="0" y1="3" x2="13" y2="3" stroke="white" stroke-width="0.2"/>
      <line x1="0" y1="47" x2="13" y2="47" stroke="white" stroke-width="0.2"/>

      <!--      Three point line right-->
      <path
          :d="describeArc(90, 25, 23.75, 202, 338)"
          fill="none"
          stroke="white"
          stroke-width="0.2"
      />
      <line x1="81" y1="3" x2="94" y2="3" stroke="white" stroke-width="0.2"/>
      <line x1="81" y1="47" x2="94" y2="47" stroke="white" stroke-width="0.2"/>

      <!--      timeout hash-->
      <line x1="28" y1="0" x2="28" y2="3" stroke="white" stroke-width="0.2"/>
      <line x1="66" y1="0" x2="66" y2="3" stroke="white" stroke-width="0.2"/>
      <line x1="28" y1="47" x2="28" y2="50" stroke="white" stroke-width="0.2"/>
      <line x1="66" y1="47" x2="66" y2="50" stroke="white" stroke-width="0.2"/>

      <!--      key hash left-->
      <line x1="7" y1="17" x2="7" y2="16.5" stroke="white" stroke-width="0.2"/>
      <line x1="8" y1="17" x2="8" y2="16.5" stroke="white" stroke-width="0.2"/>
      <line x1="12" y1="17" x2="12" y2="16.5" stroke="white" stroke-width="0.2"/>
      <line x1="15.5" y1="17" x2="15.5" y2="16.5" stroke="white" stroke-width="0.2"/>

      <line x1="7" y1="33" x2="7" y2="33.5" stroke="white" stroke-width="0.2"/>
      <line x1="8" y1="33" x2="8" y2="33.5" stroke="white" stroke-width="0.2"/>
      <line x1="12" y1="33" x2="12" y2="33.5" stroke="white" stroke-width="0.2"/>
      <line x1="15.5" y1="33" x2="15.5" y2="33.5  " stroke="white" stroke-width="0.2"/>

      <!--      key hash right-->
      <line x1="87" y1="17" x2="87" y2="16.5" stroke="white" stroke-width="0.2"/>
      <line x1="86" y1="17" x2="86" y2="16.5" stroke="white" stroke-width="0.2"/>
      <line x1="82" y1="17" x2="82" y2="16.5" stroke="white" stroke-width="0.2"/>
      <line x1="78.5" y1="17" x2="78.5" y2="16.5" stroke="white" stroke-width="0.2"/>

      <line x1="87" y1="33" x2="87" y2="33.5" stroke="white" stroke-width="0.2"/>
      <line x1="86" y1="33" x2="86" y2="33.5" stroke="white" stroke-width="0.2"/>
      <line x1="82" y1="33" x2="82" y2="33.5" stroke="white" stroke-width="0.2"/>
      <line x1="78.5" y1="33" x2="78.5" y2="33.5  " stroke="white" stroke-width="0.2"/>

      <!--      bounds-->
      <line x1="0" y1="0" x2="94" y2="0" stroke="white" stroke-width="0.2"/>
      <line x1="0" y1="50" x2="94" y2="50" stroke="white" stroke-width="0.2"/>
      <line x1="0" y1="0" x2="0" y2="50" stroke="white" stroke-width="0.2"/>
      <line x1="94" y1="0" x2="94" y2="50" stroke="white" stroke-width="0.2"/>
    </svg>
    <p>{{ selectedArea }}</p>
  </div>
</template>

<style scoped>
</style>
