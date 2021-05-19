
/* eslint-disable */
let Event = {
    wsMesEvent: function (message) {
        console.log(message)
    }
}, dftOpt = {
    protocol: (window.location.protocol == 'http:') ? 'ws://' : 'wss://'
    , host: '127.0.0.1'
    , port: '9080'
    , path: 'websocket'
    , isReConect: false
    , wsMesEvent: Event.wsMesEvent
}, Util = {
    arrayLike(arrayLike) {
        Array.from(arrayLike)
    },
    isArray(arr) {
        Array.isArray(arr)
    },
    forEach(array, iterate) {
        let index = -1
            , length = array.length;
        if (typeof iterate != 'function') {
            return array;
        }
        while (++index < length) {
            iterate.call(array, array[index], index);
        }
    },
    isPlainObject(obj) {
        let flag = false;
        if (!obj || typeof obj != 'object') {
            return flag;
        }
        if (obj.constructor.prototype.hasOwnProperty("isPrototypeOf")) {
            flag = true;
        }
        return flag;
    },
    extend(...args) {
        if (args.length <= 0) {
            return
        };
        let target = args[0];
        if (args.length == 1) {
            return args[0]
        };
        this.forEach(args, (arg, i) => {
            if (i != 0) {
                var keys = Object.keys(arg);
                this.forEach(keys, (key, i) => {
                    var val = arg[key];
                    if (this.isPlainObject(val) || this.isArray(val)) {
                        var newTarget = this.isArray(val) ? [] : {};
                        target[key] = this.extend(newTarget, val);
                    } else {
                        target[key] = val;
                    }
                });
            }
        });
        return target;
    }
}, Ws = function (opt) {
    //如果浏览器不支持websocket,直接退出
    if (!this.isSupportWs()) {
        alert("对不起，您的浏览器在不支持WebSocket，请先升级您的浏览器！！");
        return;
    }
    let config = this.config = Util.extend({}, dftOpt, opt);
    //接口地址url
    this.url = config.host === "" || config.host === "" ?
        config.protocol + config.path :
        config.protocol + config.host + ':' + config.port + config.path;
    //心跳状态  为false时不能执行操作 等待重连
    this.isHeartBeat = false;
    //重连状态  避免不间断的重连操作
    this.isReconnect = config.isReConect;
    //发送的消息
    this.curSendMes = null;
    //响应的信息
    this.message = null;
    //创建webSocket
    this.ws;
    //初始化websocket
    this.initWs = function () {
        //创建WebSocket
        let ws = this.ws = new WebSocket(`${process.env.VUE_APP_SOCKET_IP}/websocket`);
        // ws.binaryType = "arraybuffer";
        //Ws连接函数：服务器连接成功
        ws.onopen = (e) => {
            console.log(`与${this.config.host}:${this.config.port}${this.config.path}连接已建立...`)
            this.isHeartBeat = true;
            //发布事件
            this.send();
        };
        //Ws消息接收函数：服务器向前端推送消息时触发
        ws.onmessage = (e) => {
            console.log([e.data]);
            //处理各种推送消
            this.message = e.data;
            console.log(config);
            config.wsMesEvent.apply(this, [e.data]);
        }
        //Ws异常事件：Ws报错后触发
        ws.onerror = (e) => {
            this.isHeartBeat = false;
            this.reConnect();
        }
        //Ws关闭事件：Ws连接关闭后触发
        ws.onclose = (e) => {
            console.log('连接已关闭...');
            console.log("websocket连接已关闭，按F5尝试重新刷新页面");
            this.isHeartBeat = false;
            ws = null;
            this.reConnect();
        };
    };
    this.initWs();
};

//判断是否支持WebSocket
Ws.prototype.isSupportWs = function () {
    return (window.WebSocket || window.MozWebSocket) ? true : false;
}

//重新连接
Ws.prototype.reConnect = function () {
    //不需要重新连接，直接返回
    if (!this.isReconnect) return;
    this.isReconnect = true;
    //没连接上 会一直重连，设置延迟避免请求过多
    setTimeout(() => {
        this.initWs()
        this.isReconnect = false;
    }, 5000);
}

//发送消息
Ws.prototype.send = function (content) {
    this.curSendMes = content || this.curSendMes;
    if (this.curSendMes == null) {
        return;
    }
    if (this.isHeartBeat) {
        // this.ws.send(bytes);
        this.ws.send(this.curSendMes);
    }
}
export default Ws