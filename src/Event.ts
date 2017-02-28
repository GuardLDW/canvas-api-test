class TheEvent{

    type = "";
    ifCapture = false;
    targetDisplayObject : DisplayObject;
    func : Function;

    constructor(type : string, func : Function, targetDisplayObject : DisplayObject, ifCapture : boolean){

        this.type = type;
        this.ifCapture = ifCapture;
        this.func = func;
        this.targetDisplayObject = targetDisplayObject;

    }
}

class EventManager{

    targetDisplayObjcetArray : DisplayObject[];
    static eventManager : EventManager;
    
    static getInstance(){
        if(EventManager.eventManager == null){

            EventManager.eventManager = new EventManager();
            EventManager.eventManager.targetDisplayObjcetArray = new Array();
            return EventManager.eventManager;

        }else{

            return EventManager.eventManager;
        }
    }
}