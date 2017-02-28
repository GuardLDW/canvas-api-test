window.onload = () => {

    //1.任何一个显示对象需要一个1矩阵
    //2.把显示对象的属性转化为自己的相对矩阵
    //3.把显示对象的相对矩阵与父对象的全局矩阵相乘，得到显示对象的全局矩阵
    //4.对渲染上下文设置显示对象的全局矩阵

    var canvas = document.getElementById("app") as HTMLCanvasElement;//使用 id 来寻找 canvas 元素

    var context2D = canvas.getContext("2d");//得到内建的 HTML5 对象，拥有多种绘制路径、矩形、圆形、字符以及添加图像的方法


    var stage = new DisplayObjectContainer();

    //第二层容器
    var panel = new DisplayObjectContainer();
    panel.x = 120;
    panel.y = 50;
    panel.alpha = 0.5;
    
    setInterval(() => {

        context2D.save();
        context2D.clearRect(0, 0, canvas.width, canvas.height);//在显示图片之前先清屏，将之前帧的图片去掉,清屏范围最好设置成画布的宽与高
        stage.draw(context2D);//最外层开始画
        context2D.restore();

    }, 50)



    var list = new DisplayObjectContainer();
    list.addEventListener("onmousemove", (e : MouseEvent) =>{

        var dy = currentY - lastY;
        list.y = list.y + dy;

    }, this, false);


    /*
    //模拟TextField与Bitmap
    */


    //文字
    var button = new Button();
    button.x = 10;
    button.y = 30;
    button.text = "点我";
    button.color = "#FF0000"
    button.size = 20;
    button.enable = true;
    button.addEventListener("onclick", ()=>{

        button.text = "欧尼酱";     
    },this,false);

    var word2 = new TextField();
    word2.text = "第二层容器"
    word2.color = "#0000FF"
    word2.size = 30;
    
    //图片
    var avater = new Bitmap();
    avater.image.src = "avater.jpg";


    //加载完图片资源
    avater.image.onload = () => {



        list.addChild(avater);
        list.addChild(button);
        
        panel.addChild(word2);

        stage.addChild(list);
        stage.addChild(panel);

        //stage.removeChild(panel);
        
    }



    //记录位置
    var currentX : number;
    var currentY : number;
    var lastX : number;
    var lastY : number;

    var isMouseDown = false;//检测鼠标是否按下
    var hitResult : DisplayObject;//检测是否点到控件


    window.onmousedown = (e)=>{

        isMouseDown = true;
        let targetDisplayObjectArray = EventManager.getInstance().targetDisplayObjcetArray;
        targetDisplayObjectArray.splice(0,targetDisplayObjectArray.length);
        hitResult = stage.hitTest(e.offsetX, e.offsetY);
        currentX = e.offsetX;
        currentY = e.offsetY;

    }


    window.onmousemove = (e)=>{

        let targetDisplayObjcetArray = EventManager.getInstance().targetDisplayObjcetArray;
        lastX = currentX;
        lastY = currentY;
        currentX = e.offsetX;
        currentY = e.offsetY;

        if (isMouseDown) {

            for (let i = 0; i < targetDisplayObjcetArray.length; i++) {

                for (let event of targetDisplayObjcetArray[i].eventArray) {
                    
                    if (event.type.match("onmousemove") && event.ifCapture) {

                        event.func(e);
                    }
                }
            }

            for (let i = targetDisplayObjcetArray.length - 1; i >= 0; i--) {

                for (let event of targetDisplayObjcetArray[i].eventArray) {

                    if (event.type.match("onmousemove") && !event.ifCapture) {

                        event.func(e);
                    }
                }
            }
        }
    }


    window.onmouseup = (e)=>{

        isMouseDown = false;
        let targetDisplayObjcetArray = EventManager.getInstance().targetDisplayObjcetArray;
        targetDisplayObjcetArray.splice(0,targetDisplayObjcetArray.length);
        let newHitRusult = stage.hitTest(e.offsetX, e.offsetY)

        for (let i = targetDisplayObjcetArray.length - 1; i >= 0; i--) {

            for (let event of targetDisplayObjcetArray[i].eventArray) {

                if (event.type.match("onclick") && newHitRusult == hitResult ) {

                    event.func(e);
                }
            }
        }
    }

};
                         


