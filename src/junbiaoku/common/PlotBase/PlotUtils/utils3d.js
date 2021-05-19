// 二维点转为三维点 即经纬度转为笛卡尔坐标
//导入Cesium 

//二维点转三维点
export function point2dToPoint3d(point2d, height) {
    return Cesium.Cartesian3.fromDegrees(point2d[0], point2d[1], height);
}

export function poin2dsToPoint3ds(point2ds, height) {
    let point3ds = [];
    height = height || 0;
    for (let i = 0; i < point2ds.length; i++) {
        point3ds.push(point2dToPoint3d(point2ds[i], height));
    }
    return point3ds;
}

//三维点转二维点
export function point3dToPoint2d(point3d) {
    let c = Cesium.Cartographic.fromCartesian(point3d);
    return [Cesium.Math.toDegrees(c.longitude), Cesium.Math.toDegrees(c.latitude)];
}

export function point3dsToPoint2ds(point3ds) {
    let point2ds = [];
    for (let i = 0; i < point3ds.length; i++) {
        point2ds.push(point3dToPoint2d(point3ds[i]));
    }
    return point2ds;
}