var TheEvent = (function () {
    function TheEvent(type, func, targetDisplayObject, ifCapture) {
        this.type = "";
        this.ifCapture = false;
        this.type = type;
        this.ifCapture = ifCapture;
        this.func = func;
        this.targetDisplayObject = targetDisplayObject;
    }
    return TheEvent;
}());
var EventManager = (function () {
    function EventManager() {
    }
    EventManager.getInstance = function () {
        if (EventManager.eventManager == null) {
            EventManager.eventManager = new EventManager();
            EventManager.eventManager.targetDisplayObjcetArray = new Array();
            return EventManager.eventManager;
        }
        else {
            return EventManager.eventManager;
        }
    };
    return EventManager;
}());
//# sourceMappingURL=Event.js.map