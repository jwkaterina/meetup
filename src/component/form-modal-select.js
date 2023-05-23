import html from './form-modal-select.hbs';

export default class Select {
    constructor(editors) {
        this.container = document.createElement("select");
        this.container.id = "eventMainName";
        this.container.className = "shortInput";
        this.container.setAttribute("name", "name");
        this.editors = editors;
    }

    get selectedName() {
        const index = this.container.selectedIndex;
        return this.container.options[index].innerHTML;
    }

    get selectedEditorId() {
        const index = this.container.selectedIndex;
        return this.container.options[index].dataset.editorId;
    }

    get options() {
        const result = [];
        for (let i = 0; i < this.container.length; i++) {
            result.push({
                selectName: this.#getNameAtIndex(i),
                selectEditorId: this.#getEditorIdAtIndex(i),
                selected: this.#getEditorIdAtIndex(i) == this.selectedEditorId
            });
        }
        return result;
    }

    set selectedIndex(index) {
        this.container.selectedIndex = index;
    }

    createOptions(mainId, user) {
        const undefinedUser = Object.values(this.editors).filter(editor => editor.name === "UNDEFINED UNDEFINED")[0];
        const undefinedName = "Autre";

        let mainName = "???";
        if(this.editors[mainId] && mainId !== undefinedUser.id) {
            mainName = this.editors[mainId].name;
        } else if(mainId === undefinedUser.id){
            mainName = undefinedName;
        }

        const options = [];
        options.push({selectName: mainName, selectEditorId: mainId});
        if(user.id != mainId) {
            options.push({selectName: user.name, selectEditorId: user.id});
        }
        Object.values(this.editors)
        .filter(editor => editor.id != mainId && editor.id != user.id && editor.id !== undefinedUser.id)
        .sort(( a, b ) => {
            if ( a.name < b.name ){
              return -1;
            }
            if ( a.name > b.name ){
              return 1;
            }
            return 0;
          })
        .forEach(editor => {
            options.push({selectName: editor.name, selectEditorId: editor.id});
        });
        options.push({selectName: undefinedName, selectEditorId: undefinedUser.id});

        this.container.innerHTML = html({options});
    }

    #getNameAtIndex(index) {
        return this.container.options[index].innerHTML;
    }

    #getEditorIdAtIndex(index) {
        return this.container.options[index].dataset.editorId;
    }
}