<script setup>

</script>

<template>
  <div class="container">
    <div class="row">
      <div class="col-md-12 error-container">
        <h1 class="error-code">Network connection</h1>
        <p class="error-message">Looks like there is problem connecting with database</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
body {
  background-color: #f8f9fa;
}

.error-container {
  margin-top: 100px;
  text-align: center;
}

.error-code {
  font-size: 60px;
  color: #b01a18;
}

.error-message {
  font-size: 24px;
  margin-bottom: 40px;
}
</style>
