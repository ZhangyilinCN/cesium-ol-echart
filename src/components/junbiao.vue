<template>
  <div class="panel">
    <div class="panel-body">
      <button @click="draw('polygon')">面</button>
      <button @click="draw('circle')">正圆</button>
      <button @click="draw('ellipse')">椭圆</button>
      <button @click="draw('sector')">扇形</button>
      <button @click="draw('rectangle')">矩形</button>
      <button @click="draw('closedcurve')">曲线面</button>
      <button @click="draw('finearrow')">直箭头</button>
      <button @click="draw('assaultdirection')">突击方向</button>
      <button @click="draw('attackarrow')">进攻方向</button>
      <button @click="draw('tailedattackarrow')">进攻方向尾</button>
      <button @click="draw('gatheringplace')">集结地</button>
      <button @click="draw('doublearrow')">钳击</button>
      <button @click="draw('squadcombat')">分队战斗</button>
      <button @click="draw('tailedsquadcombat')">分队战斗尾</button>
      <div>
        <button @click="clear">清空</button>
        <button @click="getAll">获取所有标号</button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  props: ["plotDraw", "militaryPlotLayer"],
  methods: {
    draw(plotType) {
      viewer.scene.globe.depthTestAgainstTerrain = true; //默认为false
      this.plotDraw.activate(plotType);
    },
    clear() {
      this.militaryPlotLayer.clear();
    },
    getAll() {
      let ar = this.militaryPlotLayer.toJSON();
      console.log(ar);
    },
  },
};
</script>
<style scoped lang="scss">
.panel {
  position: fixed;
  top: 60px;
  left: 10px;
}
.panel-body {
  width: 300px;
  display: flex;
  flex-wrap: wrap;
  button {
    margin-right: 12px;
    margin-bottom: 12px;
  }
}
button {
  padding: 0 10px;
  height: 30px;
  font-size: 18px;
  line-height: 30px;
  text-align: center;
}
</style>
