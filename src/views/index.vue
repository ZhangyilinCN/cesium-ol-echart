<template>
  <div class="all-container">
      <newmap></newmap>
  </div>
</template>

<script>
import newmap from "@/views/map.vue";
export default {
  components: {
    newmap,
  },
  data() {
    return {
    };
  },
  methods: {
  },
};
</script>

<style lang="scss" scoped>
// vh、vw计算函数
// @function vh($px) {
//   @return ($px/1020) * 100vh;
// }
// @function vw($px) {
//   @return ($px/1920) * 100vw;
// }
.all-container {
}
</style>