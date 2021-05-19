<template>
  <div style="width: 100%; height: 100%">
    <div ref="earthContainer" style="width: 100%; height: 100%"></div>
    <cesium-draw
      ref="drawManager"
      :extendMarkerImage="images"
      :extendMarkerModel="model"
    ></cesium-draw>
    <div style="position: absolute; left: 18px; top: 18px">
      <button @click="capture()">截图</button>
    </div>
  </div>
</template>

<script>
let html2canvas = require("../utils/html2canvas.js");
/* eslint-disable */
let imageurl = require("../assets/target/装甲车.svg");
import { baseService } from "@/utils/configHttp";
import cesiumDraw from "cesium-draw";
import "@/styles/dark.css";
// import "cesium-draw/dist/theme/default.css";
let lastTime = null;
let lastPosition = {
  longitude: "",
  latitude: "",
};
export default {
  components: {
    cesiumDraw,
  },
  data() {
    return {
      message: "页面加载于 " + new Date().toLocaleString(),
      _earth: undefined, // 注意：Earth和Cesium的相关变量放在vue中，必须使用下划线作为前缀！
      _bgImagery: undefined,
      imageurl: "../assets/target/装甲车.svg",
      viewer: null,
      images: [
        "./static/images/markers/1.png",
        "./static/images/markers/2.png",
        "./static/images/markers/3.png",
        "./static/images/markers/4.png",
        "./static/images/markers/5.png",
      ],
      model: [
        {
          id: "model0",
          name: "tower",
          thumb: "thumb.png",
          url: "static/model/Wood_Tower.gltf",
        },
        {
          id: "model1",
          name: "people",
          url: "static/model/Cesium_Man.gltf",
        },
      ],
    };
  },
  // 1.1 资源创建
  mounted() {
    if (typeof XE !== "undefined") {
      // 1.1.1 创建地球
      var earth = new XE.Earth(this.$refs.earthContainer, {
        contextOptions: {
          webgl: {
            // alpha: true,
            // depth: true,
            // stencil: true,
            // antialias: true,
            // premultipliedAlpha: true,
            //通过canvas.toDataURL()实现截图需要将该项设置为true
            preserveDrawingBuffer: true,
            // failIfMajorPerformanceCaveat: true,
          },
        },
      });

      // 1.1.2 添加默认地球影像
      earth.sceneTree.root = {
        children: [
          {
            czmObject: {
              name: "默认离线影像",
              xbsjType: "Imagery",
              xbsjImageryProvider: {
                createTileMapServiceImageryProvider: {
                  url: XE.HTML.cesiumDir + "Assets/Textures/NaturalEarthII",
                  fileExtension: "jpg",
                },
                type: "createTileMapServiceImageryProvider",
              },
            },
          },
        ],
      };
      let viewer = earth.czm.viewer;

      this.$refs.drawManager.init(viewer);

      this.AddPoint(earth, {
        longitude: 108.9567474,
        latitude: 34.0182464,
        height: 524.57,
        value: 1,
        imageurl: require("../assets/target/装甲车.svg"),
      });
      // 测试获取坐标点
      var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
      handler.setInputAction(function (movement) {
        var position = viewer.scene.camera.pickEllipsoid(
          movement.position,
          viewer.scene.globe.ellipsoid
        );
        console.log(99999, position);

        // Cartesian3转WGS84坐标
        var ellipsoid = viewer.scene.globe.ellipsoid;
        var xyz = new Cesium.Cartesian3(position.x, position.y, position.z);
        var wgs84 = ellipsoid.cartesianToCartographic(xyz);

        // var cartesian2 = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
        //   viewer.scene,
        //   position
        // );

        console.log(
          9900000,
          Cesium.Math.toDegrees(wgs84.longitude),
          Cesium.Math.toDegrees(wgs84.latitude)
        );
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

      // handler.setInputAction(function (movement) {
      //   var ray = viewer.camera.getPickRay(movement.position);
      //   var position = viewer.scene.globe.pick(ray, viewer.scene);
      //   console.log(9900000, position);
      // }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

      // let i = 0.01;
      // setInterval(() => {
      //   viewer.entities.removeAll();
      //   this.AddPoint(earth, {
      //     longitude: 108.9567474 + i,
      //     latitude: 34.0182464 + i,
      //     height: 524.57,
      //     value: 1,
      //     imageurl: require("../assets/target/装甲车.svg")
      //   });
      //   i = i + 0.06 * -Math.random();
      //   this.AddPoint(earth, {
      //     longitude: 108.9667474 + i,
      //     latitude: 34.2182464 + i,
      //     height: 524.57,
      //     value: 2,
      //     imageurl: require("../assets/target/装甲车.svg")
      //   });
      //   i = i + 0.06 * Math.random();
      //   this.AddPoint(earth, {
      //     longitude: 108.9567474 + i,
      //     latitude: 34.3182464 + i,
      //     height: 524.57,
      //     value: 3,
      //     imageurl: require("../assets/target/装甲车.svg")
      //   });
      //   i = i + 0.06 * -Math.random();
      //   this.AddPoint(earth, {
      //     longitude: 108.9567474 + i,
      //     latitude: 34.2182464 + i,
      //     height: 524.57,
      //     value: 4,
      //     imageurl: require("../assets/target/装甲车.svg")
      //   });
      //   i = i + 0.06 * Math.random();
      //   this.AddPoint(earth, {
      //     longitude: 108.8567474 + i,
      //     latitude: 34.2182464 + i,
      //     height: 524.57,
      //     value: 5,
      //     imageurl: require("../assets/target/装甲车.svg")
      //   });
      //   i = i + 0.06 * Math.random();
      //   console.log(9000);
      // }, 1000);
    } else if (typeof Cesium !== "undefined") {
      let viewer = new Cesium.Viewer(this.$refs.earthContainer);
    }
  },
  methods: {
    // async getBase64(val) {
    //   return await this.$imgToBase64(val);
    // },
    AddPoint(earth, e) {
      var pinBuilder = new Cesium.XbsjPinBuilder();
      const entity = earth.czm.viewer.entities.add({
        id: e.id,
        position: Cesium.Cartesian3.fromDegrees(
          e.longitude,
          e.latitude
          // e.height
        ),
        // point: {
        //   pixelSize: 1,
        //   outlineWidth: 0,
        // },
        // polyline: {
        //   positions: [
        //     Cesium.Cartesian3.fromDegrees(
        //       e.longitude,
        //       e.latitude,
        //       e.height - 50
        //     ),
        //     Cesium.Cartesian3.fromDegrees(e.longitude, e.latitude, e.height),
        //   ],
        //   width: 2.0,
        //   material: Cesium.Color.BLUE,
        // },
        billboard: {
          // image: pinBuilder.fromColor(
          //   new Cesium.Color(0.2, 0.2, 0.2, 1.0),
          //   50,
          //   Cesium.Color.WHITE
          // ),
          // image: imageurl,
          image: e.imageurl,
          width: 60,
          height: 70,
          // color: new Cesium.Color(1, 0, 0, 1),
          verticalOrigin: Cesium.VerticalOrigin.MIDDLE,
          scale: 1,
          show: true,
        },
        // label: {
        //   text: e.value,
        //   style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        //   font: "20px 微软雅黑",
        //   fillColor: Cesium.Color.WHITE,
        //   outlineColor: Cesium.Color.BLACK,
        //   outlineWidth: 6,
        //   scale: 1,
        //   verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        //   horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        // },
      });
      if (
        // (new Date().getTime() - lastTime > 3000 &&
        //   (lastPosition.longitude != e.longitude ||
        //     lastPosition.latitude != e.latitude)) ||
        // !lastTime
        !lastTime
      ) {
        var position = Cesium.Cartesian3.fromDegrees(e.longitude, e.latitude);
        earth.czm.viewer.camera.flyToBoundingSphere(
          new Cesium.BoundingSphere(position, 3000000)
        );
        lastTime = new Date().getTime();
        lastPosition = e;
      }
      // earth.czm.viewer.flyTo(entity, {
      //   offset: {
      //     heading: Cesium.Math.toRadians(0.0),
      //     pitch: Cesium.Math.toRadians(-25),
      //     range: 50000,
      //   },
      // });

      return entity;
    },
    capture() {
      html2canvas(this.$refs.earthContainer).then(function (canvas) {
        let src = canvas.toDataURL("image/jpeg");
        console.log(8888, src);
        baseService
          .post("/screenShort", {
            type: "mbst",
            base64: src,
          })
          .then((res) => {
            console.log(890, res);
          })
          .catch((err) => {
            alert(err.msg);
          });
      });
      // var jietu = document.getElementsByTagName("canvas")[1];
      // let url = jietu.toDataURL("image/png");
      // console.log(9999, jietu, url);
    },
  },
  // 1.2 资源销毁
  beforeDestroy() {
    // vue程序销毁时，需要清理相关资源
    this._earth = this._earth && this._earth.destroy();
  },
};
</script>