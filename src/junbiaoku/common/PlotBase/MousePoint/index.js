// 绘制时显示鼠标拾取点
export default class MousePoint {
    constructor(viewer) {
        this.viewer = viewer;
        this.addPoint();
    }

    addPoint() {
        this.mousePointEntity = this.viewer.entities.add({
            point: {
                pixelSize: 8,
                color: Cesium.Color.AQUA,
                outlineWidth: 1,
                outlineColor: Cesium.Color.WHITE
            }
        })
    }

    updatePosition(position) {
        this.mousePointEntity.position = position;
    }

    remove() {
        this.viewer.entities.remove(this.mousePointEntity);
    }

}