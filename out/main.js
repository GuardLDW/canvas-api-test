var _this = this;
window.onload = function () {
    //1.任何一个显示对象需要一个1矩阵
    //2.把显示对象的属性转化为自己的相对矩阵
    //3.把显示对象的相对矩阵与父对象的全局矩阵相乘，得到显示对象的全局矩阵
    //4.对渲染上下文设置显示对象的全局矩阵
    var canvas = document.getElementById("app"); //使用 id 来寻找 canvas 元素
    var context2D = canvas.getContext("2d"); //得到内建的 HTML5 对象，拥有多种绘制路径、矩形、圆形、字符以及添加图像的方法
    var stage = new DisplayObjectContainer();
    //第二层容器
    var panel = new DisplayObjectContainer();
    panel.x = 120;
    panel.y = 50;
    panel.alpha = 0.5;
    setInterval(function () {
        context2D.save();
        context2D.clearRect(0, 0, canvas.width, canvas.height); //在显示图片之前先清屏，将之前帧的图片去掉,清屏范围最好设置成画布的宽与高
        stage.draw(context2D); //最外层开始画
        context2D.restore();
    }, 50);
    var list = new DisplayObjectContainer();
    list.addEventListener("onmousemove", function (e) {
        var dy = currentY - lastY;
        list.y = list.y + dy;
    }, _this, false);
    /*
    //模拟TextField与Bitmap
    */
    //文字
    var button = new Button();
    button.x = 10;
    button.y = 30;
    button.text = "点我";
    button.color = "#FF0000";
    button.size = 20;
    button.enable = true;
    button.addEventListener("onclick", function () {
        button.text = "欧尼酱";
    }, _this, false);
    var word2 = new TextField();
    word2.text = "第二层容器";
    word2.color = "#0000FF";
    word2.size = 30;
    //图片
    var avater = new Bitmap();
    avater.image.src = "avater.jpg";
    //加载完图片资源
    avater.image.onload = function () {
        list.addChild(avater);
        list.addChild(button);
        panel.addChild(word2);
        stage.addChild(list);
        stage.addChild(panel);
        //stage.removeChild(panel);
    };
    //记录位置
    var currentX;
    var currentY;
    var lastX;
    var lastY;
    var isMouseDown = false; //检测鼠标是否按下
    var hitResult; //检测是否点到控件
    window.onmousedown = function (e) {
        isMouseDown = true;
        var targetDisplayObjectArray = EventManager.getInstance().targetDisplayObjcetArray;
        targetDisplayObjectArray.splice(0, targetDisplayObjectArray.length);
        hitResult = stage.hitTest(e.offsetX, e.offsetY);
        currentX = e.offsetX;
        currentY = e.offsetY;
    };
    window.onmousemove = function (e) {
        var targetDisplayObjcetArray = EventManager.getInstance().targetDisplayObjcetArray;
        lastX = currentX;
        lastY = currentY;
        currentX = e.offsetX;
        currentY = e.offsetY;
        if (isMouseDown) {
            for (var i = 0; i < targetDisplayObjcetArray.length; i++) {
                for (var _i = 0, _a = targetDisplayObjcetArray[i].eventArray; _i < _a.length; _i++) {
                    var event_1 = _a[_i];
                    if (event_1.type.match("onmousemove") && event_1.ifCapture) {
                        event_1.func(e);
                    }
                }
            }
            for (var i = targetDisplayObjcetArray.length - 1; i >= 0; i--) {
                for (var _b = 0, _c = targetDisplayObjcetArray[i].eventArray; _b < _c.length; _b++) {
                    var event_2 = _c[_b];
                    if (event_2.type.match("onmousemove") && !event_2.ifCapture) {
                        event_2.func(e);
                    }
                }
            }
        }
    };
    window.onmouseup = function (e) {
        isMouseDown = false;
        var targetDisplayObjcetArray = EventManager.getInstance().targetDisplayObjcetArray;
        targetDisplayObjcetArray.splice(0, targetDisplayObjcetArray.length);
        var newHitRusult = stage.hitTest(e.offsetX, e.offsetY);
        for (var i = targetDisplayObjcetArray.length - 1; i >= 0; i--) {
            for (var _i = 0, _a = targetDisplayObjcetArray[i].eventArray; _i < _a.length; _i++) {
                var event_3 = _a[_i];
                if (event_3.type.match("onclick") && newHitRusult == hitResult) {
                    event_3.func(e);
                }
            }
        }
    };
};
//# sourceMappingURL=main.js.map