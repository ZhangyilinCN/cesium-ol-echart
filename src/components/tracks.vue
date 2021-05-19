<template>
  <div>
    <div class="btn-con">
      <el-button @click="remove">清除航迹</el-button>
      <el-button @click="toggleTracks(1)">航迹1</el-button>
      <el-button @click="toggleTracks(2)">航迹2</el-button>
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
    viewer() {
      var dataSource = new Cesium.CzmlDataSource();
      viewer.dataSources.add(dataSource);
      this.dataSource = dataSource;
      this.drawTracks(this.coordinate1);
      this.drawTracks(this.coordinate2);
      this.forEachBillboard(this.coordinate1.pointPos);
      this.forEachBillboard(this.coordinate2.pointPos);
    },
  },
  data() {
    return {
      dataSource: null,
      iconUrl: require("../assets/images/dizhi.png"),
      coordinate1: {
        id: "航迹1",
        value: [
          [105.57578235554087, 5.617503101861992, 0],
          [108.20016254609003, 7.7453789320369815, 10000],
          [110.22164458475626, 9.873254762211971],
          [111.85301605455709, 12.46217035559154],
          [112.63323719228792, 14.554581588596946],
          [113.05881235832291, 17.604536945181096],
          [113.23613534417083, 20.157987941391085],
        ],
        pointPos: [
          {
            pos: [110.22339794434106, 9.87402192064078, -3.564808220811168],
            name: "北京",
            desc: "北京欢迎你",
          },
          {
            pos: [111.39643301471206, 11.752456262525774, -3.416800188831229],
            name: "上海",
            desc: "上海上海上海上海上海上海上海上海上海",
          },
        ],
      },
      coordinate2: {
        id: "航迹2",
        value: [
          [107.72751138342944, 3.3205310562426575],
          [107.703764995049, 5.552813785572937],
          [108.01730967139864, 9.040755550151502],
          [117.2844718183747, 12.563576732375852],
          [117.59838657718677, 16.295674420474914],
          [119.44699571241341, 19.748736767407692],
          [123.24885223580405, 20.760239879135476],
        ],
        pointPos: [
          {
            pos: [107.703764995049, 5.552813785572937, -0.6016362207841535],
            name: "广州",
            desc: "预计到达广州需要30分钟",
          },
          {
            pos: [108.01730967139864, 9.040755550151502, -0.20437692930326373],
            name: "佛山",
            desc: "佛山哈哈哈",
          },
          {
            pos: [119.44699571241341, 19.748736767407692, -0.14195514880861904],
            name: "深圳",
            desc: "深圳冲冲冲冲巴拉巴拉",
          },
        ],
      },
    };
  },
  methods: {
    drawTracks(coordinate) {
      // 处理经纬度坐标转换三维坐标
      let coordinate_cartesian3 = [];
      coordinate.value.forEach((item) => {
        let result = Cesium.Cartesian3.fromDegrees(...item);
        coordinate_cartesian3.push(result.x);
        coordinate_cartesian3.push(result.y);
        coordinate_cartesian3.push(result.z);
      });
      // console.log(111, coordinate_cartesian3);
      let coordinate_cartesian3_with_time = [];
      coordinate.value.forEach((item, index) => {
        let result = Cesium.Cartesian3.fromDegrees(...item);
        // coordinate_cartesian3_with_time.push(
        //   "2018-07-19T15:" + index + 1 + ":00Z"
        // );
        coordinate_cartesian3_with_time.push(index + 1);
        coordinate_cartesian3_with_time.push(result.x);
        coordinate_cartesian3_with_time.push(result.y);
        coordinate_cartesian3_with_time.push(result.z);
      });
      // console.log(222, coordinate_cartesian3_with_time);
      // 跟踪航迹时的视角
      // console.log(
      //   333,
      //   new Cesium.Cartesian3.fromDegrees(
      //     105.57578235554087,
      //     5.617503101861992,
      //     100
      //   )
      // );
      // let cartesian = new Cesium.Cartesian3.fromDegrees(117, 30, 150.0);
      // let viewFrom = [cartesian.x, cartesian.y, cartesian.z];
      // let viewFrom = [1, 1, 150000.0];
      var czml = [
        {
          id: "document",
          version: "1.0",
          clock: {
            interval: "2012-08-04T10:00:00Z/2012-08-04T10:00:07Z",
            currentTime: "2012-08-04T10:00:00Z",
            multiplier: 1,
          },
        },
        {
          id: "Polyline" + coordinate.id,
          polyline: {
            positions: {
              cartesian: coordinate_cartesian3,
            },
            material: {
              polylineOutline: {
                color: {
                  rgba: [255, 255, 0, 255],
                },
                outlineColor: {
                  rgba: [0, 0, 0, 255],
                },
                outlineWidth: 2,
              },
            },
            width: 4,
          },
        },
        {
          id: "CesiumMilkTruck" + coordinate.id,
          model: {
            gltf: "./models/CesiumMilkTruck.glb",
            // scale: 100,
            minimumPixelSize: 40,
            // maximumScale: 50,
          },
          orientation: {
            velocityReference: "#position",
          },
          // viewFrom: {
          //   cartesian: [-2080, -1715, 779],
          // },
          // path: {
          //   material: {
          //     solidColor: {
          //       color: {
          //         interval: "2012-08-04T10:00:00Z/2012-08-04T10:00:07Z",
          //         rgba: [255, 255, 0, 255],
          //       },
          //     },
          //   },
          //   width: [
          //     {
          //       interval: "2012-08-04T10:00:00Z/2012-08-04T10:00:07Z",
          //       number: 5.0,
          //     },
          //   ],
          //   show: [
          //     {
          //       interval: "2012-08-04T10:00:00Z/2012-08-04T10:00:07Z",
          //       boolean: true,
          //     },
          //   ],
          // },
          position: {
            interpolationAlgorithm: "LAGRANGE",
            interpolationDegree: 1,
            epoch: "2012-08-04T10:00:00Z",
            cartesian: coordinate_cartesian3_with_time,
          },
        },
        // {
        //   id: "billboard",
        //   billboard: {
        //     image:
        //       "data:image/png;base64,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",
        //     scale: 1,
        //     eyeOffset: {
        //       cartesian: [0.0, 0.0, -10.0],
        //     },
        //   },
        //   position: {
        //     // epoch: "2012-08-04T10:00:00Z",
        //     cartesian: coordinate_cartesian3,
        //   },
        // },
      ];
      // var dataSourcePromise = Cesium.CzmlDataSource.load(czml);
      this.dataSource.process(czml).then(() => {
        // entity = dataSource.entities.getById("CesiumMilkTruck");
        //   positionProperty = entity.position;
        // let target = dataSource.entities.getById("CesiumMilkTruck");
        let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        handler.setInputAction((event) => {
          var pick = viewer.scene.pick(event.position);
          if (pick) {
            if (pick.id.id.indexOf("CesiumMilkTruck") > -1) {
              // alert(99);
              // target.viewFrom = new Cesium.Cartesian3.fromDegrees(105, 5, 200);
              let target = this.dataSource.entities.getById(pick.id.id);
              target.viewFrom = new Cesium.Cartesian3(-3000000, 0, 0);
              viewer.trackedEntity = target;
            }
          }
          // alert(88);
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        // viewer.trackedEntity = dataSource.entities.getById("CesiumMilkTruck");
      });

      // viewer.camera.setView({
      //   destination: new Cesium.Cartesian3(
      //     1216403.8845586285,
      //     -4736357.493351395,
      //     4081299.715698949
      //   ),
      //   orientation: new Cesium.HeadingPitchRoll(
      //     4.2892217081808806,
      //     -0.4799070147502502,
      //     6.279789177843313
      //   ),
      //   endTransform: Cesium.Matrix4.IDENTITY,
      // });
    },
    toggleTracks(val) {
      this.remove();
      this.forEachBillboard(this["coordinate" + val].pointPos);
      this.drawTracks(this["coordinate" + val]);
    },
    remove() {
      if (this.dataSource) {
        this.dataSource.entities.removeAll();
        this.clearBillboard();
      }
    },
    // 循环绘制广告牌
    forEachBillboard(arr) {
      let newarr = JSON.parse(JSON.stringify(arr));
      newarr.forEach((item) => {
        let DIKAER = Cesium.Cartesian3.fromDegrees(
          item.pos[0],
          item.pos[1],
          item.pos[2]
        );
        // let htmlJSX = `${item.name}\n${item.desc}`;
        viewer.entities.add({
          name: "GuiJiBillBoard",
          position: DIKAER,
          typename: "GuiJiBillBoard",
          guijiInfoObj: {
            lon: item.pos[0],
            lat: item.pos[1],
            ALT: item.pos[2],
            DIKAER,
            name: item.name,
            desc: item.desc,
          },
          // label: {
          //   //文字标签
          //   text: htmlJSX,
          //   show: false,
          //   font: "500 26px Helvetica", // 15pt monospace
          //   scale: 0.5,
          //   style: Cesium.LabelStyle.FILL,
          //   fillColor: Cesium.Color.BLACK,
          //   pixelOffset: new Cesium.Cartesian2(0, 20), //偏移量
          //   showBackground: true,
          //   backgroundColor: new Cesium.Color(0.5, 0.6, 1, 1.0),
          //   backgroundPadding: new Cesium.Cartesian2(10, 10),
          // },
          billboard: {
            image: this.iconUrl,
            width: 100,
            height: 100,
            horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            scale: 0.5,
          },
        });
      });
    },
    // 清除关于线路的广告牌
    clearBillboard() {
      let name = "GuiJiBillBoard";
      let selectArr = viewer.entities.values.filter((item) => {
        return item.name == name;
      });
      selectArr.forEach((item) => {
        let pickDomid = viewer.entities.getById(item.id);
        viewer.entities.remove(pickDomid);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.btn-con {
  position: fixed;
  top: 10px;
  left: 10px;
}
</style>
