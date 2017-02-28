interface Drawable{

    draw(context2D : CanvasRenderingContext2D);

}


abstract class DisplayObject implements Drawable{

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

    touchEnable : boolean = false;

    eventArray : TheEvent[] = [];

    constructor(){

        this.matrix = new math.Matrix();
        this.globalMatrix = new math.Matrix();
        
    }
    
    
    //final，所有子类都要执行且不能修改
    draw(context2D: CanvasRenderingContext2D) {
        

        this.matrix.updateFromDisplayObject(this.x, this.y, this.scaleX, this.scaleY, this.rotation);//初始化矩阵
        //console.log(this.matrix.toString());


        //Alpha值
        if(this.parent){

            this.globalAlpha = this.parent.globalAlpha * this.alpha;
            this.globalMatrix = math.matrixAppendMatrix(this.matrix, this.parent.globalMatrix);

        }else{

            this.globalAlpha = this.alpha;
            this.globalMatrix = this.matrix;
        }

        context2D.globalAlpha = this.globalAlpha;
        //console.log(context2D.globalAlpha);
        
        //变换
        
        context2D.setTransform(this.globalMatrix.a, this.globalMatrix.b, this.globalMatrix.c, this.globalMatrix.d, this.globalMatrix.tx, this.globalMatrix.ty);
        this.render(context2D);

        //模板方法模式
    }

    //添加到本控件的EVent数组中
    addEventListener(type : string, func : Function, targetDisplayObject : DisplayObject, ifCapture : boolean){
        
        let e = new TheEvent(type, func, targetDisplayObject, ifCapture);
        this.eventArray.push(e);
    }

    //在子类中重写
    abstract render(context2D: CanvasRenderingContext2D);

    abstract hitTest(x : number, y : number) : DisplayObject;//返回值确定被点击的控件



}


class Bitmap extends DisplayObject{
    
    image: HTMLImageElement;

    constructor() {
        
        super();
        this.image = document.createElement("img");
 
    }

    render(context2D: CanvasRenderingContext2D) {

        context2D.drawImage(this.image, 0, 0, this.image.width, this.image.height);
        //context2D.drawImage(this.image, 0, 0);
    }

    hitTest(x : number, y : number){

        var rect = new math.Rectangle();
        rect.x = 0;
        rect.y = 0;
        rect.width = this.image.width;
        rect.height = this.image.height;
        if(rect.isPointInRectangle(new math.Point(x, y))){

            if(this.eventArray.length != 0){
                
                EventManager.getInstance().targetDisplayObjcetArray.push(this);
            }

            return this;

        }else{

            return null;
        }
    
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

    hitTest(x : number, y : number){

        var rect = new math.Rectangle();
        rect.x = 0;
        rect.y = -this.size;//????????
        rect.width = this.size * this.text.length;
        rect.height = this.size;

        if(rect.isPointInRectangle(new math.Point(x, y))){

            if(this.eventArray.length != 0){

                EventManager.getInstance().targetDisplayObjcetArray.push(this);
            }
            return this;

        }else{

            return null;
        }
        
    }

}

class Button extends DisplayObject{

    text: string = "";

    color : string = "";

    size : number = 0;

    enable : boolean = false;

    render(context2D: CanvasRenderingContext2D) {
        
        context2D.font = "normal lighter " + this.size + "px"  + " cursive";
        context2D.fillStyle = this.color;
        context2D.fillText(this.text, 0, 0);

    }

    hitTest(x : number, y : number){

        var rect = new math.Rectangle();
        rect.x = 0;
        rect.y = -this.size;//????????
        rect.width = this.size * this.text.length;
        rect.height = this.size;

        if(rect.isPointInRectangle(new math.Point(x, y)) && this.enable){

            if(this.eventArray.length != 0){

                EventManager.getInstance().targetDisplayObjcetArray.push(this);
            }
            return this;

        }else{

            return null;
        }
        
    }

    addEventListener(type : string, func : Function, targetDisplayObject : DisplayObject, ifCapture : boolean){
        
        let e = new TheEvent(type, func, targetDisplayObject, ifCapture);
        this.eventArray.push(e);
    }
    
    
}



class DisplayObjectContainer extends DisplayObject{
    
    children : DisplayObject[] = [];

    render(context2D : CanvasRenderingContext2D){

        for (let displayObject of this.children) {

            displayObject.draw(context2D);
        }
    }

    addChild(child : DisplayObject){

        this.children.push(child);
        child.parent = this;

    }

    removeChild(displayObject : DisplayObject){

        var tempArray = this.children.concat();
        for(let each of tempArray){

            if(each == displayObject){

                var index = this.children.indexOf(each);
                tempArray.splice(index, 1);
                this.children = tempArray;
                return;
            }
        }
    }

    hitTest(x : number, y : number){

        if(this.eventArray.length != 0){

            EventManager.getInstance().targetDisplayObjcetArray.push(this);
        }

        for(var i = this.children.length - 1; i >= 0; i--){

            var child = this.children[i];
            var pointBaseOnChild = math.pointAppendMatrix(new math.Point(x, y), math.invertMatrix(child.matrix));//通过与逆矩阵相乘得出点的相对坐标---点向量
            var hitTestResult = child.hitTest(pointBaseOnChild.x, pointBaseOnChild.y);//树的遍历
            
            if(hitTestResult){
                                
                return hitTestResult;
            }
        }

        return null;
    }

    


}


//捕获---冒泡机制
//scene
//player
//glasses
