import './form-modal.css';
import './modals-common.css';
// import { editors } from './editors_list';

export default class FormModal {
    constructor(editors) {
        this.editors = editors;

        this.formModal = document.getElementById("formModal");
        this.place = document.getElementById("eventPlace");
        this.name = document.getElementById("eventMainName");
        this.date = document.getElementById("eventDate");
        this.start = document.getElementById("eventStart");
        this.end = document.getElementById("eventEnd");
        this.errors = document.getElementById("errors");
        this.createButton = this.formModal.querySelector(".createButton");
        this.updateButton = this.formModal.querySelector(".updateButton");
        this.deleteButton = this.formModal.querySelector(".deleteButton");
        this.cancelButton = this.formModal.querySelector(".cancelButton");
        this.flipCard = this.formModal.querySelector(".flip-card-inner");
        this.flipCardText = this.formModal.querySelector(".flipCardText");
    }

    get newStart() {
        return this.start.value;
    }

    get newEnd() {
        return this.end.value;
    }

    get newDate() {
        return this.date.value;
    }

    hideCreateButton() {
        this.createButton.style.display = "none";
    }

    hideUpdateButton() {
        this.updateButton.style.display = "none";
    }

    hideDeleteButton() {
        this.deleteButton.style.display = "none";
    }

    showCreateButton() {
        this.createButton.style.display = "";
    }

    showUpdateButton() {
        this.updateButton.style.display = "";
    }

    showDeleteButton() {
        this.deleteButton.style.display = "";
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
        this.name.innerHTML = options;
        this.customizeSelect();
    }

    showModal() {
        this.formModal.style.display = "block";
    }

    hideModal() {
        this.formModal.style.display = "none";
    }

    open() {
        this.showModal();
        this.hideCalendar();
    }

    close() {
        this.hideErrors();
        this.hideModal();
        this.showCalendar();
    }

    showCalendar() {
        document.body.classList.remove("opaque");
        document.body.style.overflow = 'auto'; 
    }

    hideCalendar() {
        scroll(0, 0);
        document.body.classList.add("opaque");
        document.body.style.overflow = 'hidden';
    }

    showError(message) {
        this.errors.classList.add("show-message");
        this.errors.querySelector("p").innerHTML = message;
    }

    hideErrors() {
        this.errors.querySelector("p").innerHTML = "";    
        this.errors.classList.remove("show-message");
        document.querySelectorAll(".alert").forEach((alert) => {
            alert.classList.remove("show-message");
        })
    }


    animateFlip() {
        this.flipCard.classList.add("flip");
        setTimeout(() => {
            this.flipCard.classList.remove("flip");
        },1000); 
    }

    writeOnFlip(text) {
        this.flipCardText.textContent = text;
    }

    formIsValid() {
        const inputs = Array.from(document.querySelectorAll(".shortInput"));

        if (inputs.find((input) => {return input.value == "";})) {
            inputs.forEach((input) => {
                if (input.value == "") {
                    const alert = input.nextElementSibling;
                    alert.classList.add("show-message");
                }
            });
            return false;
        } 

        inputs.forEach((input) => {
            const alert = input.nextElementSibling;
            alert.classList.remove("show-message");
        });
        return true;
    }

    customizeSelect() {
        const customSelect = document.querySelector(".custom-select");
        const select = document.getElementsByTagName("select")[0];
        const l = select.length;
 
        let selectedItem = document.querySelector(".select-selected");
        if(selectedItem) {
            selectedItem.remove();
        } 
        selectedItem = document.createElement("DIV");
        selectedItem.className = "select-selected";
        selectedItem.innerHTML = select.options[select.selectedIndex].innerHTML;
        const selectedId = select.options[select.selectedIndex].dataset.editorId;
        selectedItem.dataset.editorId = selectedId;
        customSelect.appendChild(selectedItem);
        
        let selectItems = document.querySelector(".select-items");
        if(selectItems) {
            selectItems.remove();
        } 
        selectItems = document.createElement("DIV");
        selectItems.className = "select-items select-hide";
        const h = document.querySelector(".shortInput").clientHeight;
        selectItems.style.top = h - 1 + "px";

        for (let i = 0; i < l; i++) {
            const option = document.createElement("DIV");
            option.innerHTML = select.options[i].innerHTML;
            option.dataset.editorId = select.options[i].dataset.editorId;
            if (option.dataset.editorId == selectedId) {
                option.className = "same-as-selected";
            };

            option.addEventListener("click", function(e) {
            const prevOption = selectedItem;
                for (let j = 0; j < l; j++) {
                    const thisId = this.dataset.editorId;
                if (select.options[i].dataset.editorId == thisId) {
                    select.selectedIndex = i;
                    prevOption.innerHTML = this.innerHTML;
                    prevOption.dataset.editorId = thisId;
                    const sameAsSelected = this.parentNode.querySelectorAll(".same-as-selected");
                    const sl = sameAsSelected.length;
                    for (let k = 0; k < sl; k++) {
                    sameAsSelected[k].classList.remove("same-as-selected");

                    }
                    this.className = "same-as-selected";
                    break;
                }
                }
                prevOption.click();
            });
            selectItems.appendChild(option);
        }
        customSelect.appendChild(selectItems);

        selectedItem.addEventListener("click", function(e) {
            e.stopPropagation();
            closeAllSelect(this);
            selectItems.classList.toggle("select-hide");
            this.classList.toggle("select-arrow-active");
        });

        function closeAllSelect(item) {
            const arrNo = [];
            const selectItems = document.getElementsByClassName("select-items");
            const selectedItem = document.getElementsByClassName("select-selected");
            const l1 = selectItems.length;
            const l2 = selectedItem.length;
            for (let i = 0; i < l2; i++) {
                if (item == selectedItem[i]) {
                arrNo.push(i)
                } else {
                selectedItem[i].classList.remove("select-arrow-active");
                }
            }
            for (let i = 0; i < l1; i++) {
                if (arrNo.indexOf(i)) {
                selectItems[i].classList.add("select-hide");
                }
            }
            }

            document.addEventListener("click", closeAllSelect);
        }

    }
