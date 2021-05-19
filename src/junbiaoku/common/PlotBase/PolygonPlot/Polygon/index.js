import PlotBase from "../../PlotBase"
import PlotTypes from "../../PlotTypes"
//面标绘 面标绘类是所有面状军事标绘的父类 默认贴对象
export default class Polygon extends PlotBase {
    constructor(viewer, baseInfo, properties) {
        super(viewer, baseInfo, properties);
        this.baseInfo.plotName = PlotTypes.POLYGON;
        this.generateEntity();
        this.minPointCount = 3;
    }

    //构造Entity
    generateEntity() {
        this.polygonEntity = this.viewer.entities.add({
            plotType: "MilitaryPlot",
            plotCode: this.baseInfo.plotCode,
            polygon: {
                hierarchy: new Cesium.PolygonHierarchy(this.positions || []),
                material: Cesium.Color.YELLOW.withAlpha(0.6),
                classificationType: Cesium.ClassificationType.BOTH
            },
        });
    }

    generate() {
        var count = this.getPointCount();
        if (count < 2) {
            return;
        }
        this.generatePositions(this.baseInfo.points);
    }

    //开启编辑模式
    openEditMode(isEdit) {
        if (isEdit) {
            this.polygonEntity.polygon.hierarchy = new Cesium.CallbackProperty(e => {
                return new Cesium.PolygonHierarchy(this.positions || []);
            }, false)
        } else {
            this.polygonEntity.polygon.hierarchy = new Cesium.PolygonHierarchy(this.positions || []);
        }
    }

    toJSON() {
        var json = {
            plotCode: this.baseInfo.plotCode,
            baseInfo: this.baseInfo,
            properties: this.properties
        }

        return JSON.stringify(json);
    }

    //移除标绘对象
    remove() {
        this.viewer.entities.remove(this.polygonEntity);
    }
}