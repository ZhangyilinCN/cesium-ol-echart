 //获取唯一码 时间不可能重复
 export function getPlotCode() {
     const date = new Date();
     let code = date.getFullYear() + "";
     code += date.getMonth() + 1;
     code += date.getDate();
     code += date.getHours();
     code += date.getMinutes();
     code += date.getSeconds();
     code += date.getMilliseconds();
     return code;
 };

 export function unifiedHeight(positions, height) {
     if (!height) height = getPositionHeight(positions[0]); //如果没有指定高度 就用第一个的高度
     let point3d;
     for (let i = 0; i < positions.length; i++) {
         const element = positions[i];
         point3d = cartesian3ToPoint3D(element);
         positions[i] = Cesium.Cartesian3.fromDegrees(point3d.x, point3d.y, height)
     }
 }

 export function getPositionHeight(position) {
     const cartographic = Cesium.Cartographic.fromCartesian(position);
     return cartographic.height;
 }

 //笛卡尔坐标转为 经纬度xyz
 export function cartesian3ToPoint3D(position) {
     const cartographic = Cesium.Cartographic.fromCartesian(position);
     const lon = Cesium.Math.toDegrees(cartographic.longitude);
     const lat = Cesium.Math.toDegrees(cartographic.latitude);
     return { x: lon, y: lat, z: cartographic.height };
 }

 export function midPosition(first, second) {
     if (!first || !second) return null;
     let point3d1 = cartesian3ToPoint3D(first);
     let point3d2 = cartesian3ToPoint3D(second);
     let midLonLat = {
         x: (point3d1.x + point3d2.x) / 2,
         y: (point3d1.y + point3d2.y) / 2,
         z: (point3d1.z + point3d2.z) / 2
     }
     return Cesium.Cartesian3.fromDegrees(midLonLat.x, midLonLat.y, midLonLat.z);
 }

 //  笛卡尔坐标转为经纬度[x,y]
 export function cartesian3ToLonLat(position) {
     const cartographic = Cesium.Cartographic.fromCartesian(position);
     const lon = Cesium.Math.toDegrees(cartographic.longitude);
     const lat = Cesium.Math.toDegrees(cartographic.latitude);
     return [lon, lat];
 }


 export function get2PositionDistance(p1, p2) {
     let lngLat1 = cartesian3ToLonLat(p1);
     let lngLat2 = cartesian3ToLonLat(p2);
     return distance(lngLat1, lngLat2);
 }

 //计算两个点的距离
 export function distance(lngLat1, lngLat2) {
     var radLat1 = lngLat1[1] * Math.PI / 180.0;
     var radLat2 = lngLat2[1] * Math.PI / 180.0;
     var a = radLat1 - radLat2;
     var b = lngLat1[0] * Math.PI / 180.0 - lngLat2[0] * Math.PI / 180.0;
     var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
     s = s * 6378.137;
     s = Math.round(s * 10000) / 10;
     return s
 }