import PlotBase from "../../PlotBase";
import PlotTypes from "../../PlotTypes";
//点标绘
export default class Marker extends PlotBase {
  constructor(viewer, baseInfo, properties) {
    super(viewer, baseInfo, properties);
    this.baseInfo.plotName = PlotTypes.MARKER;
    this.generateEntity();
    this.fixPointCount = 1;
  }

  //构造Entity
  generateEntity() {
    this.pointEntity = this.viewer.entities.add({
      plotType: "MilitaryPlot",
      plotCode: this.baseInfo.plotCode,
      position: new Cesium.CallbackProperty((e) => {
        return this.positions[0];
      }, false),
      billboard: {
        image: "../../../static/images/Plot/location.png",
        scaleByDistance: new Cesium.NearFarScalar(300, 1, 1200, 0.4), //设置随图缩放距离和比例
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 10000), //设置可见距离 10000米可见
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      },
    });
  }

  generate() {
    var count = this.getPointCount();
    if (count < 1) {
      return;
    }
    this.generatePositions(this.points);
  }

  //移除标绘对象
  remove() {
    this.viewer.entities.remove(this.pointEntity);
  }
}
