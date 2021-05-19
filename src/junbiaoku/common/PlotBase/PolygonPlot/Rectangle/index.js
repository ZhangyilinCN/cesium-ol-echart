// 矩形标绘类 
import Polygon from "../Polygon"
import PlotTypes from "../../PlotTypes"
export default class Rectangle extends Polygon {

    constructor(viewer, baseInfo, properties) {
        super(viewer, baseInfo, properties);
        this.baseInfo.plotName = PlotTypes.RECTANGLE;

    }

    initConsts() {
        this.fixPointCount = 2;
    }

    generate() {
        var count = this.getPointCount();
        if (count < 2) {
            return;
        } else {
            var pnt1 = this.baseInfo.points[0];
            var pnt2 = this.baseInfo.points[1];
            var xmin = Math.min(pnt1[0], pnt2[0]);
            var xmax = Math.max(pnt1[0], pnt2[0]);
            var ymin = Math.min(pnt1[1], pnt2[1]);
            var ymax = Math.max(pnt1[1], pnt2[1]);
            var tl = [xmin, ymax];
            var tr = [xmax, ymax];
            var br = [xmax, ymin];
            var bl = [xmin, ymin];
            this.generatePositions([tl, tr, br, bl]);
        }
    }
}