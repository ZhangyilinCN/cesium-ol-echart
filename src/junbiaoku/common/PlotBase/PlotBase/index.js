import { poin2dsToPoint3ds } from "../PlotUtils/utils3d"


// 所有军事标绘的父类
export default class MilitaryPlotBase {
    constructor(viewer, baseInfo, properties) {
        this.viewer = viewer;
        this.baseInfo = baseInfo; //baseInfo中包括二维点集points height style等信息
        this.properties = properties || {}; //用于存储属性信息 
        this.initConsts();
        this.setHeight(baseInfo.height || 0);
        this.setPoints(baseInfo.points || []);
    }

    //初始化常量 初始化常量要放在构造点的之前 否则构造点的时候读不到参数 就会报错
    initConsts() {

    }

    //新建的时候调用该方法
    setPlotCode(plotCode) {
        this.baseInfo.plotCode = plotCode;
    }

    openEditMode(isEdit) {

    }

    setHeight(height) {
        this.baseInfo.height = height;
    }

    getHeight() {
        return this.baseInfo.height;
    }

    setPoints(value) {
        this.baseInfo.points = value ? value : [];
        if (this.baseInfo.points.length >= 1)
            this.generate();
    }

    getPoints() {
        return this.baseInfo.points.slice(0);
    }

    getPointCount() {
        return this.baseInfo.points.length;
    }



    generate() {}

    //二维点转成三维点 在generate方法中将二维点转为三维点
    generatePositions(points) {
        this.positions = poin2dsToPoint3ds(points, this.getHeight());
    }
}