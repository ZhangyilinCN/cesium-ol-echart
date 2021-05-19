// 进攻方向尾翼 xiequan 
import * as PlotUtils from "../../PlotUtils/utils2d"

import AttackArrow from "../AttackArrow"
import PlotTypes from "../../PlotTypes"

export default class TailedAttackArrow extends AttackArrow {

    constructor(viewer, baseInfo, properties) {
        super(viewer, baseInfo, properties);
        this.baseInfo.plotName = PlotTypes.TAILED_ATTACK_ARROW;

    }

    initConsts() {
        this.headHeightFactor = 0.18;
        this.headWidthFactor = 0.3;
        this.neckHeightFactor = 0.85;
        this.neckWidthFactor = 0.15;
        this.tailWidthFactor = 0.1;
        this.headTailFactor = 0.8;
        this.swallowTailFactor = 1;
        this.swallowTailPnt = null;
    }

    generate() {
        var count = this.getPointCount();
        if (count < 2) {
            return;
        }
        if (this.getPointCount() == 2) {
            this.generatePositions(this.baseInfo.points);
            return;
        }
        var pnts = this.getPoints();
        var tailLeft = pnts[0];
        var tailRight = pnts[1];
        if (PlotUtils.isClockWise(pnts[0], pnts[1], pnts[2])) {
            tailLeft = pnts[1];
            tailRight = pnts[0];
        }
        var midTail = PlotUtils.mid(tailLeft, tailRight);
        var bonePnts = [midTail].concat(pnts.slice(2));
        var headPnts = this.getArrowHeadPoints(bonePnts, tailLeft, tailRight);
        var neckLeft = headPnts[0];
        var neckRight = headPnts[4];
        var tailWidth = PlotUtils.distance(tailLeft, tailRight);
        var allLen = PlotUtils.getBaseLength(bonePnts);
        var len = allLen * this.tailWidthFactor * this.swallowTailFactor;
        this.swallowTailPnt = PlotUtils.getThirdPoint(bonePnts[1], bonePnts[0], 0, len, true);
        var factor = tailWidth / allLen;
        var bodyPnts = this.getArrowBodyPoints(bonePnts, neckLeft, neckRight, factor);
        var count = bodyPnts.length;
        var leftPnts = [tailLeft].concat(bodyPnts.slice(0, count / 2));
        leftPnts.push(neckLeft);
        var rightPnts = [tailRight].concat(bodyPnts.slice(count / 2, count));
        rightPnts.push(neckRight);

        leftPnts = PlotUtils.getQBSplinePoints(leftPnts);
        rightPnts = PlotUtils.getQBSplinePoints(rightPnts);

        this.generatePositions(leftPnts.concat(headPnts, rightPnts.reverse(), [this.swallowTailPnt, leftPnts[0]]));
    }
}