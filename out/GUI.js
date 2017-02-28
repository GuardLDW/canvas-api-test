var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
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
        this.eventArray = [];
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
    //添加到本控件的EVent数组中
    DisplayObject.prototype.addEventListener = function (type, func, targetDisplayObject, ifCapture) {
        var e = new TheEvent(type, func, targetDisplayObject, ifCapture);
        this.eventArray.push(e);
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
            if (this.eventArray.length != 0) {
                EventManager.getInstance().targetDisplayObjcetArray.push(this);
            }
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
            if (this.eventArray.length != 0) {
                EventManager.getInstance().targetDisplayObjcetArray.push(this);
            }
            return this;
        }
        else {
            return null;
        }
    };
    return TextField;
}(DisplayObject));
var Button = (function (_super) {
    __extends(Button, _super);
    function Button() {
        _super.apply(this, arguments);
        this.text = "";
        this.color = "";
        this.size = 0;
        this.enable = false;
    }
    Button.prototype.render = function (context2D) {
        context2D.font = "normal lighter " + this.size + "px" + " cursive";
        context2D.fillStyle = this.color;
        context2D.fillText(this.text, 0, 0);
    };
    Button.prototype.hitTest = function (x, y) {
        var rect = new math.Rectangle();
        rect.x = 0;
        rect.y = -this.size; //????????
        rect.width = this.size * this.text.length;
        rect.height = this.size;
        if (rect.isPointInRectangle(new math.Point(x, y)) && this.enable) {
            if (this.eventArray.length != 0) {
                EventManager.getInstance().targetDisplayObjcetArray.push(this);
            }
            return this;
        }
        else {
            return null;
        }
    };
    Button.prototype.addEventListener = function (type, func, targetDisplayObject, ifCapture) {
        var e = new TheEvent(type, func, targetDisplayObject, ifCapture);
        this.eventArray.push(e);
    };
    return Button;
}(DisplayObject));
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
        if (this.eventArray.length != 0) {
            EventManager.getInstance().targetDisplayObjcetArray.push(this);
        }
        for (var i = this.children.length - 1; i >= 0; i--) {
            var child = this.children[i];
            var pointBaseOnChild = math.pointAppendMatrix(new math.Point(x, y), math.invertMatrix(child.matrix)); //通过与逆矩阵相乘得出点的相对坐标---点向量
            var hitTestResult = child.hitTest(pointBaseOnChild.x, pointBaseOnChild.y); //树的遍历
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
//# sourceMappingURL=GUI.js.map