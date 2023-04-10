import './custom-select.css';

export default class CustomSelect {
    constructor(editors) {
        this.editors = editors;
        this.container = document.querySelector(".custom-select")
        this.select = this.container.querySelector("select");
    }

    showOptions(mainId, user) {
        let mainName = "???";
        if(this.editors[mainId]) {
            mainName = this.editors[mainId].name;
        }
       
        let options = `<option value="${mainName}" data-editor-id="${mainId}">${mainName}</option>`;
        if(user.id != mainId) {
            options += `<option value="${user.name}" data-editor-id="${user.id}">${user.name}</option>`
        }
        Object.values(this.editors)
        .filter(editor => editor.id != mainId && editor.id != user.id)
        .forEach(editor => options += `<option value="${editor.name}" data-editor-id="${editor.id}">${editor.name}</option>`);
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
            selectItems.classList.toggle("select-hide");
            selectedItem.classList.toggle("select-arrow-active");
        });

        document.addEventListener("click", () => {
            selectedItem.classList.remove("select-arrow-active");
            selectItems.classList.add("select-hide");
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
        selectItems.className = "select-items select-hide";
        const h = document.querySelector(".shortInput").clientHeight;
        selectItems.style.top = h - 1 + "px";

        // this.createOptions(selectedId, selectedItem, selectItems);
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
            });
        selectItems.appendChild(option);
        }
    }
}