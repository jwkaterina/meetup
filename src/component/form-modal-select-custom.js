import Select from './form-modal-select'
import html from './form-modal-select-custom.hbs';
import './form-modal-select-custom.css';

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