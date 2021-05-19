// 突击方向 与直箭头差不多
import FineArrow from "../FineArrow"
import PlotTypes from "../../PlotTypes"
export default class AssaultDirection extends FineArrow {

    constructor(viewer, baseInfo, properties) {
        super(viewer, baseInfo, properties);
        this.baseInfo.plotName = PlotTypes.ASSAULT_DIRECTION;
    }

    initConsts() {
        this.tailWidthFactor = 0.2;
        this.neckWidthFactor = 0.25;
        this.headWidthFactor = 0.3;

        this.headAngle = Math.PI / 4;
        this.neckAngle = Math.PI * 0.17741;
        this.fixPointCount = 2;
    }
}