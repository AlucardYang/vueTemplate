<template>
  <div id="app" class="main-container">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
<!-- 手机端模式 -->
<script src="../static/js/mobile.js"></script>
<!-- <script src="../static/js/common.js"></script> -->

<style>
@import '../static/css/common.css';
@import '../static/css/style.css';
</style>
