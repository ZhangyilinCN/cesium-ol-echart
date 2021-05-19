<template>
  <div class="draw-select">
    <el-select
      size="mini"
      v-model="drawValue"
      @change="selectChange"
      placeholder="框选搜索"
    >
      <el-option label="清空" value="None1"></el-option>
      <el-option label="圆" value="Circle"></el-option>
      <!-- <el-option label="三角形" value="Circle1"></el-option>
      <el-option label="正方形" value="Circle2"></el-option> -->
      <el-option label="矩形" value="Box"></el-option>
      <el-option label="多边形" value="Polygon"></el-option>
    </el-select>
    <!-- <div class="overlay" ref="overlay">
      <div class="overlay-head">
        <span>此弹窗可拖动</span
        ><img
          src="@/assets/map/tc-close@2x.png"
          @click="closeDrawList"
          alt=""
        />
      </div>
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane border :label="'目标(' + mubiaoTotal + ')'" name="first">
          <el-table
            :data="tableData1"
            size="mini"
            style="width: 100%"
            @sort-change="sortChange1"
            @sort="sort1"
          >
            <el-table-column
              prop="longitude"
              sortable
              align="center"
              label="经度"
            >
            </el-table-column>
            <el-table-column
              prop="latitude"
              sortable
              align="center"
              label="纬度"
            >
            </el-table-column>
            <el-table-column
              prop="timestamp"
              sortable
              align="center"
              label="时间"
            >
              <template slot-scope="scope">
                {{ scope.row.timestamp | formatDate1 }}
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            small
            layout="prev, pager, next"
            @current-change="mubiaoChange"
            :total="mubiaoTotal"
            :current-page.sync="currentPage1"
          >
          </el-pagination>
        </el-tab-pane>
        <el-tab-pane border :label="'阵地(' + zhendiTotal + ')'" name="second">
          <el-table :data="tableData2" size="mini" style="width: 100%">
            <el-table-column
              prop="longitude"
              sortable
              align="center"
              label="经度"
            >
            </el-table-column>
            <el-table-column
              prop="latitude"
              sortable
              align="center"
              label="纬度"
            >
            </el-table-column>
            <el-table-column prop="name" sortable align="center" label="名字">
            </el-table-column>
          </el-table>
          <el-pagination
            small
            layout="prev, pager, next"
            @current-change="zhendiChange"
            :current-page.sync="currentPage2"
            :total="zhendiTotal"
          >
          </el-pagination>
        </el-tab-pane>
      </el-tabs>
    </div> -->
  </div>
