var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var math;
(function (math) {
    var Point = (function () {
        function Point(x, y) {
            this.x = x;
            this.y = y;
        }
        return Point;
    }());
    math.Point = Point;
    function pointAppendMatrix(point, m) {
        var x = m.a * point.x + m.c * point.y + m.tx;
        var y = m.b * point.x + m.d * point.y + m.ty;
        return new Point(x, y);
    }
    math.pointAppendMatrix = pointAppendMatrix;
    /**
     * 使用伴随矩阵法求逆矩阵
     * http://wenku.baidu.com/view/b0a9fed8ce2f0066f53322a9
     */
    function invertMatrix(m) {
        var a = m.a;
        var b = m.b;
        var c = m.c;
        var d = m.d;
        var tx = m.tx;
        var ty = m.ty;
        var determinant = a * d - b * c;
        var result = new Matrix(1, 0, 0, 1, 0, 0);
        if (determinant == 0) {
            throw new Error("no invert");
        }
        determinant = 1 / determinant;
        var k = result.a = d * determinant;
        b = result.b = -b * determinant;
        c = result.c = -c * determinant;
        d = result.d = a * determinant;
        result.tx = -(k * tx + c * ty);
        result.ty = -(b * tx + d * ty);
        return result;
    }
    math.invertMatrix = invertMatrix;
    function matrixAppendMatrix(m1, m2) {
        var result = new Matrix();
        result.a = m1.a * m2.a + m1.b * m2.c;
        result.b = m1.a * m2.b + m1.b * m2.d;
        result.c = m2.a * m1.c + m2.c * m1.d;
        result.d = m2.b * m1.c + m1.d * m2.d;
        result.tx = m2.a * m1.tx + m2.c * m1.ty + m2.tx;
        result.ty = m2.b * m1.tx + m2.d * m1.ty + m2.ty;
        return result;
    }
    math.matrixAppendMatrix = matrixAppendMatrix;
    var PI = Math.PI;
    var HalfPI = PI / 2;
    var PacPI = PI + HalfPI;
    var TwoPI = PI * 2;
    var DEG_TO_RAD = Math.PI / 180;
    var Matrix = (function () {
        function Matrix(a, b, c, d, tx, ty) {
            if (a === void 0) { a = 1; }
            if (b === void 0) { b = 0; }
            if (c === void 0) { c = 0; }
            if (d === void 0) { d = 1; }
            if (tx === void 0) { tx = 0; }
            if (ty === void 0) { ty = 0; }
            this.a = a;
            this.b = b;
            this.c = c;
            this.d = d;
            this.tx = tx;
            this.ty = ty;
        }
        Matrix.prototype.toString = function () {
            return "(a=" + this.a + ", b=" + this.b + ", c=" + this.c + ", d=" + this.d + ", tx=" + this.tx + ", ty=" + this.ty + ")";
        };
        Matrix.prototype.updateFromDisplayObject = function (x, y, scaleX, scaleY, rotation) {
            this.tx = x;
            this.ty = y;
            var skewX, skewY;
            skewX = skewY = rotation / 180 * Math.PI;
            var u = Math.cos(skewX);
            var v = Math.sin(skewX);
            this.a = Math.cos(skewY) * scaleX;
            this.b = Math.sin(skewY) * scaleX;
            this.c = -v * scaleY;
            this.d = u * scaleY;
        };
        return Matrix;
    }());
    math.Matrix = Matrix;
})(math || (math = {}));
window.onload = function () {
    //1.任何一个显示对象需要一个1矩阵
    //2.把显示对象的属性转化为自己的相对矩阵
    //3.把显示对象的相对矩阵与父对象的全局矩阵相乘，得到显示对象的全局矩阵
    //4.对渲染上下文设置显示对象的全局矩阵
    var canvas = document.getElementById("app"); //使用 id 来寻找 canvas 元素
    var context2D = canvas.getContext("2d"); //得到内建的 HTML5 对象，拥有多种绘制路径、矩形、圆形、字符以及添加图像的方法
    var stage = new DisplayObjectContainer();
    stage.alpha = 0.5;
    stage.x = 90;
    setInterval(function () {
        context2D.clearRect(0, 0, canvas.width, canvas.height); //在显示图片之前先清屏，将之前帧的图片去掉,清屏范围最好设置成画布的宽与高
        stage.draw(context2D);
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
    word1.alpha = 0.4;
    //图片
    var avater = new Bitmap();
    avater.image.src = "avater.jpg";
    //加载完图片资源
    avater.image.onload = function () {
        avater.width = 400;
        avater.height = 400;
        stage.addChild(avater);
        stage.addChild(word1);
        //stage.removeChild(word1);
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
        this.matrix = new math.Matrix();
        this.globalMatrix = new math.Matrix();
    }
    //final，所有子类都要执行且不能修改
    DisplayObject.prototype.draw = function (context2D) {
        this.matrix.updateFromDisplayObject(this.x, this.y, this.scaleX, this.scaleY, this.rotation); //初始化矩阵
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
        //console.log(this.matrix.toString());
        context2D.setTransform(this.globalMatrix.a, this.globalMatrix.b, this.globalMatrix.c, this.globalMatrix.d, this.globalMatrix.tx, this.globalMatrix.ty);
        this.render(context2D);
        //模板方法模式
    };
    //在子类中重写
    DisplayObject.prototype.render = function (context2D) {
    };
    return DisplayObject;
}());
var Bitmap = (function (_super) {
    __extends(Bitmap, _super);
    function Bitmap() {
        _super.call(this);
        this.width = 0;
        this.height = 0;
        this.image = document.createElement("img");
    }
    Bitmap.prototype.render = function (context2D) {
        context2D.drawImage(this.image, 0, 0, this.width, this.height);
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
    return TextField;
}(DisplayObject));
var DisplayObjectContainer = (function (_super) {
    __extends(DisplayObjectContainer, _super);
    function DisplayObjectContainer() {
        _super.apply(this, arguments);
        this.array = [];
    }
    DisplayObjectContainer.prototype.render = function (context2D) {
        for (var _i = 0, _a = this.array; _i < _a.length; _i++) {
            var displayObject = _a[_i];
            displayObject.draw(context2D);
        }
    };
    DisplayObjectContainer.prototype.addChild = function (displayObject) {
        this.array.push(displayObject);
        displayObject.parent = this;
    };
    DisplayObjectContainer.prototype.removeChild = function (displayObject) {
        for (var i = 0; i < this.array.length; i++) {
            if (displayObject == this.array[i]) {
                this.array.splice(i);
                return;
            }
        }
    };
    return DisplayObjectContainer;
}(DisplayObject));
//# sourceMappingURL=main.js.map