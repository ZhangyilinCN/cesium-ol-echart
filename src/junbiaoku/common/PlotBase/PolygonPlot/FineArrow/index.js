// 直箭头标绘类

import * as PlotUtils from "../../PlotUtils/utils2d"
import * as Constants from "../../Constants"
import PlotTypes from "../../PlotTypes"
import Polygon from "../Polygon"
export default class FineArrow extends Polygon {

    constructor(viewer, baseInfo, properties) {
        super(viewer, baseInfo, properties);
        this.baseInfo.plotName = PlotTypes.FINE_ARROW;
    }

    initConsts() {
        this.tailWidthFactor = 0.1; //0.15;
        this.neckWidthFactor = 0.2;
        this.headWidthFactor = 0.25;
        this.headAngle = Math.PI / 8.5;
        this.neckAngle = Math.PI / 13;
        this.fixPointCount = 2;
    }

    generate() {
        var count = this.getPointCount();
        if (count < 2) {
            return;
        }
        var pnts = this.getPoints();
        var pnt1 = pnts[0];
        var pnt2 = pnts[1];
        var len = PlotUtils.getBaseLength(pnts);
        var tailWidth = len * this.tailWidthFactor;
        var neckWidth = len * this.neckWidthFactor;
        var headWidth = len * this.headWidthFactor;
        var tailLeft = PlotUtils.getThirdPoint(pnt2, pnt1, Constants.HALF_PI, tailWidth, true);
        var tailRight = PlotUtils.getThirdPoint(pnt2, pnt1, Constants.HALF_PI, tailWidth, false);
        var headLeft = PlotUtils.getThirdPoint(pnt1, pnt2, this.headAngle, headWidth, false);
        var headRight = PlotUtils.getThirdPoint(pnt1, pnt2, this.headAngle, headWidth, true);
        var neckLeft = PlotUtils.getThirdPoint(pnt1, pnt2, this.neckAngle, neckWidth, false);
        var neckRight = PlotUtils.getThirdPoint(pnt1, pnt2, this.neckAngle, neckWidth, true);
        var pList = [tailLeft, neckLeft, headLeft, pnt2, headRight, neckRight, tailRight];

        this.generatePositions(pList);
    }
}