</template>
<script>
function dragFunc(ref, el) {
  var Drag = el.$refs[ref];
  Drag.style.left = "";
  Drag.style.top = "";
  Drag.onmousedown = function (event) {
    var ev = event || window.event;
    event.stopPropagation();
    var disX = ev.clientX - Drag.offsetLeft;
    var disY = ev.clientY - Drag.offsetTop;
    document.onmousemove = function (event) {
      var ev = event || window.event;
      Drag.style.left = ev.clientX - disX + "px";
      Drag.style.top = ev.clientY - disY + "px";
      Drag.style.cursor = "move";
    };
  };
  Drag.onmouseup = function () {
    document.onmousemove = null;
    this.style.cursor = "default";
  };
}
/* eslint-disable */
import "ol/ol.css";
import sourceVector from "ol/source/Vector";
import layerVector from "ol/layer/Vector";
import styleStyle from "ol/style/Style";
import styleFill from "ol/style/Fill";
import styleStroke from "ol/style/Stroke";
import styleText from "ol/style/Text";
import styleIcon from "ol/style/Icon";
import styleCircle from "ol/style/Circle";
import olSize from "ol/size";
import projTransforms from "ol/proj/transforms";
import geomPolygon from "ol/geom/Polygon";
import geomLineString from "ol/geom/LineString";
import geomGeometryType from "ol/geom/GeometryType";
import Overlay from "ol/Overlay";
import olSphere from "ol/sphere";
import interactionDraw from "ol/interaction/Draw";
import Observable from "ol/Observable";
import olFeature from "ol/Feature";
import geomPoint from "ol/geom/Point";
// http://192.168.0.5:7001/doc.html#/home
function color16() {
  //十六进制颜色随机
  var r = Math.floor(Math.random() * 256);
  var g = Math.floor(Math.random() * 256);
  var b = Math.floor(Math.random() * 256);
  var color = "#" + r.toString(16) + g.toString(16) + b.toString(16);
  return color;
}
let srcVector = new sourceVector();
let vector = null;
export default {
  props: {
    map: {
      default: null,
    },
  },
  data() {
    return {
      draw: "",
      featureList: [],
      geoStr: null,
      drawValue: "",
      currentFeature: null,
      activeName: "first",
      mb_info: [],
      mb_position: [],
      table1: [],
      table2: [],
      pageSize: 10,
      mubiaoTotal: 0,
      zhendiTotal: 0,
      currentPage1: 0,
      currentPage2: 0,
    };
  },
  computed: {
    //计算当前搜索结果表里的数据
    tableData1() {
      // 计算当前页的数据
      var da = this.table1.slice(
        (this.currentPage1 - 1) * this.pageSize,
        this.currentPage1 * this.pageSize
      );
      // console.log(da);
      return da;
    },
    tableData2() {
      // 计算当前页的数据
      var da = this.table2.slice(
        (this.currentPage2 - 1) * this.pageSize,
        this.currentPage2 * this.pageSize
      );
      // console.log(da);
      return da;
    },
  },
  watch: {
    map: {
      handler(o, n) {
        // console.log(o, n);
        if (o && !n) {
          vector = new layerVector({
            source: srcVector,
            style: new styleStyle({
              //图层样式
              fill: new styleFill({
                color: "rgba(255, 255, 255, 0.2)", //填充颜色
              }),
              stroke: new styleStroke({
                color: "#ffcc33", //边框颜色
                width: 1, // 边框宽度
              }),
              image: new styleCircle({
                radius: 5,
                fill: new styleFill({
                  color: "#ffcc33",
                }),
              }),
            }),
          });
          this.map.addLayer(vector);
          // this.requestPointData();
        }
      },
    },
  },
  filters: {
    dateFormat1: function (d) {
      // console.log(d);
      let date = new Date(d);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const hour = date.getHours();
      const minute = date.getMinutes();
      const second = date.getSeconds();
      return;
    },
    formatDate1(cellValue) {
      if (cellValue == null || cellValue === "") return "";
      var date = new Date(cellValue);
      var year = date.getFullYear();
      var month =
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1;
      var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      var hours =
        date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
      var minutes =
        date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      var seconds =
        date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      return (
        year +
        "-" +
        month +
        "-" +
        day +
        " " +
        hours +
        ":" +
        minutes +
        ":" +
        seconds
      );
    },
  },
  methods: {
    sort1(a) {
      // console.log(a);
    },
    sortChange1(a) {
      // console.log(a);
    },
    closeDrawList() {
      this.addInteraction();
    },
    handleClick(tab, event) {
      // console.log(tab, event);
    },
    mubiaoChange() {},
    zhendiChange() {},
    requestPointData() {
      this.$api.getAllPoint().then((res) => {
        // console.log(res);
        this.mb_info = res.data.mb_info;
        for (let index = this.mb_info.length - 1; index >= 0; index--) {
          this.addVectorLabel([
            this.mb_info[index].longitude,
            this.mb_info[index].latitude,
          ]);
        }
      });
      this.$api.getAllPossy().then((res) => {
        // console.log(res);
        let color = color16();
        this.mb_position = res.data.mb_position;
        for (let index = this.mb_position.length - 1; index >= 0; index--) {
          this.addVectorLabel1([
            this.mb_position[index].longitude,
            this.mb_position[index].latitude,
            color,
          ]);
        }
      });
    },
    getPointToList(geo) {
      let arr1 = new Array(),
        arr2 = new Array();
      for (let index = this.mb_info.length - 1; index >= 0; index--) {
        if (
          geo.intersectsCoordinate([
            this.mb_info[index].longitude,
            this.mb_info[index].latitude,
          ])
        ) {
          arr1.push(this.mb_info[index]);
        }
      }
      for (let index = this.mb_position.length - 1; index >= 0; index--) {
        if (
          geo.intersectsCoordinate([
            this.mb_position[index].longitude,
            this.mb_position[index].latitude,
          ])
        ) {
          arr2.push(this.mb_position[index]);
        }
      }
      this.table1 = arr1;
      this.table2 = arr2;
      this.mubiaoTotal = this.table1.length;
      this.zhendiTotal = this.table2.length;
      // this.showTable();
    },
    showTable() {
      this.$refs.overlay.style.display = "block";
      dragFunc("overlay", this);
      this.map.removeInteraction(this.draw); //移除绘制图形
    },
    drawEndCallBack(evt) {
      this.currentFeature = evt.feature; //当前绘制的要素
      this.featureList.push(this.currentFeature);
      // console.log(this.currentFeature);
      var geo = this.currentFeature.getGeometry(); //获取要素的几何信息

      this.getPointToList(geo);
    },
    addVectorLabel1(coordinate, color) {
      // console.log(coordinate);
      var newFeature = new olFeature({
        geometry: new geomPoint(coordinate), //几何信息
      });
      newFeature.setStyle(this.createLabelStyle(color));
      vector.getSource().addFeature(newFeature); //将新要素添加到数据源中
    },
    addVectorLabel(coordinate) {
      var newFeature = new olFeature({
        geometry: new geomPoint(coordinate), //几何信息
      });
      vector.getSource().addFeature(newFeature); //将新要素添加到数据源中
    },
    createLabelStyle(color) {
      let fill = new styleFill({ color: color });
      let stroke = new styleStroke({ color: color, width: 2 });
      return new styleStyle({
        image: new styleCircle({
          fill: fill,
          stroke: stroke,
          radius: 5,
        }),
        fill: fill, //文本填充样式（即文字颜色）
        stroke: stroke,
      });
    },
    selectChange(e) {
      this.$emit("clearMesure");
      this.map.removeInteraction(this.draw); //移除绘制图形
      this.addInteraction();
    },
    selectNone() {
      this.drawValue = "None1";
      this.map.removeInteraction(this.draw); //移除绘制图形
      this.addInteraction();
      this.drawValue = "";
    },
    addInteraction() {
      if (vector) {
        for (let i = this.featureList.length - 1; i >= 0; i--) {
          vector.getSource().removeFeature(this.featureList[i]);
        }
        this.featureList = [];
      }
      // this.$refs.overlay.style.display = "none";
      if (this.drawValue !== "None1") {
        let geomType = this.drawValue;
        let geometryFunction;
        let maxPoints;
        if (this.drawValue === "Box") {
          geomType = "LineString";
          // debugger;
          maxPoints = 2;
          geometryFunction = function (coordinates, geometry) {
            var start = coordinates[0];
            var end = coordinates[1];
            if (!geometry) {
              geometry = new geomPolygon([
                [start, [start[0], end[1]], end, [end[0], start[1]], start],
              ]);
            }
            geometry.setCoordinates([
              [start, [start[0], end[1]], end, [end[0], start[1]], start],
            ]);
            return geometry;
          };
        }
        this.draw = new interactionDraw({
          source: vector.getSource(), //绘制层数据源
          type: geomType, //几何图形类型
          geometryFunction: geometryFunction, //几何信息变更时调用函数
          maxPoints: maxPoints, //最大点数
        });
        this.map.addInteraction(this.draw);
        this.draw.on("drawend", this.drawEndCallBack, this);
      } else {
        this.map.removeInteraction(this.draw); //移除绘制图形
      }
    },
  },
};
</script>
<style type="text/css" scoped>
.draw-select {
  position: absolute;
  top: -1.2rem;
  width: 8.5rem;
  right: -0.1rem;
}
</style>
<style lang="scss">
.draw-select {
  .overlay {
    position: absolute;
    width: 100%;
    display: none;
    padding-top: 0.3rem;
    z-index: 9999;
    background: rgba(18, 22, 73, 0.8);
    border: 1px solid rgba(61, 71, 201, 0.5);
  }
  .el-select {
    position: absolute;
    top: 1.5rem;
    right: 0.2rem;
    width: 1.4rem;
    background: url(data:image/png;base64,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)
      repeat-x 0 0;
    background-color: #133264;
    background-size: contain;
    border: 0.01rem solid #2c74e2;
  }
  .el-input__inner {
    padding-left: 8px;
    background-color: rgba(0, 0, 0, 0);
    border: none;
    color: #00ffff;
  }
  .el-input__inner::placeholder {
    color: #00ffff;
  }
  .el-select-dropdown__item {
    color: #00ffff;
  }
  .el-popper[x-placement^="bottom"] .popper__arrow::after {
    background-color: #133264;
  }
  .el-select-dropdown {
    background-color: #133264;
    border: none;
  }
  .overlay-head {
    top: 0;
    position: absolute;
    width: 100%;
    span {
      color: #409eff;
    }
    img {
      height: 0.25rem;
      width: 0.25rem;
      position: absolute;
      right: 0.15rem;
      top: 0.15rem;
    }
  }
  .el-input--mini .el-input__inner {
    height: 20px;
    line-height: 20px;
  }
  .el-select .el-input .el-select__caret {
    color: #00ffff;
    font-size: none;
  }
  .el-input--mini .el-input__icon {
    line-height: 20px;
  }
  .el-pagination {
    color: #aaa;
  }
  .el-select-dropdown {
    border: 1px solid rgba(18, 22, 72, 0.8);
    background-color: rgba(18, 22, 72, 0.8);
    box-shadow: 0 2px 12px 0 rgba(18, 22, 72, 0.8);
  }
  .el-select-dropdown__item.hover,
  .el-select-dropdown__item:hover {
    background-color: rgba(9, 11, 36, 0.9);
  }
  .el-table {
    color: #eee;
  }
  .el-table th,
  .el-table tr {
    background-color: rgba(18, 22, 73, 0.5);
  }
  .el-table td,
  .el-table th.is-leaf {
    border-bottom: 1px solid rgba(18, 22, 73, 0.5);
  }
  .el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
    border-bottom-color: rgba(18, 22, 73, 0);
  }
  .el-table--enable-row-hover .el-table__body tr:hover > td {
    background-color: rgba(18, 22, 73, 1);
  }
  .el-table,
  .el-table__expanded-cell {
    background-color: rgba(18, 22, 73, 0.5);
  }
  .el-tabs__item {
    color: #999;
  }
  .el-table--border::after,
  .el-table--group::after,
  .el-table::before {
    background-color: rgba(18, 22, 73, 0.5);
  }
  .el-tabs--card > .el-tabs__header {
    border-bottom: 1px solid rgba(61, 71, 201, 0.5);
  }
  .el-dialog,
  .el-pager li {
    background: rgba(61, 71, 201, 0.5);
  }
  .el-pagination button {
    background-color: rgba(18, 22, 73, 0.5);
  }
  .el-tabs--card > .el-tabs__header .el-tabs__nav {
    border: 1px solid rgba(61, 71, 201, 0.5);
  }
  .el-tabs--card > .el-tabs__header .el-tabs__item {
    border-left: 1px solid rgba(61, 71, 201, 0.5);
  }
  .el-pagination button:disabled {
    color: #555;
  }
  .el-tabs__item.is-active {
    color: #409eff;
  }
  .el-pagination .btn-next,
  .el-pagination .btn-prev {
    color: #409eff;
  }
  .el-input__suffix {
    right: 0;
  }
}
</style>
