import PlotBase from "../../PlotBase";
import PlotTypes from "../../PlotTypes";

//折线标绘 一般不用这个线 因为高度是统一的
export default class Polyline extends PlotBase {
  constructor(viewer, baseInfo, properties) {
    super(viewer, baseInfo, properties);
    this.baseInfo.plotName = PlotTypes.POLYLINE;
    this.minPointCount = 2;
    this.generateEntity();
  }

  //构造Entity
  generateEntity() {
    this.lineEntity = this.viewer.entities.add({
      plotType: "MilitaryPlot",
      plotCode: this.baseInfo.plotCode,
      polyline: {
        positions: new Cesium.CallbackProperty((e) => {
          return this.positions;
        }, false),
      },
    });
  }

  generate() {
    var count = this.getPointCount();
    if (count < 2) {
      return;
    }
    this.generatePositions(this.points);
  }

  //移除标绘对象
  remove() {
    this.viewer.entities.remove(this.lineEntity);
  }
}
