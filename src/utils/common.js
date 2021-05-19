import Vue from 'vue'
import '../utils/rem'
import vueAudioNative from 'vue-audio-native'
Vue.use(vueAudioNative)

Vue.prototype.$imgToBase64 = img => {
    let dataURL = ''
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");
    let imgNode = new Image();
    imgNode.src = img
    imgNode.setAttribute("crossOrigin", "Anonymous");
    return new Promise(resolve => {
        imgNode.addEventListener("load", function () {
            canvas.width = imgNode.width;
            canvas.height = imgNode.height;
            ctx.drawImage(imgNode, 0, 0, imgNode.width, imgNode.height);
            dataURL = canvas.toDataURL("image/png");
            resolve('image://' + dataURL)
        })
    })
};

// 公用websocket

// const wsImage = new WebSocket(`${process.env.VUE_APP_SOCKET_IP}/websocket`);
// wsImage.onopen = () => {
//     console.log("websocket链接成功", this.flag);
//     ws.send(`{"passiveImage":"${this.flag}"}`);
// };
// wsImage.onmessage = (e) => {
//     console.log("数据通信模式：", this.flag, e.data);
//     let data = JSON.parse(e.data);
//     if (data.event === "sessionId") {
//         this.sessionId = data.data.sessionId;
//     } else if (data.event === "passiveImage") {
//         this.imgUrlBD = "data:image/png;base64," + data.data.base64;
//     } else if (data.event === "coordinate") {
//         // data.data.coordinate[3] = Math.random();
//         this.$store.commit("getCoordinate", data.data.coordinate);
//     } else {
//         this.imgUrl = "data:image/png;base64," + data.data.base64;
//         console.log(888, this.imgUrl);
//     }
// };
// Vue.prototype.$wsImageURL = wsImage