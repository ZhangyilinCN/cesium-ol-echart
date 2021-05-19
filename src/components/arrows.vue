<template>
  <div>
    <div class="btn-con">
      <el-button @click="straightArrow" size="mini">直线箭头</el-button>
      <el-button @click="attackArrow" size="mini">攻击箭头</el-button>
      <el-button @click="pincerArrow" size="mini">钳击箭头</el-button>
      <el-button @click="save" size="mini">保存</el-button>
      <el-button @click="clearOne" size="mini">删除</el-button>
      <el-button @click="hideOne" size="mini">隐藏</el-button>
      <el-button @click="showAll" size="mini">显示所有</el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    viewer: {
      default: () => null,
    },
  },
  watch: {
    viewer() {},
  },
  data() {
    return {};
  },
  mounted() {
    console.log(999, arrow);
    arrow.disable();
    arrow.init(viewer);
  },
  methods: {
    straightArrow() {
      arrow.draw("straightArrow");
    },
    attackArrow() {
      arrow.draw("attackArrow");
    },
    pincerArrow() {
      arrow.draw("pincerArrow");
    },
    save() {
      arrow.saveData();
    },
    clearOne() {
      // 单击箭头删除
      arrow.clearOne();
    },
    hideOne() {
      // 单击箭头隐藏
      arrow.hideOne();
    },
    showAll() {
      // 单击箭头隐藏
      arrow.showAll();
    },
  },
};
</script>

<style lang="scss" scoped>
.btn-con {
  text-align: left;
  position: fixed;
  top: 60px;
  left: 10px;
  max-width: 200px;
  ::v-deep .el-button {
    margin: 5px 2px;
  }
}
</style>