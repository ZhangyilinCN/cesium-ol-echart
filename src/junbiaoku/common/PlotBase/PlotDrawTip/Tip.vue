<template>
  <div class="plot-draw-tip-container">
    <div  v-for="(text,index) in contents" :key="index">{{text}}</div>
  </div>
</template>
<script>
export default {
  name: "PlotDrawTip",
  props: {
    contents: {
      type: Array
    }
  }
};
</script>

<style lang="css" scoped>
.plot-draw-tip-container {
  position: absolute;
  background: rgba(0, 0, 0, 0.637);
  padding: 6px;
  color: white;
    pointer-events: none;
}

.plot-draw-tip-container::before {
  position: absolute;
  content: "";
  top: calc(50% - 10px);
  left:  -10px;
  border-bottom: 10px solid transparent;
  border-top: 10px solid transparent;
  border-right: 10px solid rgba(0, 0, 0, 0.637);
}
</style>