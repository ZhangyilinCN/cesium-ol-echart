import LayerBase from "../Base";
import PlotFactory from "../../PlotBase/PlotFactory";

export default class MilitaryPlotLayer extends LayerBase {
  constructor(viewer) {
    super(viewer);
  }

  initPlots(data) {
    this.clear(); //清空所有
    data.forEach((item) => {
      const plot = JSON.parse(item);
      this.addPlot(plot);
    });
  }

  //绘制的时候 通过该方法添加
  addPlot(plot) {
    //绘制结束返回的是一个GeoPlot对象 通过该对象的参数构造一个新的对象 不能直接使用该对象
    let newPlot = PlotFactory.createPlot(
      this.viewer,
      plot.baseInfo.plotName,
      plot.baseInfo,
      plot.properties
    );
    this.plots.push(newPlot);
    return newPlot;
  }

  toJSON() {
    let arr = [];
    this.plots.forEach((item) => {
      arr.push(item.toJSON());
    });
    return arr;
  }
}
