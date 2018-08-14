<template>
  <div>
    <div>{{sayHello}}</div>
    <wx-share :shareTitle="shareTitle" :shareImg="shareImg" :shareDes="shareDes" :shareCuid="shareCuid" :isOnlyShare="isOnlyShare" :readUuid="readUuid"></wx-share>
    <read-report :readUuid="readUuid"></read-report>
  </div>
</template>

<script src="./home.js"></script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped src="./home.css"></style>
