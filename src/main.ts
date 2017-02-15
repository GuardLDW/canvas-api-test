window.onload = () => {

    //1.任何一个显示对象需要一个1矩阵
    //2.把显示对象的属性转化为自己的相对矩阵
    //3.把显示对象的相对矩阵与父对象的全局矩阵相乘，得到显示对象的全局矩阵
    //4.对渲染上下文设置显示对象的全局矩阵

    var canvas = document.getElementById("app") as HTMLCanvasElement;//使用 id 来寻找 canvas 元素
    var context2D = canvas.getContext("2d");//得到内建的 HTML5 对象，拥有多种绘制路径、矩形、圆形、字符以及添加图像的方法


    var stage = new DisplayObjectContainer();
    stage.alpha = 1;
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
    word1.y = 10;
    word1.text = "欧尼酱";
    word1.color = "#FF0000"
    word1.size = 20;
    word1.alpha = 0.2;
    
    //图片
    var image = document.createElement("img");
    image.src = "avater.jpg";

    image.onload = () => {

        var avater = new Bitmap();
        avater.image = image;
        avater.width = 400;
        avater.height = 400;

        stage.addChild(avater);
        stage.addChild(word1);

        //stage.removeChild(word1);
        
    }

    

};




class DisplayObject{

    x : number = 0;
    y : number = 0;
    scaleX : number = 0;
    scaleY : number = 0;
    rotateX : number = 0;
    rotateY : number = 0;

    alpha : number = 1;//相对
    globalAlpha : number = 1;//全局                             
    parent : DisplayObject;
    
    //final，所有子类都要执行且不能修改
    draw(context2D: CanvasRenderingContext2D) {

        if(this.parent){

            this.globalAlpha = this.parent.globalAlpha * this.alpha;
            
        }else{

            this.globalAlpha = this.alpha;
        }

        context2D.globalAlpha = this.globalAlpha;
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

    render(context2D: CanvasRenderingContext2D) {
        
        context2D.setTransform(1, 0, 0, 1, this.x, this.y);
        context2D.drawImage(this.image, 0, 0, this.width, this.height);
    }
}


class TextField extends DisplayObject{
    
    text: string = "";

    color : string = "";

    size : number = 0;

    render(context2D: CanvasRenderingContext2D) {
        
        context2D.setTransform(1, 0, 0, 1, this.x, this.y + this.size);
        context2D.font = "normal lighter " + this.size + "px"  + " cursive";
        context2D.fillStyle = this.color;
        context2D.fillText(this.text, 0, 0);
    }

}



class DisplayObjectContainer extends DisplayObject{
    
    array: DisplayObject[] = [];
    
    render(context2D : CanvasRenderingContext2D) {

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






