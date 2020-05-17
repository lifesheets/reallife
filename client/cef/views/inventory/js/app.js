



class ClientItem extends EventTarget {
    constructor(data) {
        this.data = data;


    }
}
class StorageGrid extends EventTarget {
    /*********************** Storage ******************
     *** Input: identifier, alignment(left or right) ***
     ***************************************************/
    constructor(identifier = "none", alignment = true, parentName) {
        super();
        this.id = identifier;
        this.alignment = alignment;
        this.parentName = parentName;
        this.element = $("<div class='storage'></div>")
        $(this.parentName + " >." + (alignment ? "left" : "right")).append(this.element)
    }
    render() {
        
    }
    activate() {}
    deactivate() {}
}
class StorageManager extends EventTarget {
    /*************** Storage *************
     *********** Input: identifier ********
     **************************************/
    constructor(selector) {
        super();
        this.selector = selector;
        this.element = $(this.selector);
        this.element.append("<div class='left'></div>");
        this.element.append("<div class='right'></div>");
        this.tabs = [];
    }
    getTab(identifier) {
        return this.tabs.find(e => {
            return e.id == identifier;
        })
    }
    addTab(identifier, alignment = true) {
        this.tabs.push(new Storage(identifier, leftOrRight, this.selector));
    }
    toggle() {

    }
}
const Manager = new StorageManager("#storage_container");

function callEval(type, ident, ...params) {}