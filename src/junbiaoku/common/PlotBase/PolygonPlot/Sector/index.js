// 扇形标绘类
import * as PlotUtils from "../../PlotUtils/utils2d"
import * as Constants from "../../Constants"
import PlotTypes from "../../PlotTypes"

import Polygon from "../Polygon"
export default class Sector extends Polygon {

    constructor(viewer, baseInfo, properties) {
        super(viewer, baseInfo, properties);
        this.baseInfo.plotName = PlotTypes.SECTOR;
    }

    initConsts() {
        this.fixPointCount = 3;
    }

    generate() {
        if (this.getPointCount() < 2)
            return;
        if (this.getPointCount() == 2)
            this.generatePositions(this.baseInfo.points);
        else {
            var pnts = this.getPoints();
            var center = pnts[0];
            var pnt2 = pnts[1];
            var pnt3 = pnts[2];
            var radius = PlotUtils.distance(pnt2, center);
            var startAngle = PlotUtils.getAzimuth(pnt2, center);
            var endAngle = PlotUtils.getAzimuth(pnt3, center);
            //优化绘制大扇形时像椭圆的问题
            var d_1 = startAngle * 180 / 3.14;
            var d_2 = endAngle * 180 / 3.14;
            var r1 = this.distance(pnt2, center);
            var pList1 = this.generatSectorPoints(center, r1, d_1, d_2);
            // var pList = PlotUtils.getArcPoints(center, radius, startAngle, endAngle);
            // pList.push(center, pList[0]);
            pList1.push(center, pList1[0]);
            this.generatePositions(pList1);
        }
    }

    //计算两个点的距离
    distance(lngLat1, lngLat2) {
        var radLat1 = lngLat1[1] * Math.PI / 180.0;
        var radLat2 = lngLat2[1] * Math.PI / 180.0;
        var a = radLat1 - radLat2;
        var b = lngLat1[0] * Math.PI / 180.0 - lngLat2[0] * Math.PI / 180.0;
        var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
        s = s * 6378.137;
        s = Math.round(s * 10000) / 10;
        return s
    }

    //获取一个圆的边缘坐标
    generatSectorPoints(center, radius, startAngle, endAngle) {
        startAngle = 90 - startAngle;
        endAngle = 90 - endAngle;
        let points = [];
        if (startAngle < endAngle) {
            for (let i = startAngle; i < endAngle; i += 2) {
                points.push(this.getCirclePoint(center[0], center[1], i, radius))
            }
        } else {
            for (let i = startAngle; i > endAngle; i -= 2) {
                points.push(this.getCirclePoint(center[0], center[1], i, radius))
            }
        }
        return points;
    }

    getCirclePoint(lon, lat, angle, radius) {
        let dx = radius * Math.sin(angle * Math.PI / 180.0);
        let dy = radius * Math.cos(angle * Math.PI / 180.0);
        let ec = Constants.PRADIUS + (Constants.ERADIUS - Constants.PRADIUS) * (90.0 - lat) / 90.0;
        let ed = ec * Math.cos(lat * Math.PI / 180);
        let newLon = (dx / ed + lon * Math.PI / 180.0) * 180.0 / Math.PI;
        let newLat = (dy / ec + lat * Math.PI / 180.0) * 180.0 / Math.PI;
        return [newLon, newLat];
    }
}