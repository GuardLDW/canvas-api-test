var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
window.onload = function () {
    //1.任何一个显示对象需要一个1矩阵
    //2.把显示对象的属性转化为自己的相对矩阵
    //3.把显示对象的相对矩阵与父对象的全局矩阵相乘，得到显示对象的全局矩阵
    //4.对渲染上下文设置显示对象的全局矩阵
    var canvas = document.getElementById("app"); //使用 id 来寻找 canvas 元素
    canvas.onmousedown = function (e) {
        console.log(e);
        var x = e.offsetX;
        var y = e.offsetY;
        var result = stage.hitTest(x, y);
        var target = result;
        if (result) {
            while (result.parent) {
                var type = "mousedown";
                var currentTaget = result.parent;
                var e_1 = { type: type, target: target, currentTaget: currentTaget };
                result = result.parent;
            }
        }
    };
    var context2D = canvas.getContext("2d"); //得到内建的 HTML5 对象，拥有多种绘制路径、矩形、圆形、字符以及添加图像的方法
    var stage = new DisplayObjectContainer();
    //第二层容器
    var panel = new DisplayObjectContainer();
    panel.x = 120;
    panel.y = 50;
    panel.alpha = 0.5;
    setInterval(function () {
        context2D.clearRect(0, 0, canvas.width, canvas.height); //在显示图片之前先清屏，将之前帧的图片去掉,清屏范围最好设置成画布的宽与高
        stage.draw(context2D); //最外层开始画
    }, 100);
    /*
    //模拟TextField与Bitmap
    */
    //文字
    var word1 = new TextField();
    word1.x = 10;
    word1.y = 30;
    word1.text = "欧尼酱";
    word1.color = "#FF0000";
    word1.size = 20;
    var word2 = new TextField();
    word2.text = "第二层容器";
    word2.color = "#0000FF";
    word2.size = 30;
    //图片
    var avater = new Bitmap();
    avater.image.src = "avater.jpg";
    //加载完图片资源
    avater.image.onload = function () {
        panel.addChild(word2);
        stage.addChild(avater);
        stage.addChild(word1);
        stage.addChild(panel);
        //stage.removeChild(panel);
    };
};
var DisplayObject = (function () {
    function DisplayObject() {
        this.x = 0;
        this.y = 0;
        this.scaleX = 1;
        this.scaleY = 1;
        this.rotation = 0;
        this.matrix = null;
        this.globalMatrix = null;
        this.alpha = 1; //相对
        this.globalAlpha = 1; //全局                             
        this.parent = null;
        this.touchEnable = false;
        this.matrix = new math.Matrix();
        this.globalMatrix = new math.Matrix();
    }
    //final，所有子类都要执行且不能修改
    DisplayObject.prototype.draw = function (context2D) {
        this.matrix.updateFromDisplayObject(this.x, this.y, this.scaleX, this.scaleY, this.rotation); //初始化矩阵
        //console.log(this.matrix.toString());
        //Alpha值
        if (this.parent) {
            this.globalAlpha = this.parent.globalAlpha * this.alpha;
            this.globalMatrix = math.matrixAppendMatrix(this.matrix, this.parent.globalMatrix);
        }
        else {
            this.globalAlpha = this.alpha;
            this.globalMatrix = this.matrix;
        }
        context2D.globalAlpha = this.globalAlpha;
        //console.log(context2D.globalAlpha);
        //变换
        context2D.setTransform(this.globalMatrix.a, this.globalMatrix.b, this.globalMatrix.c, this.globalMatrix.d, this.globalMatrix.tx, this.globalMatrix.ty);
        this.render(context2D);
        //模板方法模式
    };
    return DisplayObject;
}());
var Bitmap = (function (_super) {
    __extends(Bitmap, _super);
    function Bitmap() {
        _super.call(this);
        this.image = document.createElement("img");
    }
    Bitmap.prototype.render = function (context2D) {
        context2D.drawImage(this.image, 0, 0, this.image.width, this.image.height);
        //context2D.drawImage(this.image, 0, 0);
    };
    Bitmap.prototype.hitTest = function (x, y) {
        var rect = new math.Rectangle();
        rect.x = 0;
        rect.y = 0;
        rect.width = this.image.width;
        rect.height = this.image.height;
        if (rect.isPointInRectangle(new math.Point(x, y))) {
            alert("touch img");
            return this;
        }
        else {
            return null;
        }
    };
    return Bitmap;
}(DisplayObject));
var TextField = (function (_super) {
    __extends(TextField, _super);
    function TextField() {
        _super.apply(this, arguments);
        this.text = "";
        this.color = "";
        this.size = 0;
    }
    TextField.prototype.render = function (context2D) {
        context2D.font = "normal lighter " + this.size + "px" + " cursive";
        context2D.fillStyle = this.color;
        context2D.fillText(this.text, 0, 0);
    };
    TextField.prototype.hitTest = function (x, y) {
        var rect = new math.Rectangle();
        rect.x = 0;
        rect.y = -this.size; //????????
        rect.width = this.size * this.text.length;
        rect.height = this.size;
        if (rect.isPointInRectangle(new math.Point(x, y))) {
            alert("touch text");
            return this;
        }
        else {
            return null;
        }
    };
    return TextField;
}(DisplayObject));
var Button = (function () {
    function Button() {
    }
    Button.prototype.addEventListener = function (type, listener) {
    };
    return Button;
}());
var DisplayObjectContainer = (function (_super) {
    __extends(DisplayObjectContainer, _super);
    function DisplayObjectContainer() {
        _super.apply(this, arguments);
        this.children = [];
    }
    DisplayObjectContainer.prototype.render = function (context2D) {
        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var displayObject = _a[_i];
            displayObject.draw(context2D);
        }
    };
    DisplayObjectContainer.prototype.addChild = function (child) {
        this.children.push(child);
        child.parent = this;
    };
    DisplayObjectContainer.prototype.removeChild = function (displayObject) {
        var tempArray = this.children.concat();
        for (var _i = 0, tempArray_1 = tempArray; _i < tempArray_1.length; _i++) {
            var each = tempArray_1[_i];
            if (each == displayObject) {
                var index = this.children.indexOf(each);
                tempArray.splice(index, 1);
                this.children = tempArray;
                return;
            }
        }
    };
    DisplayObjectContainer.prototype.hitTest = function (x, y) {
        for (var i = this.children.length - 1; i >= 0; i--) {
            var child = this.children[i];
            var pointBaseOnChild = math.pointAppendMatrix(new math.Point(x, y), math.invertMatrix(child.matrix)); //通过与逆矩阵相乘得出点的相对坐标---点向量
            var hitTestResult = child.hitTest(pointBaseOnChild.x, pointBaseOnChild.y); //树的遍历
            console.log(hitTestResult);
            if (hitTestResult) {
                return hitTestResult;
            }
        }
        return null;
    };
    return DisplayObjectContainer;
}(DisplayObject));
//捕获---冒泡机制
//scene
//player
//glasses
//# sourceMappingURL=main.js.map