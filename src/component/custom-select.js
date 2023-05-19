import html from './custom-select.hbs';
import selectOptionsHtml from './custom-select-options.hbs';
import './custom-select.css';

class Select {
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

        this.container.innerHTML = selectOptionsHtml({options});
    }

    #getNameAtIndex(index) {
        return this.container.options[index].innerHTML;
    }

    #getEditorIdAtIndex(index) {
        return this.container.options[index].dataset.editorId;
    }
}

export default class CustomSelect {
    constructor(editors, container) {
        this.editors = editors;
        this.container = container;
        this.select = new Select(editors);
    }

    showOptions(mainId, user) {
        this.select.createOptions(mainId, user);

        const h = document.querySelector(".shortInput").clientHeight;

        this.container.innerHTML = html({
            selectedName: this.select.selectedName,
            selectedEditorId: this.select.selectedEditorId,
            styleTop: h - 1,
            options: this.select.options
        });
        this.container.appendChild(this.select.container);
        this.#registerListeners();
    }

    #registerListeners() {
        const selectedItem = this.container.querySelector(".select-selected");
        const selectItems = this.container.querySelector(".select-items");

        selectedItem.addEventListener("click",(e) => {
            e.stopPropagation();
            selectItems.classList.toggle("select-show");
            selectedItem.classList.toggle("select-arrow-active");
            selectedItem.classList.add("select-active");
        });

        document.addEventListener("click", (e) => {
            if (!e.target.matches('.select-selected') && !e.target.parentNode.matches('.select-items')) {
                selectedItem.classList.remove("select-active");
            }
            if (selectItems.classList.contains('select-show')) {
                selectItems.classList.remove("select-show");
                selectedItem.classList.remove("select-arrow-active");
            }
        });

        for (const option of selectItems.children) {
            option.addEventListener("click", () => {
                this.select.selectedIndex = parseInt(option.dataset.index);
                selectedItem.innerHTML = option.innerHTML;
                selectedItem.dataset.editorId = option.dataset.editorId;;
                const sameAsSelected = option.parentNode.querySelector(".same-as-selected");
                sameAsSelected.classList.remove("same-as-selected");
                option.className = "same-as-selected";
            });
        }
    }
}