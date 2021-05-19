<!-- 本demo大多用的是世界坐标进行的开发测试，暂不涉及弧度与百度坐标等；
世界坐标又名笛卡尔坐标，如需要转换为经纬度的话，搜索cesiumCreateToolTips方法，
其中会有关于笛卡尔转经纬度的描述-->
<template>
  <div class="wrap">
    <div id="ball"></div>
    <div class="btn-wrap">
      <div class="btn" @click="drawLineFn">线</div>
      <div class="btn" @click="drawAreaFn">面</div>
      <div class="btn" @click="delItemFn">删</div>
      <div class="btn-other">
        <div
          class="btn btnleft"
          @click="showLeiDaFn(javaDataEntity, javaDataPrimitive)"
        >
          显
        </div>
        <div
          class="btn btnright"
          @click="hideLeiDaFn(javaDataEntity, javaDataPrimitive)"
        >
          隐
        </div>
        <div class="btn" @click="drawKuangeFn">框</div>
      </div>
      <div class="btn-other">
        <div
          class="btn btnleft"
          @click="showLeiDaFn(javaDataEntity2, javaDataPrimitive2)"
        >
          显
        </div>
        <div
          class="btn btnright"
          @click="hideLeiDaFn(javaDataEntity2, javaDataPrimitive2)"
        >
          隐
        </div>
        <div class="btn" @click="drawKuange2Fn">框2</div>
      </div>
      <div class="btn-other">
        <div class="btn btnleft" @click="showHot">显</div>
        <div class="btn btnright" @click="hideHot">隐</div>
        <div class="btn" @click="drawHotMapFn">hot</div>
      </div>
      <div class="btn" @click="drawToolTipsFn">标</div>
      <div class="btn" @click="changeMapTypeFn">切</div>
    </div>
    <div class="createToolTips-wrap" v-show="isShowToolTips">
      <div class="createToolTips">
        <div class="createToolTips-title">
          <p>当前点击点的经纬高度为:</p>
          <p>{{ LON }}</p>
          <p>{{ LAT }}</p>
          <p>{{ ALT }}</p>
          <p>当前点击点的笛卡尔为:</p>
          <p>{{ DIKAER }}</p>
        </div>
        <input
          type="text"
          class="tooltipsInput"
          placeholder="输入备注"
          v-model="tooltipsVal"
        />
        <div class="createToolTips-btns">
          <div @click="submitFn">确定</div>
          <div @click="clearFn">取消</div>
        </div>
      </div>
    </div>
    <div class="leidaTool" v-show="leidaPos" :style="leidaPos">
      我是雷达
      <div @click="isShowLeidaInfoFn">详情</div>
    </div>
    <div class="leidaTool-info" v-show="showLeidaInfo" :style="leidaPos">
      我是雷达详情xxxxxxxx
    </div>
    <div class="guiJI" v-show="guijiPos" :style="guijiPos">
      组合按钮
      <div @click="isShowGuijiInfoFn">详情</div>
    </div>
    <div class="guiJIInfo" v-show="showGuijiInfo" :style="guijiPos">
      我是详情
      <p>当前地点：{{ guijiInfoObj.name }}</p>
      <p>当前详情：{{ guijiInfoObj.desc }}</p>
      <p>当前经度：{{ guijiInfoObj.lon }}</p>
      <p>当前纬度：{{ guijiInfoObj.lat }}</p>
      <p>当前高度：{{ guijiInfoObj.ALT }}</p>
      <p>当前笛卡尔：{{ guijiInfoObj.DIKAER }}</p>
    </div>
    <tracks :viewer="ballObj" />
    <!-- <arrows v-if="ballObj" /> -->
    <junbiao :plotDraw="plotDraw" :militaryPlotLayer="militaryPlotLayer" />
  </div>
</template>

