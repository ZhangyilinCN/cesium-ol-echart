<template>
  <div class="container">
    <div id="map" ref="map"></div>
    <label for="speed">
      speed:&nbsp;
      <input id="speed" type="range" min="10" max="999" step="10" value="60" />
    </label>
    <button id="start-animation">Start Animation</button>
  </div>
</template>

<script>
/* eslint-disable */
import "ol/ol.css";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import sourceVector from "ol/source/Vector";
import layerVector from "ol/layer/Vector";
import styleStyle from "ol/style/Style";
import styleFill from "ol/style/Fill";
import styleStroke from "ol/style/Stroke";
import styleText from "ol/style/Text";
import styleIcon from "ol/style/Icon";
import styleCircle from "ol/style/Circle";
import projTransforms from "ol/proj/transforms";
import geomPolygon from "ol/geom/Polygon";
import formatPolyline from "ol/format/Polyline";
import { decodeDeltas, decodeFloats } from "ol/format/Polyline";
import geomLineString from "ol/geom/LineString";
import geomGeometryType from "ol/geom/GeometryType";
import Overlay from "ol/Overlay";
import olSphere from "ol/sphere";
import interactionDraw from "ol/interaction/Draw";
import Observable from "ol/Observable";
import olFeature from "ol/Feature";
import geomPoint from "ol/geom/Point";
import { Map, View, Feature } from "ol";
// https://openlayers.org/en/latest/examples/feature-move-animation.html
export default {
  data() {
    return {
      mapInstance: null,
      arrPolygon: [
        [87.8466796875, 43.681640625],
        [91.2744140625, 30.234375],
        [102.8759765625, 25.576171875],
        [119.3994140625, 26.015625],
        [121.5087890625, 31.2890625],
        [116.2353515625, 40.341796875],
        [117.2900390625, 32.080078125],
        [87.8466796875, 43.681640625],
      ], // 封闭图形点坐标
      arrPolyline: [
        [89.8466796875, 45.681640625],
        [96.2744140625, 33.234375],
        [111.8759765625, 21.576171875],
        [120.3994140625, 24.015625],
        [125.5087890625, 36.2890625],
        [113.2353515625, 48.341796875],
        [140.2900390625, 22.080078125],
      ], // 封闭图形点坐标
      fillColor: "rgba(34, 255, 2, 0.2)", // 封闭图形填充颜色
      strokeColor: "#ffcc33", // 封闭图形边框颜色
      centerCoodinate: [110, 32], //  数据汇聚地图中心点  暂时设置为粗略估计的坐标  后期更改！
    };
  },
  created() {},
  mounted() {
    this.initMapAndChart();
    // this.drawPolygon(this.arrPolygon);
    this.setAnimate();
  },
  methods: {
    setAnimate() {
      var polyline =
        "hldhx@lnau`BCG_EaC??cFjAwDjF??uBlKMd@}@z@??aC^yk@z_@se@b[wFdE??wFfE}NfIoGxB_I\\gG}@eHoCyTmPqGaBaHOoD\\??yVrGotA|N??o[N_STiwAtEmHGeHcAkiA}^aMyBiHOkFNoI`CcVvM??gG^gF_@iJwC??eCcA]OoL}DwFyCaCgCcCwDcGwHsSoX??wI_EkUFmq@hBiOqBgTwS??iYse@gYq\\cp@ce@{vA}s@csJqaE}{@iRaqE{lBeRoIwd@_T{]_Ngn@{PmhEwaA{SeF_u@kQuyAw]wQeEgtAsZ}LiCarAkVwI}D??_}RcjEinPspDwSqCgs@sPua@_OkXaMeT_Nwk@ob@gV}TiYs[uTwXoNmT{Uyb@wNg]{Nqa@oDgNeJu_@_G}YsFw]kDuZyDmm@i_@uyIJe~@jCg|@nGiv@zUi_BfNqaAvIow@dEed@dCcf@r@qz@Egs@{Acu@mCum@yIey@gGig@cK_m@aSku@qRil@we@{mAeTej@}Tkz@cLgr@aHko@qOmcEaJw~C{w@kai@qBchBq@kmBS{kDnBscBnFu_Dbc@_~QHeU`IuyDrC_}@bByp@fCyoA?qMbD}{AIkeAgBk_A_A{UsDke@gFej@qH{o@qGgb@qH{`@mMgm@uQus@kL{_@yOmd@ymBgwE}x@ouBwtA__DuhEgaKuWct@gp@cnBii@mlBa_@}|Asj@qrCg^eaC}L{dAaJ_aAiOyjByH{nAuYu`GsAwXyn@ywMyOyqD{_@cfIcDe}@y@aeBJmwA`CkiAbFkhBlTgdDdPyiB`W}xDnSa}DbJyhCrXitAhT}x@bE}Z_@qW_Kwv@qKaaAiBgXvIm}A~JovAxCqW~WanB`XewBbK{_A`K}fBvAmi@xBycBeCauBoF}}@qJioAww@gjHaPopA_NurAyJku@uGmi@cDs[eRaiBkQstAsQkcByNmaCsK_uBcJgbEw@gkB_@ypEqDoqSm@eZcDwjBoGw`BoMegBaU_`Ce_@_uBqb@ytBwkFqiT_fAqfEwe@mfCka@_eC_UmlB}MmaBeWkkDeHwqAoX}~DcBsZmLcxBqOwqE_DkyAuJmrJ\\o~CfIewG|YibQxBssB?es@qGciA}RorAoVajA_nAodD{[y`AgPqp@mKwr@ms@umEaW{dAmb@umAw|@ojBwzDaaJsmBwbEgdCsrFqhAihDquAi`Fux@}_Dui@_eB_u@guCuyAuiHukA_lKszAu|OmaA{wKm}@clHs_A_rEahCssKo\\sgBsSglAqk@yvDcS_wAyTwpBmPc|BwZknFoFscB_GsaDiZmyMyLgtHgQonHqT{hKaPg}Dqq@m~Hym@c`EuiBudIabB{hF{pWifx@snAw`GkFyVqf@y~BkoAi}Lel@wtc@}`@oaXi_C}pZsi@eqGsSuqJ|Lqeb@e]kgPcaAu}SkDwzGhn@gjYh\\qlNZovJieBqja@ed@siO{[ol\\kCmjMe\\isHorCmec@uLebB}EqiBaCg}@m@qwHrT_vFps@kkI`uAszIrpHuzYxx@e{Crw@kpDhN{wBtQarDy@knFgP_yCu\\wyCwyA{kHo~@omEoYmoDaEcPiuAosDagD}rO{{AsyEihCayFilLaiUqm@_bAumFo}DgqA_uByi@swC~AkzDlhA}xEvcBa}Cxk@ql@`rAo|@~bBq{@``Bye@djDww@z_C_cAtn@ye@nfC_eC|gGahH~s@w}@``Fi~FpnAooC|u@wlEaEedRlYkrPvKerBfYs}Arg@m}AtrCkzElw@gjBbh@woBhR{gCwGkgCc[wtCuOapAcFoh@uBy[yBgr@c@iq@o@wvEv@sp@`FajBfCaq@fIipAdy@ewJlUc`ExGuaBdEmbBpBssArAuqBBg}@s@g{AkB{bBif@_bYmC}r@kDgm@sPq_BuJ_s@{X_{AsK_d@eM{d@wVgx@oWcu@??aDmOkNia@wFoSmDyMyCkPiBePwAob@XcQ|@oNdCoSfFwXhEmOnLi\\lbAulB`X_d@|k@au@bc@oc@bqC}{BhwDgcD`l@ed@??bL{G|a@eTje@oS~]cLr~Bgh@|b@}Jv}EieAlv@sPluD{z@nzA_]`|KchCtd@sPvb@wSb{@ko@f`RooQ~e[upZbuIolI|gFafFzu@iq@nMmJ|OeJn^{Qjh@yQhc@uJ~j@iGdd@kAp~BkBxO{@|QsAfYgEtYiGd]}Jpd@wRhVoNzNeK`j@ce@vgK}cJnSoSzQkVvUm^rSgc@`Uql@xIq\\vIgg@~kDyq[nIir@jNoq@xNwc@fYik@tk@su@neB}uBhqEesFjoGeyHtCoD|D}Ed|@ctAbIuOzqB_}D~NgY`\\um@v[gm@v{Cw`G`w@o{AdjAwzBh{C}`Gpp@ypAxn@}mAfz@{bBbNia@??jIab@`CuOlC}YnAcV`@_^m@aeB}@yk@YuTuBg^uCkZiGk\\yGeY}Lu_@oOsZiTe[uWi[sl@mo@soAauAsrBgzBqgAglAyd@ig@asAcyAklA}qAwHkGi{@s~@goAmsAyDeEirB_{B}IsJuEeFymAssAkdAmhAyTcVkFeEoKiH}l@kp@wg@sj@ku@ey@uh@kj@}EsFmG}Jk^_r@_f@m~@ym@yjA??a@cFd@kBrCgDbAUnAcBhAyAdk@et@??kF}D??OL";
      var route = new formatPolyline({
        factor: 1e6,
      }).readGeometry(polyline, {
        dataProjection: "EPSG:4326",
        featureProjection: "EPSG:3857",
      });
      console.log(decodeDeltas(polyline));
      console.log(decodeFloats(polyline));
      console.log(route);
      var route1 = new geomLineString([this.arrPolyline.flat()]);
      console.log(route1);
      var routeFeature = new olFeature({
        type: "route",
        geometry: route,
      });
      var geoMarker = new olFeature({
        type: "geoMarker",
        geometry: new geomPoint(route.getCoordinateAt(0)),
      });
      var startMarker = new olFeature({
        type: "icon",
        geometry: new geomPoint(route.getCoordinateAt(0)),
      });
      var endMarker = new olFeature({
        type: "icon",
        geometry: new geomPoint(route.getCoordinateAt(1)),
      });

      var styles = {
        route: new styleStyle({
          stroke: new styleStroke({
            width: 6,
            color: [237, 212, 0, 0.8],
          }),
        }),
        icon: new styleStyle({
          image: new styleIcon({
            anchor: [0.5, 1],
            src: "data/icon.png",
          }),
        }),
        geoMarker: new styleStyle({
          image: new styleCircle({
            radius: 7,
            fill: new styleFill({ color: "black" }),
            stroke: new styleStroke({
              color: "white",
              width: 2,
            }),
          }),
        }),
      };

      var animating = false;

      var vectorLayer = new layerVector({
        source: new sourceVector({
          features: [routeFeature, geoMarker, startMarker, endMarker],
        }),
        style: function(feature) {
          // hide geoMarker if animation is active
          if (animating && feature.get("type") === "geoMarker") {
            return null;
          }
          return styles[feature.get("type")];
        },
      });

      this.mapInstance.addLayer(vectorLayer);

      var speed, startTime;
      var speedInput = document.getElementById("speed");
      var startButton = document.getElementById("start-animation");

      function moveFeature(event) {
        var vectorContext = getVectorContext(event);
        var frameState = event.frameState;

        if (animating) {
          var elapsedTime = frameState.time - startTime;
          var distance = (speed * elapsedTime) / 1e6;

          if (distance >= 1) {
            stopAnimation(true);
            return;
          }

          var currentPoint = new geomPoint(route.getCoordinateAt(distance));
          var feature = new olFeature(currentPoint);
          vectorContext.drawFeature(feature, styles.geoMarker);
        }
        // tell OpenLayers to continue the postrender animation
        this.mapInstance.render();
      }

      function startAnimation() {
        if (animating) {
          stopAnimation(false);
        } else {
          animating = true;
          startTime = new Date().getTime();
          speed = speedInput.value;
          startButton.textContent = "Cancel Animation";
          // hide geoMarker
          geoMarker.changed();
          // just in case you pan somewhere else
          this.mapInstance.getView().setCenter(center);
          vectorLayer.on("postrender", moveFeature);
          this.mapInstance.render();
        }
      }

      function stopAnimation(ended) {
        animating = false;
        startButton.textContent = "Start Animation";

        // if animation cancelled set the marker at the beginning
        var coord = route.getCoordinateAt(ended ? 1 : 0);
        geoMarker.getGeometry().setCoordinates(coord);
        // remove listener
        vectorLayer.un("postrender", moveFeature);
      }

      startButton.addEventListener("click", startAnimation, false);
    },
    startAnimate() {},
    stopAnimate() {},
    drawPolygon(arr) {
      var polygonFeature = new olFeature(new geomPolygon([arr]));
      //实例化一个矢量图层Vector作为绘制层
      var source = new sourceVector({
        features: [polygonFeature],
      });
      var vector = new layerVector({
        source: source,
        style: new styleStyle({
          fill: new styleFill({
            color: this.fillColor,
          }),
          stroke: new styleStroke({
            color: this.strokeColor,
            width: 2,
          }),
        }),
      });
      this.mapInstance.addLayer(vector);
    },
    initMapAndChart() {
      this.mapInstance = new Map({
        target: this.$refs.map,
        layers: [
          new TileLayer({
            source: new XYZ({
              //   url:
              // "http://cache1.arcgisonline.cn/arcgis/rest/services/ChinaOnline" +
              // "StreetPurplishBlue/MapServer/tile/{z}/{y}/{x}",
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
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  width: 100%;
  height: 100vh;
  min-height: 10.8rem;
}
#map {
  width: 100%;
  height: 100%;
}
</style>
