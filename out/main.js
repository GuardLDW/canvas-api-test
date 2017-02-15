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
    var context2D = canvas.getContext("2d"); //得到内建的 HTML5 对象，拥有多种绘制路径、矩形、圆形、字符以及添加图像的方法
    var stage = new DisplayObjectContainer();
    stage.alpha = 1;
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
    word1.y = 10;
    word1.text = "欧尼酱";
    word1.color = "#FF0000";
    word1.size = 20;
    word1.alpha = 0.2;
    //图片
    var image = document.createElement("img");
    image.src = "avater.jpg";
    image.onload = function () {
        var avater = new Bitmap();
        avater.image = image;
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
        this.scaleX = 0;
        this.scaleY = 0;
        this.rotateX = 0;
        this.rotateY = 0;
        this.alpha = 1; //相对
        this.globalAlpha = 1; //全局                             
    }
    //final，所有子类都要执行且不能修改
    DisplayObject.prototype.draw = function (context2D) {
        if (this.parent) {
            this.globalAlpha = this.parent.globalAlpha * this.alpha;
        }
        else {
            this.globalAlpha = this.alpha;
        }
        context2D.globalAlpha = this.globalAlpha;
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
        _super.apply(this, arguments);
        this.width = 0;
        this.height = 0;
    }
    Bitmap.prototype.render = function (context2D) {
        context2D.setTransform(1, 0, 0, 1, this.x, this.y);
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
        context2D.setTransform(1, 0, 0, 1, this.x, this.y + this.size);
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