import './custom-select.css';

export default class CustomSelect {
    constructor(editors) {
        this.editors = editors;
        this.container = document.querySelector(".custom-select")
        this.select = this.container.querySelector("select");
    }

    showOptions(mainId, user) {
        const undefinedUser = Object.values(this.editors).filter(editor => editor.name === "UNDEFINED UNDEFINED")[0];
        const undefinedName = "Autre";

        let mainName = "???";
        if(this.editors[mainId] && mainId !== undefinedUser.id) {
            mainName = this.editors[mainId].name;
        } else if(mainId === undefinedUser.id){
            mainName = undefinedName;
        }
       
        let options = `<option value="${mainName}" data-editor-id="${mainId}">${mainName}</option>`;
        if(user.id != mainId) {
            options += `<option value="${user.name}" data-editor-id="${user.id}">${user.name}</option>`
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
            options += `<option value="${editor.name}" data-editor-id="${editor.id}">${editor.name}</option>`;
        });
        options += `<option value=${undefinedName} data-editor-id=${undefinedUser.id}>${undefinedName}</option>`;        
        this.select.innerHTML = options;
        this.customizeSelect();
    }

    customizeSelect() {
        const selectedId = this.select.options[this.select.selectedIndex].dataset.editorId;
        const selectedItem = this.createSeletedItem();
        const selectItems = this.createSelectItems(selectedId, selectedItem);
        this.createOptions(selectedId, selectedItem, selectItems);

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
    }

    createSeletedItem() {
        let selectedItem = document.querySelector(".select-selected");
        if(selectedItem) {
            selectedItem.remove();
        } 
        selectedItem = document.createElement("div");
        selectedItem.className = "select-selected";
        selectedItem.innerHTML = this.select.options[this.select.selectedIndex].innerHTML;
        const selectedId = this.select.options[this.select.selectedIndex].dataset.editorId;
        selectedItem.dataset.editorId = selectedId;
        this.container.appendChild(selectedItem);

        return selectedItem;
    }

    createSelectItems(selectedId, selectedItem) {
        let selectItems = document.querySelector(".select-items");
        if(selectItems) {
            selectItems.remove();
        } 
        selectItems = document.createElement("div");
        selectItems.className = "select-items";
        const h = document.querySelector(".shortInput").clientHeight;
        selectItems.style.top = h - 1 + "px";
        this.container.appendChild(selectItems);

        return selectItems;
    }

    createOptions(selectedId, selectedItem, selectItems) {
        for (let i = 0; i < this.select.length; i++) {
            const option = document.createElement("div");
            option.innerHTML = this.select.options[i].innerHTML;
            option.dataset.editorId = this.select.options[i].dataset.editorId;
            if (option.dataset.editorId == selectedId) {
                option.className = "same-as-selected";
            };

            option.addEventListener("click", () => {
                const prevOption = selectedItem;
                for (let j = 0; j < this.select.length; j++) {
                    const optionId = option.dataset.editorId;
                    if (this.select.options[i].dataset.editorId == optionId) {
                        this.select.selectedIndex = i;
                        prevOption.innerHTML = option.innerHTML;
                        prevOption.dataset.editorId = optionId;
                        const sameAsSelected = option.parentNode.querySelector(".same-as-selected");
                        sameAsSelected.classList.remove("same-as-selected");
                        option.className = "same-as-selected";
                        break;
                    }
                }
                selectedItem.classList.add("select-arrow-active");
            });
        selectItems.appendChild(option);
        }
    }
}