<script>
import PlotDraw from "@/junbiaoku/PlotDraw";
import MilitaryPlotLayer from "@/junbiaoku/common/PlotLayer/MilitaryPlot";
import tracks from "@/components/tracks.vue";
// import arrows from "@/components/arrows.vue";
import junbiao from "@/components/junbiao.vue";
export default {
  components: {
    tracks,
    // arrows,
    junbiao,
  },
  data() {
    window.viewer = null;
    return {
      ballObj: null,
      handObj: null,
      JavaDataArr: [
        [-95.40023916913167, 37.856490490489215, -0.006095398480284195],
        [-95.40026294900376, 37.85290001902964, -0.00136267955879401],
        [-95.40325369562481, 37.85301339824785, -0.0036431342770942257],
        [-95.40332157433134, 37.856400290056165, -0.008939164701690138],
        [-95.40332157433134, 37.856400290056165, 50],
        [-95.40188977662504, 37.85795718256134, 100],
        [-95.39838917072952, 37.858657588930235, 200],
        [-95.39868360511281, 37.85306033978098, 300],
      ], //精准框选的后台经纬点
      JavaDataArr2: [
        [-95.40023916913167, 37.856490490489215, -0.006095398480284195],
        [-95.40026294900376, 37.85290001902964, -0.00136267955879401],
        [-95.40332157433134, 37.856400290056165, -0.008939164701690138],
        [-95.3963128878144, 37.85642702299624, 200],
      ], //精准框选的后台经纬点2
      JavaDataCenterIconUrl: require("../../assets/images/leida.png"),
      heatmapData: [
        {
          x: 116.1383442264,
          y: 37.4360048372,
          value: 76,
        },
        {
          x: 116.1384363011,
          y: 37.4360298848,
          value: 63,
        },
        {
          x: 116.138368102,
          y: 37.4358360603,
          value: 1,
        },
        {
          x: 116.1385627739,
          y: 37.4358799123,
          value: 21,
        },
        {
          x: 116.1385138501,
          y: 37.4359327669,
          value: 28,
        },
        {
          x: 116.1385031219,
          y: 37.4359730105,
          value: 41,
        },
        {
          x: 116.1384127393,
          y: 37.435928255,
          value: 75,
        },
        {
          x: 116.1384551116,
          y: 37.4359450132,
          value: 3,
        },
        {
          x: 116.1384927196,
          y: 37.4359158649,
          value: 45,
        },
        {
          x: 116.1384938639,
          y: 37.4358498311,
          value: 45,
        },
        {
          x: 116.1385183299,
          y: 37.4360213794,
          value: 93,
        },
        {
          x: 116.1384007925,
          y: 37.4359860133,
          value: 46,
        },
        {
          x: 116.1383604844,
          y: 37.4358298672,
          value: 54,
        },
        {
          x: 116.13851025,
          y: 37.4359098303,
          value: 39,
        },
        {
          x: 116.1383874733,
          y: 37.4358511035,
          value: 34,
        },
        {
          x: 116.1384981796,
          y: 37.4359355403,
          value: 81,
        },
        {
          x: 116.1384504107,
          y: 37.4360332348,
          value: 39,
        },
        {
          x: 116.1385582664,
          y: 37.4359788335,
          value: 20,
        },
        {
          x: 116.1383967364,
          y: 37.4360581999,
          value: 35,
        },
        {
          x: 116.1383839615,
          y: 37.436016316,
          value: 47,
        },
        {
          x: 116.1384082712,
          y: 37.4358423338,
          value: 36,
        },
        {
          x: 116.1385092651,
          y: 37.4358577623,
          value: 69,
        },
        {
          x: 116.138360356,
          y: 37.436046789,
          value: 90,
        },
        {
          x: 116.138471893,
          y: 37.4359184292,
          value: 88,
        },
        {
          x: 116.1385605689,
          y: 37.4360271359,
          value: 81,
        },
        {
          x: 116.1383585714,
          y: 37.4359362476,
          value: 32,
        },
        {
          x: 116.1384939114,
          y: 37.4358844253,
          value: 67,
        },
        {
          x: 116.138466724,
          y: 37.436019121,
          value: 17,
        },
        {
          x: 116.1385504355,
          y: 37.4360614056,
          value: 49,
        },
        {
          x: 116.1383883832,
          y: 37.4358733544,
          value: 82,
        },
        {
          x: 116.1385670669,
          y: 37.4359650236,
          value: 25,
        },
        {
          x: 116.1383416534,
          y: 37.4359310876,
          value: 82,
        },
        {
          x: 116.138525285,
          y: 37.4359394661,
          value: 66,
        },
        {
          x: 116.1385487719,
          y: 37.4360137656,
          value: 73,
        },
        {
          x: 116.1385496029,
          y: 37.4359187277,
          value: 73,
        },
        {
          x: 116.1383989222,
          y: 37.4358556562,
          value: 61,
        },
        {
          x: 116.1385499424,
          y: 37.4359149305,
          value: 67,
        },
        {
          x: 116.138404523,
          y: 37.4359563326,
          value: 90,
        },
        {
          x: 116.1383883675,
          y: 37.4359794855,
          value: 78,
        },
        {
          x: 116.1383967187,
          y: 37.435891185,
          value: 15,
        },
        {
          x: 116.1384610005,
          y: 37.4359044797,
          value: 15,
        },
        {
          x: 116.1384688489,
          y: 37.4360396127,
          value: 91,
        },
        {
          x: 116.1384431875,
          y: 37.4360684409,
          value: 8,
        },
        {
          x: 116.1385411067,
          y: 37.4360645847,
          value: 42,
        },
        {
          x: 116.1385237178,
          y: 37.4358843181,
          value: 31,
        },
        {
          x: 116.1384406464,
          y: 37.4360003831,
          value: 51,
        },
        {
          x: 116.1384679169,
          y: 37.4359950456,
          value: 96,
        },
        {
          x: 116.1384194314,
          y: 37.4358419739,
          value: 22,
        },
        {
          x: 116.1385049792,
          y: 37.4359574813,
          value: 44,
        },
        {
          x: 116.1384097378,
          y: 37.4358598672,
          value: 82,
        },
        {
          x: 116.1384993219,
          y: 37.4360352975,
          value: 84,
        },
        {
          x: 116.1383640499,
          y: 37.4359839518,
          value: 81,
        },
      ], // 热力图假数据
      bounds: {
        west: 116.13833844,
        east: 116.13956899,
        south: 37.43582929,
        north: 37.43706916,
      }, //热力图的四至范围
      // 直线生成的唯一id(项目应为时间戳或者可确定的唯一id)
      lineItemID: 100,
      // 面积生成的唯一id(项目应为时间戳或者可确定的唯一id)
      areaItemID: 1000,
      // 点击位置的经纬度
      LON: null, //纬
      LAT: null, //经
      ALT: null, //高
      DIKAER: null, //对应笛卡尔
      isShowToolTips: false, //是否显示创建模态窗
      tooltipsVal: null, //创建时的备注
      iconUrl: require("../../assets/images/dizhi.png"),
      javaDataEntity: null, //框选按钮生成的Entity
      javaDataPrimitive: null, //框选按钮生成的波纹
      javaDataUID: "leida1", //雷达的唯一id
      javaDataEntity2: null, //框选按钮生成的Entity2
      javaDataPrimitive2: null, //框选按钮生成的波纹2
      javaData2UID: "leida2", //雷达的唯一id2
      primitiveFilterArr: null, //雷达图元集合
      entityFilterArr: null, //雷达entity集合
      HeadMapEntity: null, //热力图生成的Entity
      leidaPos: {}, //距离屏幕的距离（弹窗定位）
      showLeidaInfo: false, //是否显示雷达弹窗详情
      guijiPos: {}, //距离屏幕的距离（轨迹定位）
      showGuijiInfo: false, //是否显示轨迹弹窗详情
      guijiInfoObj: {}, //获取的轨迹详情
      is3DFlag: true, //切换2-3d的变量
      plotDraw: null, //军标方法对象
      militaryPlotLayer: null, //军标储存？;
    };
  },
  mounted() {
    this.createballFn();
    this.$nextTick(() => {
      this.cesiumShowItemDesc(this.ballObj, this.handObj);
    });
  },
  beforeDestroy() {},
  methods: {
    // 创建地球
    createballFn() {
      Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(
        90,
        -20,
        110,
        90
      );
      Cesium.Ion.defaultAccessToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI1YzRhOGE5YS0yOWM3LTQ4NWYtOWMwYi0zNjU5OTJjZjA1ZjYiLCJpZCI6NTQxMzUsImlhdCI6MTYxOTU5Mzg3Mn0.gma-xUFLKsltb3ijWbpUh6E9ca1rGcg9Oh_hOUu2ZTc";
      this.ballObj = new Cesium.Viewer("ball", {
        animation: true, //是否创建动画小器件，左下角仪表
        shouldAnimate: true,
        baseLayerPicker: false, //是否显示图层选择器
        fullscreenButton: false, //是否显示全屏按钮
        geocoder: false, //是否显示geocoder小器件，右上角查询按钮
        homeButton: true, //是否显示Home按钮
        infoBox: false, //是否显示信息框
        sceneModePicker: false, //是否显示3D/2D选择器
        selectionIndicator: false, //是否显示选取指示器组件
        timeline: true, //是否显示时间轴
        navigationHelpButton: false, //是否显示右上角的帮助按钮
        scene3DOnly: false, //如果设置为true，则所有几何图形以3D模式绘制以节约GPU资源
      });
      // 放入全局
      viewer = this.ballObj;
      //隐藏底部logo
      this.ballObj._cesiumWidget._creditContainer.style.display = "none";
      //移除默认的双击事件
      this.ballObj.cesiumWidget.screenSpaceEventHandler.removeInputAction(
        Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
      );
      // //增加14级图层清晰
      // this.ballObj.imageryLayers.addImageryProvider(
      //   new Cesium.IonImageryProvider({ assetId: 3954 })
      // );
      // //增加房屋3d效果
      // this.ballObj.scene.primitives.add(
      //   new Cesium.Cesium3DTileset({
      //     url: Cesium.IonResource.fromAssetId(354307),
      //   })
      // );
      // //   激活基于太阳位置的光照：
      // this.ballObj.scene.globe.enableLighting = true;
      //  this.$refs.measure.init(this.ballObj)
      // 军标
      this.plotDraw = new PlotDraw(viewer);
      this.militaryPlotLayer = new MilitaryPlotLayer(viewer);
      //可以以json字符串的方式存储到数据库 从数据库获取后添加到图层 具体如何存储 取决于自己 （构造一个标绘对象需要哪些参数 就保存哪些参数即可）
      let data = [
        '{"plotCode":"202151794751901","baseInfo":{"points":[[63.808355365179914,58.58519035165309],[76.02493157194425,58.781098058087196]],"height":493.448988668378,"plotName":"finearrow","plotCode":"202151794751901"},"properties":{}}',
        '{"plotCode":"202151710245423","baseInfo":{"points":[[66.96603924513202,52.10136720484367],[68.80781304617273,47.231377634862454],[73.29992725019603,48.83610783442159]],"height":-981.3165109959799,"plotName":"sector","plotCode":"202151710245423"},"properties":{}}',
      ];

      this.militaryPlotLayer.initPlots(data);

      this.plotDraw.PlotDrawEndEvent.addEventListener((drawPlot, type) => {
        drawPlot.remove(); //移除绘制的对象
        //绘制结束 如果需要保存到数据库中 保存成功后再添加到图层中显示
        let plot = this.militaryPlotLayer.addPlot(drawPlot); //将标绘对象添加到图层中进行管理
      });
    },
    // 画线
    drawLineFn() {
      this.measureLineSpace(this.ballObj, this.handObj);
    },
    // 画面积
    drawAreaFn() {
      this.measureAreaSpace(this.ballObj, this.handObj);
    },
    // 删除entity
    delItemFn() {
      this.removeEntity(this.ballObj, this.handObj);
    },
    // 精准框选1
    drawKuangeFn() {
      this.viewRectangle(
        this.ballObj,
        this.JavaDataArr,
        "javaDataEntity",
        "javaDataPrimitive",
        this.javaDataUID
      );
    },
    // 精准框选2
    drawKuange2Fn() {
      this.viewRectangle(
        this.ballObj,
        this.JavaDataArr2,
        "javaDataEntity2",
        "javaDataPrimitive2",
        this.javaData2UID,
        "BLUE"
      );
    },
    // 画热力图
    drawHotMapFn() {
      this.heatmap(this.ballObj, this.bounds, this.heatmapData);
    },
    // 创建billboard
    drawToolTipsFn() {
      this.cesiumCreateToolTips(this.ballObj, this.handObj);
    },
    // 创建billboard时候弹窗的from-submit
    submitFn() {
      this.cesiumCreateItem(this.ballObj);
      this.$nextTick(() => {
        this.tooltipsVal = null;
      });
    },
    // 创建billboard时候弹窗的from-reset
    clearFn() {
      this.isShowToolTips = false;
      this.tooltipsVal = null;
    },
    // ````````````````````````````关于ceium的fn``````````````````````````````````
    // 测量直线距离
    measureLineSpace(viewer, handler) {
      // 取消双击事件-追踪该位置
      viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
        Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
      );
      handler = new Cesium.ScreenSpaceEventHandler(
        viewer.scene._imageryLayerCollection
      );
      var that = this;
      that.lineItemID = that.lineItemID + 1;
      var positions = []; //坐标集合
      var poly = null; //线的对线
      var distance = 0; //点与点的距离val
      var cartesian = null; //当前鼠标点的详情
      var floatingPoint; //entity的val
      let entityArr = []; //关于line的entity的集合
      this.$key.bind("backspace", () => {
        this.KeyboardBackLineFn(positions, entityArr);
      }); //绑定键盘事件
      handler.setInputAction(function(movement) {
        //鼠标移动事件
        let ray = viewer.camera.getPickRay(movement.endPosition);
        cartesian = viewer.scene.globe.pick(ray, viewer.scene);
        if (cartesian) {
          if (positions.length >= 2) {
            if (!Cesium.defined(poly)) {
              poly = new PolyLinePrimitive(positions);
            } else {
              positions.pop();
              positions.push(cartesian);
            }
            distance = getSpaceDistance(positions);
          } else if (positions.length < 2) {
            positions = [];
            poly = null;
            distance = 0;
            entityArr = [];
            return;
          }
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
      handler.setInputAction(function(movement) {
        //左键事件
        let ray = viewer.camera.getPickRay(movement.position);
        cartesian = viewer.scene.globe.pick(ray, viewer.scene);
        if (cartesian) {
          if (positions.length == 0) {
            poly = null;
            distance = 0;
            entityArr = [];
            positions.push(cartesian.clone());
          } else if (positions.length === 1) {
            poly = null;
            distance = 0;
            entityArr = [];
          }
          positions.push(cartesian);
          //在三维场景中添加Label
          var textDisance = distance + "米";
          floatingPoint = viewer.entities.add({
            name: "空间直线距离",
            itemid: that.lineItemID,
            position: positions[positions.length - 1],
            point: {
              pixelSize: 5,
              color: Cesium.Color.RED,
              outlineColor: Cesium.Color.WHITE,
              outlineWidth: 2,
            },
            label: {
              text: textDisance,
              font: "18px sans-serif",
              fillColor: Cesium.Color.GOLD,
              style: Cesium.LabelStyle.FILL_AND_OUTLINE,
              outlineWidth: 2,
              verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
              pixelOffset: new Cesium.Cartesian2(20, -20),
            },
          });
          entityArr.push(floatingPoint);
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
      handler.setInputAction(function(movement) {
        //右键结束事件
        handler.destroy(); //关闭事件句柄
        positions.pop(); //最后一个点无效
        that.$key.unbind("backspace"); //解绑键盘时间
      }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
      var PolyLinePrimitive = (function() {
        function _(positions) {
          this.options = {
            name: "直线",
            itemid: that.lineItemID,
            polyline: {
              //线
              show: true,
              positions: [],
              material: Cesium.Color.CHARTREUSE, //颜色
              width: 2,
              clampToGround: true,
            },
          };
          this.positions = positions;
          this._init();
        }
        _.prototype._init = function() {
          var _self = this;
          var _update = function() {
            return _self.positions;
          };
          //实时更新polyline.positions
          this.options.polyline.positions = new Cesium.CallbackProperty(
            _update,
            false
          );
          viewer.entities.add(this.options);
        };
        return _;
      })();
      //空间两点距离计算函数
      function getSpaceDistance(positions) {
        var distance = 0;
        for (var i = 0; i < positions.length - 1; i++) {
          var point1cartographic = Cesium.Cartographic.fromCartesian(
            positions[i]
          );
          var point2cartographic = Cesium.Cartographic.fromCartesian(
            positions[i + 1]
          );
          /**根据经纬度计算出距离**/
          var geodesic = new Cesium.EllipsoidGeodesic();
          geodesic.setEndPoints(point1cartographic, point2cartographic);
          var s = geodesic.surfaceDistance;
          //返回两点之间的距离
          s = Math.sqrt(
            Math.pow(s, 2) +
              Math.pow(point2cartographic.height - point1cartographic.height, 2)
          );
          distance = distance + s;
        }
        return distance.toFixed(2);
      }
    },
    // 测量空间面积
    measureAreaSpace(viewer, handler) {
      // 取消双击事件-追踪该位置
      viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
        Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
      );
      // 鼠标事件
      handler = new Cesium.ScreenSpaceEventHandler(
        viewer.scene._imageryLayerCollection
      );
      let that = this;
      that.areaItemID = that.areaItemID + 1;
      var positions = [];
      var tempPoints = [];
      var polygon = null;
      var cartesian = null;
      var floatingPoint; //浮动点
      let entityArr = [];
      this.$key.bind("backspace", () => {
        this.KeyboardBackAreaFn(positions, entityArr, tempPoints);
      });
      handler.setInputAction(function(movement) {
        let ray = viewer.camera.getPickRay(movement.endPosition);
        cartesian = viewer.scene.globe.pick(ray, viewer.scene);
        if (cartesian) {
          if (positions.length >= 2) {
            if (!Cesium.defined(polygon)) {
              polygon = new PolygonPrimitive(positions);
            } else {
              positions.pop();
              positions.push(cartesian);
            }
          } else if (positions.length < 2) {
            positions = [];
            polygon = null;
            tempPoints = [];
            entityArr = [];
            return;
          }
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
      handler.setInputAction(function(movement) {
        let ray = viewer.camera.getPickRay(movement.position);
        cartesian = viewer.scene.globe.pick(ray, viewer.scene);
        if (cartesian) {
          if (positions.length == 0) {
            polygon = null;
            tempPoints = [];
            entityArr = [];
            positions.push(cartesian.clone());
          } else if (positions.length === 1) {
            polygon = null;
            tempPoints = [];
            entityArr = [];
          }
          positions.push(cartesian);
          //在三维场景中添加点
          var cartographic = Cesium.Cartographic.fromCartesian(
            positions[positions.length - 1]
          );
          // 世界坐标转换为经纬度
          var longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
          var latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
          var heightString = cartographic.height;
          tempPoints.push({
            lon: longitudeString,
            lat: latitudeString,
            hei: heightString,
          });
          floatingPoint = viewer.entities.add({
            name: "多边形面积",
            position: positions[positions.length - 1],
            itemid: that.areaItemID,
            point: {
              pixelSize: 5,
              color: Cesium.Color.RED,
              outlineColor: Cesium.Color.WHITE,
              outlineWidth: 2,
              // heightReference: Cesium.HeightReference.CLAMP_TO_GROUND, //表示相对于地形的位置:该位置固定在地形上。
            },
          });
          entityArr.push(floatingPoint);
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
      handler.setInputAction(function(movement) {
        handler.destroy();
        positions.pop();
        that.$key.unbind("backspace");
        var textArea = getArea(tempPoints) + "平方公里";
        viewer.entities.add({
          name: "多边形面积",
          itemid: that.areaItemID,
          position: positions[positions.length - 1],
          label: {
            text: textArea,
            font: "18px sans-serif",
            fillColor: Cesium.Color.GOLD,
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            outlineWidth: 2,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            pixelOffset: new Cesium.Cartesian2(20, -40),
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
          },
        });
      }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
      var radiansPerDegree = Math.PI / 180.0; //角度转化为弧度(rad)
      var degreesPerRadian = 180.0 / Math.PI; //弧度转化为角度
      //计算多边形面积
      function getArea(points) {
        var res = 0;
        //拆分三角曲面
        for (var i = 0; i < points.length - 2; i++) {
          var j = (i + 1) % points.length;
          var k = (i + 2) % points.length;
          var totalAngle = Angle(points[i], points[j], points[k]);
          var dis_temp1 = distance(positions[i], positions[j]);
          var dis_temp2 = distance(positions[j], positions[k]);
          res += dis_temp1 * dis_temp2 * Math.abs(Math.sin(totalAngle));
          console.log(res);
        }
        return (res / 1000000.0).toFixed(4);
      }
      /*角度*/
      function Angle(p1, p2, p3) {
        var bearing21 = Bearing(p2, p1);
        var bearing23 = Bearing(p2, p3);
        var angle = bearing21 - bearing23;
        if (angle < 0) {
          angle += 360;
        }
        return angle;
      }
      /*方向*/
      function Bearing(from, to) {
        var lat1 = from.lat * radiansPerDegree;
        var lon1 = from.lon * radiansPerDegree;
        var lat2 = to.lat * radiansPerDegree;
        var lon2 = to.lon * radiansPerDegree;
        var angle = -Math.atan2(
          Math.sin(lon1 - lon2) * Math.cos(lat2),
          Math.cos(lat1) * Math.sin(lat2) -
            Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon1 - lon2)
        );
        if (angle < 0) {
          angle += Math.PI * 2.0;
        }
        angle = angle * degreesPerRadian; //角度
        return angle;
      }
      var PolygonPrimitive = (function() {
        function _(positions) {
          this.options = {
            name: "多边形",
            itemid: that.areaItemID,
            polygon: {
              hierarchy: [],
              material: Cesium.Color.GREEN.withAlpha(0.5),
            },
          };

          this.hierarchy = { positions };
          this._init();
        }
        _.prototype._init = function() {
          var _self = this;
          var _update = function() {
            return _self.hierarchy;
          };
          //实时更新polygon.hierarchy
          this.options.polygon.hierarchy = new Cesium.CallbackProperty(
            _update,
            false
          );
          viewer.entities.add(this.options);
        };
        return _;
      })();
      function distance(point1, point2) {
        var point1cartographic = Cesium.Cartographic.fromCartesian(point1);
        var point2cartographic = Cesium.Cartographic.fromCartesian(point2);
        /**根据经纬度计算出距离**/
        var geodesic = new Cesium.EllipsoidGeodesic();
        geodesic.setEndPoints(point1cartographic, point2cartographic);
        var s = geodesic.surfaceDistance;
        //返回两点之间的距离
        s = Math.sqrt(
          Math.pow(s, 2) +
            Math.pow(point2cartographic.height - point1cartographic.height, 2)
        );
        return s;
      }
    },
    // 选中页面点击对象并删除
    removeEntity(viewer, handler) {
      let that = this;
      handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
      handler.setInputAction(function(movement) {
        handler.destroy();
        var pick = viewer.scene.pick(movement.position); //pick={primitive:{xx},id:{entity}}
        let id = pick.id.itemid;
        if (pick.id.plotType) {
          //军标绘制单个删除
          that.militaryPlotLayer.clearItem(pick.id.id);
          viewer.entities.remove(pick.id);
        } else if (id) {
          // 面积和线的单个删除
          let selectArr = viewer.entities.values.filter((item) => {
            if (item.itemid) {
              return item.itemid == id;
            }
          }); //viewer.entities.values为页面所有的entity
          selectArr.forEach((item) => {
            let pickDomid = viewer.entities.getById(item.id); //获取entity的id
            viewer.entities.remove(pickDomid); //使用id进行entity的del
          });
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    },
    // 后台返回坐标框选 参数解释(cesium实例化obj,框选数据数组,entity,图元对象val,唯一ID,不规则体的颜色只能是大写英文BLUE-RED-GREEN等)
    viewRectangle(viewer, data, entity, primitive, UID, color = "ORANGE") {
      let itemColor = Cesium.Color[color].withAlpha(0.5);
      if (!this[entity]) {
        let hei = null;
        let JavaArr = data.map((item) => {
          if (!hei || item[2] > hei) {
            hei = item[2]; //获取所有坐标的最高高度
          }
          return Cesium.Cartesian3.fromDegrees(item[0], item[1], item[2]); //经纬高度转化笛卡尔
        });
        // 绘制
        var polygonItem = viewer.entities.add({
          name: "后台传输的不规则图形",
          typename: "javaPolygon",
          UID,
          polygon: {
            hierarchy: new Cesium.PolygonHierarchy(JavaArr), //位置坐标集
            extrudedHeight: 0, //多边形的挤压面与椭球面之间的距离（以米为单位）
            perPositionHeight: true, //是否启用高度
            material: itemColor,
            outline: true, //是否添加外边框
            outlineColor: Cesium.Color.BLACK,
          },
        });
        var polyPositions = polygonItem.polygon.hierarchy.getValue(
          Cesium.JulianDate.now()
        ).positions;
        var polyCenter = Cesium.BoundingSphere.fromPoints(polyPositions).center; //中心点
        polyCenter = Cesium.Ellipsoid.WGS84.scaleToGeodeticSurface(polyCenter);
        polygonItem.position = polyCenter; //给予entiy中心点
        polygonItem.billboard = {
          image: this.JavaDataCenterIconUrl,
          width: 100,
          height: 100,
          sizeInMeters: true,
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          scale: 0.5,
        };
        this[entity] = polygonItem;
        // 为不规则图形创建雷达波纹图元(viewer,中心点,最大高度,图元val,唯一id)
        this.initLeiDaFn(viewer, polyCenter, hei, primitive, UID);
      }
      viewer.zoomTo(this[entity]); //视角定位到这个entity上
    },
    // 雷达的波纹特效
    initLeiDaFn(viewer, pos, hei, primitive, UID) {
      var scene = viewer.scene;
      var length = hei;
      var positionOnEllipsoid = pos;
      var modelMatrix = Cesium.Matrix4.multiplyByTranslation(
        Cesium.Transforms.eastNorthUpToFixedFrame(positionOnEllipsoid),
        new Cesium.Cartesian3(0.0, 0.0, length * 0.5),
        new Cesium.Matrix4()
      );
      // 先创建Geometry
      var cylinderGeometry = new Cesium.CylinderGeometry({
        length: length,
        topRadius: length * 0.5,
        bottomRadius: 0.0,
        vertexFormat:
          Cesium.MaterialAppearance.MaterialSupport.TEXTURED.vertexFormat,
      });
      // 创建GeometryInstance
      var redCone = new Cesium.GeometryInstance({
        geometry: cylinderGeometry,
        modelMatrix: modelMatrix,
      });
      //创建Primitive
      let clickHide = false;
      var radar = scene.primitives.add(
        new Cesium.Primitive({
          geometryInstances: [redCone],
          appearance: new Cesium.MaterialAppearance({
            // 自定义纹理
            material: new Cesium.Material({
              fabric: {
                type: { UID, clickHide },
                uniforms: {
                  color: new Cesium.Color(0.2, 1.0, 0.0, 1.0), //放射颜色
                  repeat: 30.0,
                  offset: 0.0,
                  thickness: 0.3,
                },
                source: `
                                uniform vec4 color;
                                uniform float repeat;
                                uniform float offset;
                                uniform float thickness;
                                czm_material czm_getMaterial(czm_materialInput materialInput)
                                {
                                    czm_material material = czm_getDefaultMaterial(materialInput);
                                    float sp = 1.0/repeat;
                                    vec2 st = materialInput.st;
                                    float dis = distance(st, vec2(0.5));
                                    float m = mod(dis + offset, sp);
                                    float a = step(sp*(1.0-thickness), m);
                                    material.diffuse = color.rgb;
                                    material.alpha = a * color.a;
                                    return material;
                                }
                            `,
              },
              translucent: true,
            }),
            faceForward: false, // 当绘制的三角面片法向不能朝向视点时，自动翻转法向，从而避免法向计算后发黑等问题
            closed: true, // 是否为封闭体，实际上执行的是是否进行背面裁剪
          }),
        })
      );
      this[primitive] = radar;
      // 动态修改雷达材质中的offset变量，从而实现动态效果。
      viewer.scene.preUpdate.addEventListener(function() {
        var offset = radar.appearance.material.uniforms.offset;
        offset -= 0.001;
        if (offset > 1.0) {
          offset = 0.0;
        }
        radar.appearance.material.uniforms.offset = offset;
      });
    },
    // 隐藏雷达以及其图元
    hideLeiDaFn(entity, primitive) {
      if (entity && primitive) {
        entity.show = false;
        entity.clickHide = true;
        primitive.show = false;
        primitive._material.type.clickHide = true;
      }
    },
    // 显示雷达以及其图元
    showLeiDaFn(entity, primitive) {
      if (entity && primitive) {
        entity.show = true;
        entity.clickHide = false;
        primitive.show = true;
        primitive._material.type.clickHide = false;
      }
    },
    // 热力图方法(viewer，矩形坐标，hot数据)
    heatmap(viewer, bounds, hotdata) {
      if (!this.HeadMapEntity) {
        console.log(111);
        let valueMin = 0; //设置热力图最小值
        let valueMax = 100; //设置热力图最大值
        // i初始化热力图
        let heatMap = CesiumHeatmap.create(
          viewer, // your cesium viewer
          bounds, // bounds for heatmap layer
          {
            maxOpacity: 0.75,
          }
        );
        heatMap.setWGS84Data(valueMin, valueMax, hotdata);
        this.HeadMapEntity = heatMap._layer;
      }
      viewer.zoomTo(this.HeadMapEntity);
    },
    // 显示hot
    showHot() {
      if (this.HeadMapEntity) {
        this.HeadMapEntity.show = true;
      }
    },
    // 隐藏hot
    hideHot() {
      if (this.HeadMapEntity) {
        this.HeadMapEntity.show = false;
      }
    },
    // 点击地图获取当前经纬度并填写信息后创建billboard
    cesiumCreateToolTips(viewer, handler) {
      let that = this;
      handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
      // 标点地图获取经纬度
      handler.setInputAction(function(movement) {
        handler.destroy();
        that.isShowToolTips = true;
        var ray = viewer.camera.getPickRay(movement.position);
        var earthPosition = viewer.scene.globe.pick(ray, viewer.scene);
        // 进行笛卡尔坐标的转换
        var ellipsoid = viewer.scene.globe.ellipsoid;
        var cartographic = ellipsoid.cartesianToCartographic(earthPosition);
        that.DIKAER = earthPosition;
        that.LON = Cesium.Math.toDegrees(cartographic.longitude); //经
        that.LAT = Cesium.Math.toDegrees(cartographic.latitude); //纬
        that.ALT = cartographic.height; //高
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    },
    // 根据坐标创建广告牌
    cesiumCreateItem(viewer) {
      let val = this.tooltipsVal ? this.tooltipsVal : "标记点";
      let pos = this.DIKAER;
      let htmlJSX = `${this.tooltipsVal}\n当前笛卡尔:\n${pos}`;
      console.log(pos);
      viewer.entities.add({
        name: val,
        position: pos,
        typename: "billboard",
        label: {
          //文字标签
          text: htmlJSX,
          show: true,
          font: "500 26px Helvetica", // 15pt monospace
          scale: 0.5,
          style: Cesium.LabelStyle.FILL,
          fillColor: Cesium.Color.BLACK,
          pixelOffset: new Cesium.Cartesian2(0, 25), //偏移量
          showBackground: true,
          backgroundColor: new Cesium.Color(0.5, 0.6, 1, 1.0),
          backgroundPadding: new Cesium.Cartesian2(10, 10),
        },
        billboard: {
          image: this.iconUrl,
          width: 100,
          height: 100,
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          scale: 0.5,
        },
      });
      this.isShowToolTips = false;
    },
    // 常驻点击事件
    cesiumShowItemDesc(viewer, handler) {
      let that = this;
      handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
      // 鼠标左键
      handler.setInputAction(function(movement) {
        // console.log(viewer.scene.primitives);
        var pick = viewer.scene.pick(movement.position);
        that.leidaPos = {};
        that.showLeidaInfo = false;
        that.guijiPos = {};
        that.showGuijiInfo = false;
        if (pick && pick.id.typename) {
          // 点击广告牌显示详情
          if (pick.id.typename === "billboard") {
            let flag = pick.id.label.show._value;
            pick.id.label.show = !flag;
          }
          // 框选的工具栏
          if (pick.id.typename === "javaPolygon") {
            let ray = viewer.camera.getPickRay(movement.position);
            let earthPosition = viewer.scene.globe.pick(ray, viewer.scene); //获取点击点的经纬度
            let pos = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
              viewer.scene,
              earthPosition
            );
            let leftpx = pos.x.toFixed(0) + "px";
            let toppx = pos.y.toFixed(0) + "px";
            that.leidaPos = { left: leftpx, top: toppx };
          }
          if (pick.id.typename === "GuiJiBillBoard") {
            let ray = viewer.camera.getPickRay(movement.position);
            let earthPosition = viewer.scene.globe.pick(ray, viewer.scene); //获取点击点的经纬度
            let pos = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
              viewer.scene,
              earthPosition
            );
            that.guijiInfoObj = pick.id.guijiInfoObj;
            let leftpx = pos.x.toFixed(0) + "px";
            let toppx = pos.y.toFixed(0) + "px";
            that.guijiPos = { left: leftpx, top: toppx };
          }
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
      // 鼠标中建
      handler.setInputAction(function(movement) {
        that.leidaPos = {};
        that.showLeidaInfo = false;
        that.guijiPos = {};
        that.showGuijiInfo = false;
        that.guijiInfoObj = {};
      }, Cesium.ScreenSpaceEventType.WHEEL);
      // 鼠标左键按下
      handler.setInputAction(function(movement) {
        that.leidaPos = {};
        that.showLeidaInfo = false;
        that.guijiPos = {};
        that.showGuijiInfo = false;
        that.guijiInfoObj = {};
      }, Cesium.ScreenSpaceEventType.LEFT_DOWN);
      // 鼠标右键按下
      handler.setInputAction(function(movement) {
        that.leidaPos = {};
        that.showLeidaInfo = false;
        that.guijiPos = {};
        that.showGuijiInfo = false;
        that.guijiInfoObj = {};
      }, Cesium.ScreenSpaceEventType.RIGHT_DOWN);
      // 鼠标移动
      handler.setInputAction(function(movement) {
        var pickedFeature = viewer.scene.pick(movement.endPosition);
        if (pickedFeature) {
          if (pickedFeature.id) {
            let entityFlag = pickedFeature.id.typename === "javaPolygon";
            if (entityFlag) {
              let UID = pickedFeature.id.UID;
              that.primitiveFilterArr = viewer.scene.primitives._primitives.filter(
                (item) => {
                  return item._material;
                }
              );
              that.entityFilterArr = viewer.entities.values.filter((item) => {
                return item.typename == "javaPolygon";
              });
              that.primitiveFilterArr.forEach((item) => {
                if (item._material.type.UID !== UID) {
                  item.show = false;
                }
              });
              that.entityFilterArr.forEach((item) => {
                if (item.UID !== UID) {
                  item.show = false;
                }
              });
            }
          }
        } else {
          if (that.primitiveFilterArr && that.entityFilterArr) {
            that.primitiveFilterArr.forEach((item) => {
              if (!item._material.type.clickHide) {
                item.show = true;
              }
            });
            that.entityFilterArr.forEach((item) => {
              if (!item.clickHide) {
                item.show = true;
              }
            });
          }
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    },
    // 键盘回退事件-line
    KeyboardBackLineFn(pos, arr) {
      viewer.entities.remove(arr[arr.length - 1]);
      arr.pop();
      let indexNum = pos.length - 2;
      if (indexNum < 0) {
        indexNum = 0;
      }
      pos.splice(indexNum, 1);
      console.log(pos);
      if (pos.length <= 1) {
        pos = [];
        arr = [];
      }
    },
    // 键盘回退事件-area
    KeyboardBackAreaFn(pos, arr, tempArr) {
      viewer.entities.remove(arr[arr.length - 1]); //删除前一个的point-entity
      arr.pop(); //同步arr
      tempArr.pop();
      let indexNum = pos.length - 2;
      if (indexNum < 0) {
        indexNum = 0;
      }
      pos.splice(indexNum, 1);
      console.log(pos);
      if (pos.length <= 1) {
        pos = [];
        arr = [];
      }
    },
    // 显隐雷达info弹窗
    isShowLeidaInfoFn() {
      this.showLeidaInfo = true;
    },
    // 显隐轨迹info弹窗
    isShowGuijiInfoFn() {
      this.showGuijiInfo = true;
    },
    // 2d/3d切换
    changeMapTypeFn() {
      if (this.is3DFlag) {
        this.is3DFlag = false;
        viewer.scene.morphTo2D(2); //2为过度秒数
      } else {
        this.is3DFlag = true;
        viewer.scene.morphTo3D(2);
      }
    },
  },
};
</script>

<style>
.wrap,
#ball,
#heatmap {
  width: 100%;
  height: 100%;
}
.btn-wrap {
  position: fixed;
  top: 5%;
  right: 5%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.btn {
  width: 50px;
  height: 50px;
  background-color: #fff;
  color: #000;
  font-size: 20px;
  line-height: 50px;
  text-align: center;
  margin-bottom: 10px;
}
.btn-other {
  position: relative;
}
.btnleft {
  position: absolute;
  left: -120px;
}
.btnright {
  position: absolute;
  left: -60px;
}
.createToolTips-wrap {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
}
.createToolTips {
  width: 500px;
  height: 500px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  background-color: #f5d5a5;
}
.createToolTips-title {
  width: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 16px;
  line-height: 30px;
  color: #000;
}
.tooltipsInput {
  width: 80%;
  height: 30px;
  box-sizing: border-box;
  padding: 0 30px;
  color: #000;
  background-color: #ccc;
}
.createToolTips-btns {
  width: 80%;
  height: 40px;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.createToolTips-btns > div {
  width: 40%;
  height: 40px;
  font-size: 20px;
  line-height: 40px;
  background-color: aqua;
  border-radius: 12px;
}
.leidaTool {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: #fff;
  position: fixed;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}
.leidaTool > div {
  width: 50px;
  height: 30px;
  line-height: 30px;
  background-color: aqua;
}
.leidaTool-info {
  width: 150px;
  height: 50px;
  background: #ff0000;
  color: #000;
  font-size: 16px;
  line-height: 20px;
  position: fixed;
  z-index: 9;
}
.guiJI {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: burlywood;
  position: fixed;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}
.guiJI > div {
  width: 30px;
  height: 30px;
  line-height: 30px;
  background-color: aqua;
  border-radius: 50%;
}
.guiJIInfo {
  width: 400px;
  background: goldenrod;
  color: #000;
  font-weight: 700;
  font-size: 16px;
  line-height: 20px;
  position: fixed;
  z-index: 9;
}
</style>
