<template>
  <div class="container">
    <div id="Map" ref="map"></div>
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
EChartsLayer.prototype.onClick = function() {};
EChartsLayer.prototype.mouseDown = function() {};
EChartsLayer.prototype.mouseUp = function() {};
EChartsLayer.prototype.mouseMove = function() {};
import DrawingGraph from "@/components/drawing";
import Measure from "@/components/measure";
export default {
  components: {},
  data() {
    return {
      mapInstance: null,
      echartslayer: null,
      routeFeature: null,
      lineData: [],
      series: [],
      centerCoodinate: [110, 32],
      planeSVG:
        "path://M30.9,53.2C16.8,53.2,5.3,41.7,5.3,27.6S16.8,2,30.9,2C45,2,56.4,13.5,56.4,27.6S45,53.2,30.9,53.2z M30.9,3.5C17.6,3.5,6.8,14.4,6.8,27.6c0,13.3,10.8,24.1,24.101,24.1C44.2,51.7,55,40.9,55,27.6C54.9,14.4,44.1,3.5,30.9,3.5z M36.9,35.8c0,0.601-0.4,1-0.9,1h-1.3c-0.5,0-0.9-0.399-0.9-1V19.5c0-0.6,0.4-1,0.9-1H36c0.5,0,0.9,0.4,0.9,1V35.8z M27.8,35.8 c0,0.601-0.4,1-0.9,1h-1.3c-0.5,0-0.9-0.399-0.9-1V19.5c0-0.6,0.4-1,0.9-1H27c0.5,0,0.9,0.4,0.9,1L27.8,35.8L27.8,35.8z",
    };
  },
  mounted() {
    this.initMapAndChart();
  },
  methods: {
    initMapAndChart() {
      this.mapInstance = new Map({
        controls: defaultControls().extend([new ScaleLine()]),
        target: this.$refs.map,
        layers: [
          new TileLayer({
            source: new XYZ({
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
      // 中国主要城市 地理坐标
      let geoCoordMap = {
        上海: [121.4648, 31.2891],
        东莞: [113.8953, 22.901],
        东营: [118.7073, 37.5513],
        中山: [113.4229, 22.478],
        临汾: [111.4783, 36.1615],
        临沂: [118.3118, 35.2936],
        丹东: [124.541, 40.4242],
        丽水: [119.5642, 28.1854],
        乌鲁木齐: [87.9236, 43.5883],
        佛山: [112.8955, 23.1097],
        保定: [115.0488, 39.0948],
        兰州: [103.5901, 36.3043],
        包头: [110.3467, 41.4899],
        北京: [116.4551, 40.2539],
        北海: [109.314, 21.6211],
        南京: [118.8062, 31.9208],
        南宁: [108.479, 23.1152],
        南昌: [116.0046, 28.6633],
        南通: [121.1023, 32.1625],
        厦门: [118.1689, 24.6478],
        台州: [121.1353, 28.6688],
        合肥: [117.29, 32.0581],
        呼和浩特: [111.4124, 40.4901],
        咸阳: [108.4131, 34.8706],
        哈尔滨: [127.9688, 45.368],
        唐山: [118.4766, 39.6826],
        嘉兴: [120.9155, 30.6354],
        大同: [113.7854, 39.8035],
        大连: [122.2229, 39.4409],
        天津: [117.4219, 39.4189],
        太原: [112.3352, 37.9413],
        威海: [121.9482, 37.1393],
        宁波: [121.5967, 29.6466],
        宝鸡: [107.1826, 34.3433],
        宿迁: [118.5535, 33.7775],
        常州: [119.4543, 31.5582],
        广州: [113.5107, 23.2196],
        廊坊: [116.521, 39.0509],
        延安: [109.1052, 36.4252],
        张家口: [115.1477, 40.8527],
        徐州: [117.5208, 34.3268],
        德州: [116.6858, 37.2107],
        惠州: [114.6204, 23.1647],
        成都: [103.9526, 30.7617],
        扬州: [119.4653, 32.8162],
        承德: [117.5757, 41.4075],
        拉萨: [91.1865, 30.1465],
        无锡: [120.3442, 31.5527],
        日照: [119.2786, 35.5023],
        昆明: [102.9199, 25.4663],
        杭州: [119.5313, 29.8773],
        枣庄: [117.323, 34.8926],
        柳州: [109.3799, 24.9774],
        株洲: [113.5327, 27.0319],
        武汉: [114.3896, 30.6628],
        汕头: [117.1692, 23.3405],
        江门: [112.6318, 22.1484],
        沈阳: [123.1238, 42.1216],
        沧州: [116.8286, 38.2104],
        河源: [114.917, 23.9722],
        泉州: [118.3228, 25.1147],
        泰安: [117.0264, 36.0516],
        泰州: [120.0586, 32.5525],
        济南: [117.1582, 36.8701],
        济宁: [116.8286, 35.3375],
        海口: [110.3893, 19.8516],
        淄博: [118.0371, 36.6064],
        淮安: [118.927, 33.4039],
        深圳: [114.5435, 22.5439],
        清远: [112.9175, 24.3292],
        温州: [120.498, 27.8119],
        渭南: [109.7864, 35.0299],
        湖州: [119.8608, 30.7782],
        湘潭: [112.5439, 27.7075],
        滨州: [117.8174, 37.4963],
        潍坊: [119.0918, 36.524],
        烟台: [120.7397, 37.5128],
        玉溪: [101.9312, 23.8898],
        珠海: [113.7305, 22.1155],
        盐城: [120.2234, 33.5577],
        盘锦: [121.9482, 41.0449],
        石家庄: [114.4995, 38.1006],
        福州: [119.4543, 25.9222],
        秦皇岛: [119.2126, 40.0232],
        绍兴: [120.564, 29.7565],
        聊城: [115.9167, 36.4032],
        肇庆: [112.1265, 23.5822],
        舟山: [122.2559, 30.2234],
        苏州: [120.6519, 31.3989],
        莱芜: [117.6526, 36.2714],
        菏泽: [115.6201, 35.2057],
        营口: [122.4316, 40.4297],
        葫芦岛: [120.1575, 40.578],
        衡水: [115.8838, 37.7161],
        衢州: [118.6853, 28.8666],
        西宁: [101.4038, 36.8207],
        西安: [109.1162, 34.2004],
        贵阳: [106.6992, 26.7682],
        连云港: [119.1248, 34.552],
        邢台: [114.8071, 37.2821],
        邯郸: [114.4775, 36.535],
        郑州: [113.4668, 34.6234],
        鄂尔多斯: [108.9734, 39.2487],
        重庆: [107.7539, 30.1904],
        金华: [120.0037, 29.1028],
        铜川: [109.0393, 35.1947],
        银川: [106.3586, 38.1775],
        镇江: [119.4763, 31.9702],
        长春: [125.8154, 44.2584],
        长沙: [113.0823, 28.2568],
        长治: [112.8625, 36.4746],
        阳泉: [113.4778, 38.0951],
        青岛: [120.4651, 36.3373],
        韶关: [113.7964, 24.7028],
      };
      let originData = [
        {
          capital: "福州",
          value: 16,
        },
        {
          capital: "昆明",
          value: 16,
        },
        {
          capital: "乌鲁木齐",
          value: 16,
        },
        {
          capital: "拉萨",
          value: 16,
        },
        {
          capital: "上海",
          value: 16,
        },
        {
          capital: "合肥",
          value: 16,
        },
      ];
      //  数据整合  提取地理坐标
      let scatterData = originData.map((item) => {
        return {
          name: item.capital,
          value: geoCoordMap[item.capital].concat([item.value]),
        };
      });
      //  飞机航线路径轨迹集合群
      let definePlaneLines = [];
      let guiji1 = scatterData.map((item) => {
        return [item.value[0], item.value[1]];
      });
      let symbolImg = "image://" + require("../../assets/images/plane.png");
      definePlaneLines.push(guiji1);
      this.series.push(
        {
          name: "effectScatter",
          type: "effectScatter",
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
          label: {
            //圆点文字设置
            normal: {
              show: true,
              formatter: "{b}",
              position: ["-20%", "200%"],
              color: "#5cdbc6",
            },
          },
          data: scatterData,
        },
        {
          name: "PlaneLines",
          type: "lines",
          coordinateSystem: "geo",
          zlevel: 1,
          // effect: {
          //   //轨道上的箭头设置
          //   show: true,
          //   period: 40,
          //   trailLength: 0,
          //   symbol: symbolImg,
          //   symbolSize: 30,
          // },
          lineStyle: {
            normal: {
              color: "#00BFFF",
              opacity: 1,
              width: 3,
            },
          },
          polyline: true,
          data: definePlaneLines,
        }
      );
      let Option = {
        background: "transparent",
        tooltip: {},
        series: this.series,
        geo: {
          roam: true,
        },
        // timeline: {
        //   axisType: "category",
        //   autoPlay: true,
        //   playInterval: 3000,
        // },
      };
      this.echartslayer = new EChartsLayer(Option, {
        hideOnMoving: true,
        hideOnZooming: true,
      });
      this.echartslayer.appendTo(this.mapInstance);
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
</style>
