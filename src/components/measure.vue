<template>
  <div class="measure-select">
    <el-select
      size="mini"
      v-model="measureType"
      @change="selectChange"
      placeholder="测量"
      ><el-option label="清空" value="None1"></el-option>
      <el-option label="距离" value="length"></el-option>
      <el-option label="面积" value="area"></el-option>
    </el-select>
  </div>
</template>
<script>
/* eslint-disable */
import "ol/ol.css";
import sourceVector from "ol/source/Vector";
import layerVector from "ol/layer/Vector";
import styleStyle from "ol/style/Style";
import styleFill from "ol/style/Fill";
import styleStroke from "ol/style/Stroke";
import styleCircle from "ol/style/Circle";
import projTransforms from "ol/proj/transforms";
import geomPolygon from "ol/geom/Polygon";
import geomLineString from "ol/geom/LineString";
import Overlay from "ol/Overlay";
import { getArea, getLength } from "ol/sphere";
import interactionDraw from "ol/interaction/Draw";
import { unByKey } from "ol/Observable";
var sketch;
var continuePolygonMsg = "鼠标单击继续画多边形";
var continueLineMsg = "鼠标左击继续划线";
export default {
  props: {
    map: {
      default: null,
    },
  },
  data() {
    return {
      helpTooltipElement: undefined,
      helpTooltip: undefined,
      measureTooltipElement: undefined,
      measureTooltip: undefined,
      draw: undefined,
      vector: null,
      measureType: "",
      source: null,
      typeSelect: "",
      type: {
        None1: "None1",
        length: "LineString",
        area: "Polygon",
      },
    };
  },
  created() {
    this.source = new sourceVector(); //图层数据源
  },
  methods: {
    pointerMoveHandler(evt) {
      if (evt.dragging) {
        return;
      }
      var helpMsg = "点击鼠标，开始划线，双击结束"; //当前默认提示信息
      //判断绘制几何类型设置相应的帮助提示信息
      if (sketch) {
        var geom = sketch.getGeometry();
        if (geom instanceof geomPolygon) {
          helpMsg = continuePolygonMsg; //绘制多边形时提示相应内容
        } else if (geom instanceof geomLineString) {
          helpMsg = continueLineMsg; //绘制线时提示相应内容
        }
      }
      this.helpTooltipElement.innerHTML = helpMsg; //将提示信息设置到对话框中显示
      this.helpTooltip.setPosition(evt.coordinate); //设置帮助提示框的位置
      this.helpTooltipElement.classList.remove("hidden"); //移除帮助提示框的隐藏样式进行显示
    },
    selectChange() {
      this.$emit("clearDrawing");
      this.map.removeInteraction(this.draw); //移除绘制图形
      this.addInteraction(); //添加绘图进行测量
    },
    selectNone() {
      this.measureType = "None1";
      this.map.removeInteraction(this.draw); //移除绘制图形
      this.addInteraction(); //添加绘图进行测量
      this.measureType = "";
    },
    addInteraction() {
      var type = this.type[this.measureType];
      console.log(this.measureType, type);
      if (this.measureType !== "None1") {
        // vector.getSource().removeFeature(currentFeature);
        this.vector = new layerVector({
          source: this.source,
          style: new styleStyle({
            //图层样式
            fill: new styleFill({
              color: "rgba(255, 255, 255, 0.2)", //填充颜色
            }),
            stroke: new styleStroke({
              color: "#ffcc33", //边框颜色
              width: 2, // 边框宽度
            }),
            image: new styleCircle({
              radius: 7,
              fill: new styleFill({
                color: "#ffcc33",
              }),
            }),
          }),
        });
        this.map.addLayer(this.vector);
        this.draw = new interactionDraw({
          source: this.source, //测量绘制层数据源
          type: /** @type {ol.geom.GeometryType} */ (type), //几何图形类型
          style: new styleStyle({
            //绘制几何图形的样式
            fill: new styleFill({
              color: "rgba(255, 255, 255, 0.2)",
            }),
            stroke: new styleStroke({
              color: "rgba(0, 0, 0, 0.5)",
              lineDash: [10, 10],
              width: 2,
            }),
            image: new styleCircle({
              radius: 5,
              stroke: new styleStroke({
                color: "rgba(0, 0, 0, 0.7)",
              }),
              fill: new styleFill({
                color: "rgba(255, 255, 255, 0.2)",
              }),
            }),
          }),
        });
        this.map.addInteraction(this.draw);

        this.map.on("pointermove", this.pointerMoveHandler);
        this.map.getViewport().addEventListener("mouseout", () => {
          this.helpTooltipElement.classList.add("hidden");
        });
        this.createMeasureTooltip(); //创建测量工具提示框
        this.createHelpTooltip(); //创建帮助提示框

        var listener;
        //绑定交互绘制工具开始绘制的事件
        this.draw.on("drawstart", (evt) => {
          // set this.sketch
          sketch = evt.feature; //绘制的要素

          var tooltipCoord = evt.coordinate; // 绘制的坐标
          //绑定change事件，根据绘制几何类型得到测量长度值或面积值，并将其设置到测量工具提示框中显示

          listener = sketch.getGeometry().on(
            "change",
            (evt) => {
              var geom = evt.target; //绘制几何要素
              var output;

              if (geom instanceof geomPolygon) {
                output = this.formatArea(geom); //面积值
                tooltipCoord = geom.getInteriorPoint().getCoordinates(); //坐标
              } else if (geom instanceof geomLineString) {
                output = this.formatLength(geom); //长度值
                tooltipCoord = geom.getLastCoordinate(); //坐标
              }
              this.measureTooltipElement.innerHTML = output; //将测量值设置到测量工具提示框中显示
              this.measureTooltip.setPosition(tooltipCoord); //设置测量工具提示框的显示位置
            },
            this
          );
        });
        //绑定交互绘制工具结束绘制的事件
        this.draw.on(
          "drawend",
          (evt) => {
            this.measureTooltipElement.classList.add("tooltip1");
            this.measureTooltipElement.classList.add("tooltip1-static");
            this.measureTooltip.setOffset([0, -7]);
            sketch = null; //置空当前绘制的要素对象
            this.measureTooltipElement = null; //置空测量工具提示框对象
            this.createMeasureTooltip(); //重新创建一个测试工具提示框显示结果
            unByKey(listener);
          },
          this
        );
      } else {
        this.clear();
      }
    },
    clear() {
      if (this.vector) {
        this.vector.getSource().clear();
      }
      this.map.removeInteraction(this.draw); //移除绘制图形
      this.map.removeLayer(this.vector);
      this.map.removeOverlay(this.helpTooltip);
      let measureEleList = document.getElementsByClassName("tooltip1-static");
      let length = measureEleList.length;
      for (let i = length - 1; i >= 0; i--) {
        measureEleList[i].parentNode.removeChild(measureEleList[i]);
      }
    },
    createMeasureTooltip() {
      if (this.measureTooltipElement) {
        this.measureTooltipElement.parentNode.removeChild(
          this.measureTooltipElement
        );
      }
      this.measureTooltipElement = document.createElement("div");
      this.measureTooltipElement.classList.add("tooltip1");
      this.measureTooltipElement.classList.add("tooltip1-measure");
      this.measureTooltip = new Overlay({
        element: this.measureTooltipElement,
        offset: [0, -15],
        positioning: "bottom-center",
      });
      this.map.addOverlay(this.measureTooltip);
    },
    createHelpTooltip() {
      if (this.helpTooltipElement) {
        this.helpTooltipElement.parentNode.removeChild(this.helpTooltipElement);
      }
      this.helpTooltipElement = document.createElement("div");
      this.helpTooltipElement.classList.add("tooltip1");
      this.helpTooltipElement.classList.add("hidden");
      console.log(this.helpTooltipElement);
      this.helpTooltip = new Overlay({
        element: this.helpTooltipElement,
        offset: [15, 0],
        positioning: "center-left",
      });
      this.map.addOverlay(this.helpTooltip);
    },
    formatArea(polygon) {
      var area;
      //若使用测地学方法测量
      var sourceProj = this.map.getView().getProjection(); //地图数据源投影坐标系
      area = getArea(polygon, { projection: sourceProj });
      // area = polygon.getArea(); //直接获取多边形的面积
      var output;
      if (area > 10000) {
        output =
          Math.round((area / 1000000) * 100) / 100 + " " + "km<sup>2</sup>"; //换算成KM单位
      } else {
        output = Math.round(area * 100) / 100 + " " + "m<sup>2</sup>"; //m为单位
      }
      return output; //返回多边形的面积
    },
    formatLength(line) {
      var length;
      var coordinates = line.getCoordinates(); //解析线的坐标
      length = 0;
      var sourceProj = this.map.getView().getProjection(); //地图数据源投影坐标系
      length = getLength(line, { projection: sourceProj });
      var output;
      if (length > 100) {
        output = Math.round((length / 1000) * 100) / 100 + " " + "km"; //换算成KM单位
      } else {
        output = Math.round(length * 100) / 100 + " " + "m"; //m为单位
      }
      return output; //返回线的长度
    },
  },
};
</script>
<style type="text/css" scoped>
.measure-select {
  position: absolute;
  top: 0.7rem;
  width: 8.5rem;
  right: -0.1rem;
}
</style>
<style lang="scss">
.tooltip1 {
  position: relative;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 4px;
  color: white;
  padding: 4px 8px;
  opacity: 0.7;
  white-space: nowrap;
}
.tooltip1-measure {
  font-weight: 300;
}
.tooltip1-static {
  background-color: #ffcc33;
  color: black;
  border: 1px solid white;
}
.tooltip1-measure:before,
.tooltip1-static:before {
  border-top: 6px solid rgba(0, 0, 0, 0.5);
  border-right: 6px solid transparent;
  border-left: 6px solid transparent;
  content: "";
  position: absolute;
  bottom: -6px;
  margin-left: -7px;
  left: 50%;
}
.tooltip1-static:before {
  border-top-color: #ffcc33;
}
.measure-select {
  .el-select {
    z-index: 10;
    position: absolute;
    width: 1.4rem;
    right: 0.2rem;
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
  .el-input__suffix {
    right: 0;
  }
}
</style>
