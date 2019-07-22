class Editor{
    constructor(){
        this._tabSize = 4;
        
    }
    set tabSize(tabSize){
        this._tabSize = tabSize;
    }
    get tabSize(){
        return this._tabSize;
    }
    settings(){
        this.editorStyle = {
            tabSize         : 4,
            textColor       : 'blue',
            backgroundColor : '#e1e1e1',
            tagColor        : 'red',
        }
        
        // Class List
        this.classList = {
            lines       : 'dw lines',
            linesActive : 'dw lines active',
            brackets    : 'dw brackets',
            tag         : 'dw tag',
            attr        : 'dw attr-name',
            string      : 'dw string',
        };
    }
    init(){
        this.settings();
    }
    createElement(tag) {
        return document.createElement(tag);
    }
    appendChild(parent, child) {
        return parent.appendChild(child);
    }
    getElementById(selector){
        return document.getElementById(selector);
    }
    addEventListener(parent, type, listener){
        return parent.addEventListener(type, listener)
    }
    addEventListeners(el, s, fn) {
        s.split(' ').forEach(e => el.addEventListener(e, fn, false));
    }
    createTextNode(text) {
        return document.createTextNode(text);
    };
    update(){
        // this.settings();
    }
};


