import Vue from "vue"

import TipVue from "./Tip.vue"
let TipVm = Vue.extend(TipVue)

//绘制鼠标提示类
export default class PlotDrawTip {
    constructor(viewer) {
        this.viewer = viewer;
        //创建模板
        this.vmInstance = new TipVm({
            propsData: {
                contents: []
            }
        }).$mount(); //根据模板创建一个面板

        viewer.cesiumWidget.container.appendChild(this.vmInstance.$el); //将字符串模板生成的内容添加到DOM上
        this.addPostRender();
    }

    setContent(contents) {
        //contents为字符串数组 每个元素一行
        this.vmInstance.contents = contents;
    }

    updatePosition(newPosition) {
        this.position = newPosition;
    }

    //添加场景事件
    addPostRender() {
        this.viewer.scene.postRender.addEventListener(this.postRender, this);
    }

    //场景渲染事件 实时更新标签的位置 使其与笛卡尔坐标一致
    postRender() {
        if (!this.vmInstance.$el || !this.vmInstance.$el.style) return;
        if (!this.position) return;

        const canvasHeight = this.viewer.scene.canvas.height;
        const windowPosition = new Cesium.Cartesian2();
        Cesium.SceneTransforms.wgs84ToWindowCoordinates(this.viewer.scene, this.position, windowPosition);
        this.vmInstance.$el.style.bottom = canvasHeight - windowPosition.y - 20 + "px";
        const elWidth = this.vmInstance.$el.offsetWidth;
        this.vmInstance.$el.style.left = windowPosition.x + 50 + "px";
    }

    //移除标绘
    remove() {
        this.viewer.cesiumWidget.container.removeChild(this.vmInstance.$el); //删除DOM
        this.viewer.scene.postRender.removeEventListener(this.postRender, this); //移除事件监听
    }
}