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
  <svg
      viewBox="0 0 47 50"
      xmlns="http://www.w3.org/2000/svg"
      @click="handleClick"
      width="1090"
      height="500">
<!--      transform="rotate(90 50 47)"-->

    <!-- background -->
    <rect width="100%" height="100%" fill="tan"/>


    <!--    zones-->
    <path d="M38 0 L 47 0 L 47 50 L38 50" fill="red"></path>

    <path d="M0 0 H13 V3 H0 L 0 0" fill="red"></path>
    <path d="M13 0 L38 0 L38 13 L24.5 13 Q 20.5 6.2 13 3" fill="red"></path>
    <path d="M24.5 13 L 38 13 L 38 37 L 24.5 37 Q 30.9 25 24.5 13" fill="red"></path>
    <path transform="scale(1, -1) translate(0, -50)" d="M13 0 L38 0 L38 13 L24.5 13 Q 20.5 6.2 13 3" fill="red"></path>
    <path transform="scale(1, -1) translate(0, -50)" d="M0 0 H13 V3 H0 L 0 0" fill="red"></path>

    <path d="M0 3 L 13 3 L 8.6 15 L0 15" fill="red"></path>
    <path d="M8.6 15 L 13 3 Q 20.5 6.5  24.5 13 L 16.2 18.1 Q 14 15.9  11 15.1 L8.6 15 " fill="red"></path>
    <path d="M24.5 13 Q31 25  24.5 37 L 16.3 31.9 Q 21.7 25 16.3 18.1" fill="red"></path>
    <path transform="scale(1, -1) translate(0, -50)" d="M0 3 L 13 3 L 8.6 15 L0 15" fill="red"></path>
    <path transform="scale(1, -1) translate(0, -50)" d="M8.6 15 L 13 3 Q 20.5 6.5  24.5 13 L 16.2 18.1 Q 14 15.9  11 15.1 L8.6 15 " fill="red"></path>

    <path d="M0 15 L 8.7 15 L 11 15.2 L 12.87 15.73 L8.24 21.2 L 6.5 21 L 0 21" fill="red"></path>
    <path d="M8.24 21.2 L 12.87 15.73 Q 18.5 18.6  19 25 L 11  25 Q 11 22  8.24 21.2" fill="red"></path>
    <path transform="scale(1, -1) translate(0, -50)" d="M8.24 21.2 L 12.87 15.73 Q 18.5 18.6  19 25 L 11  25 Q 11 22  8.24 21.2" fill="red"></path>
    <path transform="scale(1, -1) translate(0, -50)" d="M0 15 L 8.7 15 L 11 15.2 L 12.87 15.73 L8.24 21.2 L 6.5 21 L 0 21" fill="red"></path>

    <path d="M0 21 L 7 21 Q 11 21.5  11 25 Q 11 28.5  7 29 L 0 29" fill="red"></path>


    <!-- center Circle -->
    <path
        :d="describeArc(47, 25, 6, 180, 360)"
        fill="none"
        stroke="black"
        stroke-width="0.2"
    />
    <line x1="47" y1="0" x2="47" y2="50" stroke="black" stroke-width="0.2"/>

    <!-- free throw lane (Left) -->
    <rect x="0" y="17" width="19" height="16" stroke="black" stroke-width="0.2" fill="none"/>

    <path
        :d="describeArc(19, 25, 6, 0, 180)"
        fill="none"
        stroke="black"
        stroke-width="0.2"
    />
    <path
        :d="describeArc(19, 25, 6, 180, 360)"
        fill="none"
        stroke="black"
        stroke-width="0.2"
        stroke-dasharray="0.9,0.9"
    />

    <!--      backboard left-->
    <line x1="4" y1="22" x2="4" y2="28" stroke="black" stroke-width="0.2"/>
    <circle cx="5" cy="25" r="1" stroke="black" stroke-width="0.2" fill="none"/>


    <!--      Restricted area left-->
    <path
        :d="describeArc(5, 25, 4, 0, 180)"
        fill="none"
        stroke="black"
        stroke-width="0.2"
    />

    <!--      Three point line left-->
    <path
        :d="describeArc(4, 25, 23.75, 22, 158)"
        fill="none"
        stroke="black"
        stroke-width="0.2"
    />
    <line x1="0" y1="3" x2="13" y2="3" stroke="black" stroke-width="0.2"/>
    <line x1="0" y1="47" x2="13" y2="47" stroke="black" stroke-width="0.2"/>


    <!--      timeout hash-->
    <line x1="28" y1="0" x2="28" y2="3" stroke="black" stroke-width="0.2"/>
    <line x1="28" y1="47" x2="28" y2="50" stroke="black" stroke-width="0.2"/>

    <!--      key hash left-->
    <line x1="7" y1="17" x2="7" y2="16.5" stroke="black" stroke-width="0.2"/>
    <line x1="8" y1="17" x2="8" y2="16.5" stroke="black" stroke-width="0.2"/>
    <line x1="12" y1="17" x2="12" y2="16.5" stroke="black" stroke-width="0.2"/>
    <line x1="15.5" y1="17" x2="15.5" y2="16.5" stroke="black" stroke-width="0.2"/>

    <line x1="7" y1="33" x2="7" y2="33.5" stroke="black" stroke-width="0.2"/>
    <line x1="8" y1="33" x2="8" y2="33.5" stroke="black" stroke-width="0.2"/>
    <line x1="12" y1="33" x2="12" y2="33.5" stroke="black" stroke-width="0.2"/>
    <line x1="15.5" y1="33" x2="15.5" y2="33.5  " stroke="black" stroke-width="0.2"/>




    <!--    lines temp-->
    <!--    <line x1="5" y1="25" x2="13" y2="3" stroke="red" stroke-width="0.2"></line>-->
    <line x1="8.6" y1="15" x2="13" y2="3" stroke="white" stroke-width="0.2"></line>
    <!--    <line x1="5" y1="25" x2="24.5" y2="13" stroke="red" stroke-width="0.2"></line>-->
    <line x1="16.2" y1="18.1" x2="24.5" y2="13" stroke="white" stroke-width="0.2"></line>
    <!--    <line x1="5" y1="25" x2="24.5" y2="37" stroke="red" stroke-width="0.2"></line>-->
    <line transform="scale(1, -1) translate(0, -50)" x1="8.6" y1="15" x2="13" y2="3" stroke="white" stroke-width="0.2"></line>
    <!--    <line x1="5" y1="25" x2="13" y2="47" stroke="red" stroke-width="0.2"></line>-->
    <line transform="scale(1, -1) translate(0, -50)" x1="16.2" y1="18.1" x2="24.5" y2="13" stroke="white" stroke-width="0.2"></line>
    <path
        :d="describeArc(9, 25, 10, 0, 180)"
        fill="none"
        stroke="white"
        stroke-width="0.2"
    />
    <line x1="0" y1="15" x2="9" y2="15" stroke="white" stroke-width="0.2"></line>
    <line x1="0" y1="35" x2="9" y2="35" stroke="white" stroke-width="0.2"></line>
    <path
        :d="describeArc(7, 25, 4, 0, 180)"
        fill="none"
        stroke="white"
        stroke-width="0.2"
    />
    <line x1="0" y1="21" x2="7" y2="21" stroke="white" stroke-width="0.2"></line>
    <line x1="0" y1="29" x2="7" y2="29" stroke="white" stroke-width="0.2"></line>

    <!--    <line x1="5" y1="25" x2="22" y2="5" stroke="yellow" stroke-width="0.2"></line>-->
    <line x1="8.24" y1="21.2" x2="12.87" y2="15.73" stroke="white" stroke-width="0.2"></line>
    <line transform="scale(1, -1) translate(0, -50)" x1="8.24" y1="21.2" x2="12.87" y2="15.73" stroke="white" stroke-width="0.2"></line>

    <line x1="13" y1="0" x2="13" y2="3" stroke="white" stroke-width="0.2"></line>
    <line x1="24.5" y1="13" x2="38" y2="13" stroke="white" stroke-width="0.2"></line>
    <line x1="24.5" y1="37" x2="38" y2="37" stroke="white" stroke-width="0.2"></line>
    <line x1="13" y1="47" x2="13" y2="50" stroke="white" stroke-width="0.2"></line>
    <line x1="38" y1="0" x2="38" y2="50" stroke="white" stroke-width="0.2"></line>


    <!--      bounds-->
    <line x1="0" y1="0" x2="47" y2="0" stroke="black" stroke-width="0.2"/>
    <line x1="0" y1="50" x2="47" y2="50" stroke="black" stroke-width="0.2"/>
    <line x1="0" y1="0" x2="0" y2="50" stroke="black" stroke-width="0.2"/>
    <line x1="47" y1="0" x2="47" y2="50" stroke="black" stroke-width="0.2"/>


  </svg>
  <p>{{ selectedArea }}</p>
</template>

<style scoped>
</style>
