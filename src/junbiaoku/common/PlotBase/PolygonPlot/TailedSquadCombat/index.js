// 分队战斗尾 标绘类

import * as PlotUtils from "../../PlotUtils/utils2d"
import * as Constants from "../../Constants"
import PlotTypes from "../../PlotTypes"

import AttackArrow from "../AttackArrow"
export default class TailedSquadCombat extends AttackArrow {

    constructor(viewer, baseInfo, properties) {
        super(viewer, baseInfo, properties);
        this.baseInfo.plotName = PlotTypes.TAILED_SQUAD_COMBAT;
    }

    initConsts() {
        this.headHeightFactor = 0.18;
        this.headWidthFactor = 0.3;
        this.neckHeightFactor = 0.85;
        this.neckWidthFactor = 0.15;
        this.tailWidthFactor = 0.1;
        this.swallowTailFactor = 1;
        this.swallowTailPnt = null;
    }

    generate() {
        var count = this.getPointCount();
        if (count < 2) {
            return;
        }
        var pnts = this.getPoints();
        var tailPnts = this.getTailPoints(pnts);
        var headPnts = this.getArrowHeadPoints(pnts, tailPnts[0], tailPnts[2]);
        var neckLeft = headPnts[0];
        var neckRight = headPnts[4];
        var bodyPnts = this.getArrowBodyPoints(pnts, neckLeft, neckRight, this.tailWidthFactor);
        var count = bodyPnts.length;
        var leftPnts = [tailPnts[0]].concat(bodyPnts.slice(0, count / 2));
        leftPnts.push(neckLeft);
        var rightPnts = [tailPnts[2]].concat(bodyPnts.slice(count / 2, count));
        rightPnts.push(neckRight);

        leftPnts = PlotUtils.getQBSplinePoints(leftPnts);
        rightPnts = PlotUtils.getQBSplinePoints(rightPnts);

        this.generatePositions(leftPnts.concat(headPnts, rightPnts.reverse(), [tailPnts[1], leftPnts[0]]));
    }

    getTailPoints(points) {
        var allLen = PlotUtils.getBaseLength(points);
        var tailWidth = allLen * this.tailWidthFactor;
        var tailLeft = PlotUtils.getThirdPoint(points[1], points[0], Constants.HALF_PI, tailWidth, false);
        var tailRight = PlotUtils.getThirdPoint(points[1], points[0], Constants.HALF_PI, tailWidth, true);
        var len = tailWidth * this.swallowTailFactor;
        var swallowTailPnt = PlotUtils.getThirdPoint(points[1], points[0], 0, len, true);
        return [tailLeft, swallowTailPnt, tailRight];
    }
}