<template>
  <div class="container">
    <!-- <el-button @click="setPlaneCoodinate">切</el-button> -->
    <!-- <el-button @click="arr = []">清空</el-button> -->
    <div id="Map" ref="map"></div>
    <!-- <div class="mesure-wrap" style="position: absolute; right: 10px; top: 10px"> -->
    <DrawingGraph ref="drawing" :map="mapInstance" @clearMesure="clrMesure" />
    <Measure ref="measure" :map="mapInstance" @clearDrawing="clrDrawing" />
    <!-- </div> -->
    <el-slider
      v-model="sliderValue"
      :format-tooltip="formatTooltip"
      @change="sliderChange"
    ></el-slider>
    <div class="btn-wrap">
      <div class="btn">
        <p @click="isShowFn(0, true)">框1显</p>
        <p @click="isShowFn(0, false)">框1隐</p>
      </div>
      <div class="btn">
        <p @click="isShowFn(1, true)">框2显</p>
        <p @click="isShowFn(1, false)">框2隐</p>
      </div>
      <div class="btn">
        <p @click="isShowFn(2, true)">框3显</p>
        <p @click="isShowFn(2, false)">框3隐</p>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import "ol/ol.css";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import XYZ from "ol/source/XYZ";
import { Map, View, Feature } from "ol";
import { Style, Stroke, Fill } from "ol/style";
import { Polygon, MultiPolygon } from "ol/geom";
import EChartsLayer from "ol-echarts";
import china from "@/utils/china.json";
import { ScaleLine, defaults as defaultControls } from "ol/control";
// 取消默认事件 解决事件冲突
EChartsLayer.prototype.onClick = function() {};
EChartsLayer.prototype.mouseDown = function() {};
EChartsLayer.prototype.mouseUp = function() {};
EChartsLayer.prototype.mouseMove = function() {};
import DrawingGraph from "@/components/drawing";
import Measure from "@/components/measure";
import { greenPlane, SD } from "@/utils/base64.js";
import tooltipSD from "@/utils/tooltip.js";
import circleCoodinate from "@/utils/circleCoodinate.js";
function color16() {
  //十六进制颜色随机
  var r = Math.floor(Math.random() * 256);
  var g = Math.floor(Math.random() * 256);
  var b = Math.floor(Math.random() * 256);
  let color = `rgba(${r},${g},${b},0.3)`;
  return color;
}
export default {
  components: {
    DrawingGraph,
    Measure,
  },
  data() {
    return {
      arr: [],
      sliderValue: 0,
      mapInstance: null,
      echartslayer: null,
      echartslayer2: null,
      routeFeature: null,
      centerCoodinate: [110, 32],
      timeLine: [
        "2021/1/1",
        "2021/1/2",
        "2021/1/3",
        "2021/1/4",
        "2021/1/5",
        "2021/1/6",
        "2021/1/7",
      ],
      nowTime: "",
      // 航线数据
      coordinatesData: [
        {
          id: "航迹1",
          value: [
            [105.5, 5.6],
            [108.20016254609003, 7.7453789320369815],
            [110.22164458475626, 9.873254762211971],
            [111.85301605455709, 12.46217035559154],
            [112.63323719228792, 14.554581588596946],
            [113.05881235832291, 17.604536945181096],
            [113.23613534417083, 20.157987941391085],
          ],
          planeValue: [
            [105.5, 5.6],
            [108.20016254609003, 7.7453789320369815],
            [110.22164458475626, 9.873254762211971],
            [111.85301605455709, 12.46217035559154],
            [112.63323719228792, 14.554581588596946],
            [113.05881235832291, 17.604536945181096],
            [113.23613534417083, 20.157987941391085],
          ],
          timeLineData: [
            "2021/1/1",
            "2021/1/2",
            "2021/1/3",
            "2021/1/4",
            "2021/1/5",
            "2021/1/6",
            "2021/1/7",
          ],
          // 图标点
          pointPos: [
            [105.5, 5.6],
            [108.20016254609003, 7.7453789320369815],
            [110.22164458475626, 9.873254762211971],
            [111.85301605455709, 12.46217035559154],
            [112.63323719228792, 14.554581588596946],
            [113.05881235832291, 17.604536945181096],
            [113.23613534417083, 20.157987941391085],
          ],
        },
        {
          id: "航迹2",
          value: [
            [107.72751138342944, 3.3205310562426575],
            [107.703764995049, 5.552813785572937],
            [108.01730967139864, 9.040755550151502],
            [117.2844718183747, 12.563576732375852],
            [117.59838657718677, 16.295674420474914],
            [119.44699571241341, 19.748736767407692],
            [123.24885223580405, 20.760239879135476],
          ].concat(circleCoodinate),
          planeValue: [
            [107.72751138342944, 3.3205310562426575],
            [107.703764995049, 5.552813785572937],
            [108.01730967139864, 9.040755550151502],
            [117.2844718183747, 12.563576732375852],
            [117.59838657718677, 16.295674420474914],
            [119.44699571241341, 19.748736767407692],
            [123.24885223580405, 20.760239879135476],
          ].concat(circleCoodinate),
          timeLineData: [
            "2021/1/1",
            "2021/1/2",
            "2021/1/3",
            "2021/1/4",
            "2021/1/5",
            "2021/1/6",
            "2021/1/7",
          ],
          pointPos: [
            [107.72751138342944, 3.3205310562426575],
            [107.703764995049, 5.552813785572937],
            [108.01730967139864, 9.040755550151502],
            [117.2844718183747, 12.563576732375852],
            [117.59838657718677, 16.295674420474914],
            [119.44699571241341, 19.748736767407692],
            [123.24885223580405, 20.760239879135476],
          ],
        },
      ],
      JAVAPosArr: [
        {
          pos: [
            [121, 28],
            [117, 32],
            [111, 40],
            [108, 34],
            [108, 30],
          ],
          UID: "kuang1",
          centerPos: [113, 33],
        },
        {
          pos: [
            [90, 60],
            [85, 50],
            [60, 60],
          ],
          UID: "kuang2",
          centerPos: [78, 57],
        },
        {
          pos: [
            [80, 60],
            [70, 30],
            [90, 50],
          ],
          UID: "kuang3",
          centerPos: [80, 46],
        },
      ],
      JAVASeries: [],
    };
  },
  mounted() {
    this.initMapAndChart();
    this.addArea(china);
    this.setChart(this.coordinatesData);
    this.foreachJAVAPosFn(this.JAVAPosArr);
  },
  methods: {
    sliderChange(val) {
      let data = JSON.parse(JSON.stringify(this.coordinatesData));
      data.forEach((item) => {
        let i = item.timeLineData.indexOf(this.nowTime);
        console.log(111, i, this.nowTime);
        // 最后一个刻度判断,必须满足至少有两个点
        if (i == item.timeLineData.length - 1) {
          item.planeValue.splice(
            item.planeValue.length - 2,
            item.planeValue.length - 1
          );
        } else {
          item.planeValue.splice(0, i);
        }
        // let arr = item.planeValue.filter((key, index) => {
        //   if (index == item.planeValue.length - 1) {
        //     console.log(111);
        //     return index >= i - 1;
        //   } else {
        //     return index >= i;
        //   }
        // });
        // item.planeValue = arr;
      });
      console.log(222, data);
      this.setChart(data);
    },
    formatTooltip(val) {
      // alert(val);
      let all = 100 / (this.timeLine.length - 1);
      let floor = Math.floor(val / all);
      console.log(22, floor);
      this.nowTime = this.timeLine[floor];
      if (val == 100) {
        return this.timeLine[this.timeLine.length - 1];
      } else {
        return this.timeLine[floor];
      }
    },
    setChart(coordinatesData) {
      this.echartslayer.clear();
      let series = [];
      coordinatesData.forEach((itemData) => {
        //  数据整合  提取地理坐标
        let scatterData = itemData.pointPos.map((item, index) => {
          return {
            name: "scatterData" + itemData.id + index,
            value: item,
          };
        });
        // console.log(888, JSON.stringify(scatterData));
        let lineData = [
          {
            name: itemData.id,
            coords: itemData.value,
          },
        ];
        let planeLineData = [
          {
            name: itemData.id,
            coords: itemData.planeValue,
          },
        ];
        series.push(
          {
            name: "billboard" + itemData.id,
            type: "scatter",
            coordinateSystem: "geo",
            showEffectOn: "render",
            zlevel: 2,
            hoverAnimation: true,
            symbolSize: 20,
            tooltip: tooltipSD,
            symbol: SD,
            symbolOffset: ["0%", "-50%"],
            data: scatterData,
          },
          // {
          //   name: "effectScatter" + itemData.id,
          //   type: "effectScatter",
          //   coordinateSystem: "geo",
          //   showEffectOn: "render",
          //   zlevel: 10,
          //   rippleEffect: {
          //     period: 15,
          //     scale: 4,
          //     brushType: "stroke",
          //   },
          //   // hoverAnimation: true,
          //   itemStyle: {
          //     normal: {
          //       color: "#00ff78",
          //       shadowBlur: 10,
          //       shadowColor: "#333",
          //     },
          //   },
          //   // symbolSize: (val) => {
          //   //   return val[2] / 2;
          //   // },
          //   // symbolSize: 10,
          //   tooltip: {
          //     show: false,
          //     formatter: function (params) {
          //       return "实时流量  125kb/s";
          //     },
          //   },
          //   label: {
          //     normal: {
          //       show: true,
          //       formatter: "{b}",
          //       position: ["-20%", "200%"],
          //       color: "#5cdbc6",
          //     },
          //     emphasis: {
          //       color: "white",
          //     },
          //   },
          //   data: scatterData,
          // },
          // 航迹线
          {
            name: "lines" + itemData.id,
            type: "lines",
            coordinateSystem: "geo",
            zlevel: 1,
            effect: {
              show: false,
              period: 4,
              trailLength: 0.4,
              symbol: "arrow",
              symbolSize: 7,
            },
            lineStyle: {
              normal: {
                width: 2,
                color: "#fd6e3a",
                opacity: 1,
                curveness: 0.3,
              },
            },
            tooltip: {
              show: true,
              triggle: "item",
              // position: "inside",
              formatter: function(params) {
                return "实时流量  125kb/s";
              },
            },
            polyline: true,
            data: lineData,
          }
        );
        // 航迹飞机
        let PlaneLines = {
          name: "PlaneLines" + itemData.id,
          type: "lines",
          coordinateSystem: "geo",
          zlevel: 10,
          effect: {
            show: true,
            period: 4,
            constantSpeed: 30, // 改为固定速度
            trailLength: 0.4,
            symbol: greenPlane,
            symbolSize: 30,
          },
          lineStyle: {
            normal: {
              color: "#fd6e3a",
              opacity: 0,
              curveness: 0.3,
            },
          },
          tooltip: {
            show: false,
          },
          polyline: true,
          data: planeLineData,
        };
        series.push(PlaneLines);
      });

      // console.log(999, series);
      this.echartslayer.setChartOptions(
        {
          background: "transparent",
          tooltip: {
            trigger: "item",
            triggerOn: "click",
          },
          series: series,
          geo: {},
        },
        true
      );
    },
    initMapAndChart() {
      //   var mousePositionControl = new MousePosition({
      //     coordinateFormat: createStringXY(4)
      //     projection: "EPSG:4326",
      //     // comment the following two lines to have the mouse position
      //     // be placed within the map.
      //     className: "custom-mouse-position",
      //     target: document.getElementById("mouse-position"),
      //     undefinedHTML: "&nbsp;",
      //   });
      this.mapInstance = new Map({
        controls: defaultControls().extend([
          //   mousePositionControl,
          new ScaleLine(),
        ]),
        target: this.$refs.map,
        layers: [
          new TileLayer({
            source: new XYZ({
              // url:
              //   "http://cache1.arcgisonline.cn/arcgis/rest/services/ChinaOnline" +
              //   "StreetPurplishBlue/MapServer/tile/{z}/{y}/{x}",
              url: "./satellite/{z}/{x}/{y}.jpg",
            }),
          }),
        ],
        loadTilesWhileAnimating: true,
        view: new View({
          projection: "EPSG:4326",
          center: this.centerCoodinate,
          zoom: 4,
        }),
      });
      let option = {
        background: "transparent",
        tooltip: {},
        series: [],
        geo: {
          roam: true,
        },
      };
      this.echartslayer = new EChartsLayer(option, {
        hideOnMoving: true,
        hideOnZooming: true,
      });
      this.echartslayer2 = new EChartsLayer(option, {
        hideOnMoving: true,
        hideOnZooming: true,
      });
      this.echartslayer.appendTo(this.mapInstance);
      this.echartslayer2.appendTo(this.mapInstance);
      // 获取鼠标点击坐标
      // this.mapInstance.on("singleclick", (e) => {
      //   this.arr.push(e.coordinate);
      //   console.log(JSON.stringify(this.arr));
      // });
    },
    // 动态设置飞机坐标数据
    // setPlaneCoodinate() {
    //   let series = this.series;
    //   // console.log(111, this.series);
    //   // this.series = this.series.filter(
    //   //   (item) => ["PlaneLines"].indexOf(item.name) < 0
    //   // );
    //   series.pop();
    //   let data = [
    //     {
    //       name: this.coordinate1.id,
    //       coords: [
    //         // [105.57578235554087, 5.617503101861992],
    //         // [108.20016254609003, 7.7453789320369815],
    //         // [110.22164458475626, 9.873254762211971],
    //         // [111.85301605455709, 12.46217035559154],
    //         [112.63323719228792, 14.554581588596946],
    //         [113.05881235832291, 17.604536945181096],
    //         [113.23613534417083, 20.157987941391085],
    //       ],
    //     },
    //   ];
    //   // 航迹飞机
    //   let PlaneLines = {
    //     name: "PlaneLines",
    //     type: "lines",
    //     coordinateSystem: "geo",
    //     zlevel: 1,
    //     effect: {
    //       show: true,
    //       period: 4,
    //       constantSpeed: 30, // 改为固定速度
    //       trailLength: 0.4,
    //       symbol: greenPlane,
    //       symbolSize: 30,
    //     },
    //     lineStyle: {
    //       normal: {
    //         color: "#fd6e3a",
    //         opacity: 1,
    //         curveness: 0.3,
    //       },
    //     },
    //     tooltip: {
    //       show: false,
    //     },
    //     polyline: true,
    //     data: data,
    //   };
    //   this.series.push(PlaneLines);
    //   // console.log(222, this.series);
    //   this.echartslayer.clear();
    //   this.echartslayer.setChartOptions(
    //     {
    //       background: "transparent",
    //       tooltip: {
    //         trigger: "item",
    //         triggerOn: "click",
    //       },
    //       series: series,
    //       geo: {},
    //     },
    //     true
    //   );
    // },
    // 设置区域
    addArea(china) {
      let features = [];
      china.features.forEach((g, i) => {
        // console.log(g);
        let lineData = g;
        let routeFeature = "";
        // console.log(lineData.geometry.type);
        if (lineData.geometry.type == "MultiPolygon") {
          routeFeature = new Feature({
            geometry: new MultiPolygon(lineData.geometry.coordinates),
          });
        } else if (lineData.geometry.type == "Polygon") {
          routeFeature = new Feature({
            geometry: new Polygon(lineData.geometry.coordinates),
          });
        }
        // let color = "blue";
        // defineData.forEach((item) => {
        //   if (lineData.properties.name == item.name) {
        //     color = item.itemStyle.color;
        //   }
        // });
        routeFeature.setStyle(
          new Style({
            fill: new Fill({
              color: "rgba(225,225,225,0)", //填充颜色
            }),
            stroke: new Stroke({
              width: 1, //边界宽度
              color: "#b0b5bc", //边界颜色
            }),
          })
        );
        features.push(routeFeature);
      });
      // 设置省份边界图层
      let routeLayer = new VectorLayer({
        source: new VectorSource({
          features: features,
        }),
      });
      //   设置中国地图阴影
      // let shadowLayer = new VectorLayer({
      //   source: new VectorSource({
      //     features: china_no_province,
      //   }),
      // });
      // 添加图层
      this.mapInstance.addLayer(routeLayer);
    },
    clrMesure() {
      this.$refs.measure.selectNone();
    },
    clrDrawing() {
      this.$refs.drawing.selectNone();
    },
    foreachJAVAPosFn(posArr) {
      posArr.forEach((item) => {
        this.addJAVAKuangFn(item);
      });
    },
    addJAVAKuangFn(positem) {
      let { pos, UID, centerPos } = positem;
      let polygon = new Polygon([pos]);
      let feature = new Feature(polygon);
      let color = color16();
      feature.setStyle(this.createLabelStyle(color));
      let vectorSource = new VectorSource();
      feature.UID = UID;
      vectorSource.addFeature(feature);
      let vectorLayer = new VectorLayer({
        source: vectorSource,
        style: null, //这里需要将style属性设置为空才能控制要素的样式
        name: "layer ",
        visible: true,
      });
      this.mapInstance.addLayer(vectorLayer);
      let itemseriesArr = this.echartslayer2.getChartOptions().series;
      itemseriesArr.push({
        name: "effectScatter",
        type: "effectScatter",
        UID,
        coordinateSystem: "geo",
        showEffectOn: "render",
        zlevel: 10,
        rippleEffect: {
          //圆点的涟漪设置
          period: 15,
          scale: 4,
          brushType: "stroke",
        },
        itemStyle: {
          //圆点设置
          normal: {
            color: "#00ff78",
            shadowBlur: 10,
            shadowColor: "#333",
          },
        },
        data: [centerPos],
      });
      this.echartslayer2.setChartOptions(
        {
          series: itemseriesArr,
        },
        true
      );
    },
    createLabelStyle(color) {
      let fill = new Fill({ color: color });
      let stroke = new Stroke({ color: "#000000", width: 2 });
      return new Style({
        fill: fill,
        stroke: stroke,
      });
    },
    isShowFn(index, flag) {
      let color = color16();
      let isShowArr = null;
      let { UID, centerPos } = this.JAVAPosArr[index];
      let flagCenterPos = flag ? [centerPos] : []; //series的显隐
      let flagFeature = flag ? this.createLabelStyle(color) : null; //ol中feature的显隐
      // ol图层筛选
      this.mapInstance.getLayers().forEach((layer) => {
        let sourseItem = layer.getSource();
        if (sourseItem instanceof VectorSource) {
          let features = sourseItem.getFeatures();
          features.forEach((item) => {
            if (item.UID === UID) {
              isShowArr = item;
            }
          });
        }
        if (isShowArr) {
          return;
        }
      });
      // echart涟漪筛选
      let seriesArr = this.echartslayer2.getChartOptions().series;
      seriesArr.forEach((item) => {
        if (item.hasOwnProperty("UID")) {
          if (item.UID === UID) {
            item.data = flagCenterPos;
          }
        }
      });
      this.echartslayer2.setChartOptions({ series: seriesArr }, true);
      isShowArr.setStyle(flagFeature);
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  width: 100%;
  height: 100vh;
  #Map {
    width: 100%;
    height: 100%;
  }
}
::v-deep .el-slider {
  position: absolute;
  width: 200px;
  right: 10px;
  bottom: 10px;
  //时间轴进度条反转 , 为符合时间逻辑
  .el-slider__runway {
    background-color: #409eff;
  }
  .el-slider__bar {
    background-color: #e4e7ed;
  }
}
.btn-wrap {
  width: 110px;
  position: fixed;
  top: 100px;
  right: 10px;
  display: flex;
  flex-wrap: wrap;
  .btn {
    width: 110px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    & > p {
      width: 50px;
      height: 50px;
      background: #ccc;
      font-size: 12px;
      text-align: center;
      line-height: 50px;
    }
  }
}
</style>
