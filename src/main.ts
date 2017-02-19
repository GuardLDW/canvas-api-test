module math {


    export class Point {
        x: number;
        y: number;
        constructor(x: number, y: number) {
            this.x = x;
            this.y = y;
        }
    }

    export function pointAppendMatrix(point: Point, m: Matrix): Point {
        var x = m.a * point.x + m.c * point.y + m.tx;
        var y = m.b * point.x + m.d * point.y + m.ty;
        return new Point(x, y);

    }

    /**
     * 使用伴随矩阵法求逆矩阵
     * http://wenku.baidu.com/view/b0a9fed8ce2f0066f53322a9
     */
    export function invertMatrix(m: Matrix): Matrix {


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

    export function matrixAppendMatrix(m1: Matrix, m2: Matrix): Matrix {

        var result = new Matrix();
        result.a = m1.a * m2.a + m1.b * m2.c;
        result.b = m1.a * m2.b + m1.b * m2.d;
        result.c = m2.a * m1.c + m2.c * m1.d;
        result.d = m2.b * m1.c + m1.d * m2.d;
        result.tx = m2.a * m1.tx + m2.c * m1.ty + m2.tx;
        result.ty = m2.b * m1.tx + m2.d * m1.ty + m2.ty;
        return result;
    }

    var PI = Math.PI;
    var HalfPI = PI / 2;
    var PacPI = PI + HalfPI;
    var TwoPI = PI * 2;
    var DEG_TO_RAD: number = Math.PI / 180;


    export class Matrix {

        constructor(a: number = 1, b: number = 0, c: number = 0, d: number = 1, tx: number = 0, ty: number = 0) {
            this.a = a;
            this.b = b;
            this.c = c;
            this.d = d;
            this.tx = tx;
            this.ty = ty;
        }

        public a: number;

        public b: number;

        public c: number;

        public d: number;

        public tx: number;

        public ty: number;

        public toString(): string {
            return "(a=" + this.a + ", b=" + this.b + ", c=" + this.c + ", d=" + this.d + ", tx=" + this.tx + ", ty=" + this.ty + ")";
        }

        updateFromDisplayObject(x: number, y: number, scaleX: number, scaleY: number, rotation: number) {
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

        }
    }
}


window.onload = () => {

    //1.任何一个显示对象需要一个1矩阵
    //2.把显示对象的属性转化为自己的相对矩阵
    //3.把显示对象的相对矩阵与父对象的全局矩阵相乘，得到显示对象的全局矩阵
    //4.对渲染上下文设置显示对象的全局矩阵

    var canvas = document.getElementById("app") as HTMLCanvasElement;//使用 id 来寻找 canvas 元素
    var context2D = canvas.getContext("2d");//得到内建的 HTML5 对象，拥有多种绘制路径、矩形、圆形、字符以及添加图像的方法


    var stage = new DisplayObjectContainer();
    stage.alpha = 0.5;
    stage.x = 90;
    setInterval(() => {
        
        context2D.clearRect(0, 0, canvas.width, canvas.height);//在显示图片之前先清屏，将之前帧的图片去掉,清屏范围最好设置成画布的宽与高
        stage.draw(context2D);

    }, 100)

    /*
    //模拟TextField与Bitmap
    */


    //文字
    var word1 = new TextField();
    word1.x = 10;
    word1.y = 30;
    word1.text = "欧尼酱";
    word1.color = "#FF0000"
    word1.size = 20;
    word1.alpha = 0.4;
    
    //图片
    var avater = new Bitmap();
    avater.image.src = "avater.jpg";

    //加载完图片资源
    avater.image.onload = () => {

        avater.width = 400;
        avater.height = 400;

        stage.addChild(avater);
        stage.addChild(word1);

        //stage.removeChild(word1);
        
    }

    

};
                         
interface Drawable{

    draw(context2D : CanvasRenderingContext2D);

}


class DisplayObject implements Drawable{

    x : number = 0;
    y : number = 0;
    scaleX : number = 1;
    scaleY : number = 1;
    rotation : number = 0;

    matrix : math.Matrix = null;
    globalMatrix : math.Matrix = null;

    alpha : number = 1;//相对
    globalAlpha : number = 1;//全局                             
    parent : DisplayObject = null;

    constructor(){

        this.matrix = new math.Matrix();
        this.globalMatrix = new math.Matrix();
        
    }
    
    
    //final，所有子类都要执行且不能修改
    draw(context2D: CanvasRenderingContext2D) {
        

        this.matrix.updateFromDisplayObject(this.x, this.y, this.scaleX, this.scaleY, this.rotation);//初始化矩阵

        //Alpha值
        if(this.parent){

            this.globalAlpha = this.parent.globalAlpha * this.alpha;
            this.globalMatrix = math.matrixAppendMatrix(this.matrix, this.parent.globalMatrix);
            //console.log("has");

        }else{

            this.globalAlpha = this.alpha;
            this.globalMatrix = this.matrix;
            //console.log("has not");
        }

        context2D.globalAlpha = this.globalAlpha;
        //console.log(context2D.globalAlpha);
        
        //变换
        
       
        //console.log(this.matrix.toString());
        context2D.setTransform(this.globalMatrix.a, this.globalMatrix.b, this.globalMatrix.c, this.globalMatrix.d, this.globalMatrix.tx, this.globalMatrix.ty);
        this.render(context2D);

        //模板方法模式
    }

    //在子类中重写
    render(context2D: CanvasRenderingContext2D){


    }

}


class Bitmap extends DisplayObject{
    
    image: HTMLImageElement;

    width : number = 0;

    height : number = 0;

    constructor() {
        
        super();
        this.image = document.createElement("img");
    }

    render(context2D: CanvasRenderingContext2D) {
        
        context2D.drawImage(this.image, 0, 0, this.width, this.height);
    }
}


class TextField extends DisplayObject{
    
    text: string = "";

    color : string = "";

    size : number = 0;

    render(context2D: CanvasRenderingContext2D) {
        
        context2D.font = "normal lighter " + this.size + "px"  + " cursive";
        context2D.fillStyle = this.color;
        context2D.fillText(this.text, 0, 0);
    }

}



class DisplayObjectContainer extends DisplayObject{
    
    array: DisplayObject[] = [];

    render(context2D : CanvasRenderingContext2D){

        for (let displayObject of this.array) {

            displayObject.draw(context2D);
        }
    }

    addChild(displayObject : DisplayObject){

        this.array.push(displayObject);
        displayObject.parent = this;

    }

    removeChild(displayObject : DisplayObject){

        for(var i = 0; i < this.array.length; i++){

            if(displayObject == this.array[i]){

                this.array.splice(i);
                return;
            }
        }
    }
}






