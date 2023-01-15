import './form-modal.css';
import './modals-common.css';
import UserInfoService from "../service/userinfo";
// import { editors } from './editors_list';

export default class FormModal {
    constructor() {
        this.editors = [];
        this.userInfo = new UserInfoService();
        this.userInfo.listEditors()
        .then(editors => this.editors.push(...editors))
        .catch(error => console.log(error.message));

        // this.editors = editors;

        this.formModal = document.getElementById("formModal");
        this.place = document.getElementById("eventPlace");
        this.name = document.getElementById("eventMainName");
        this.date = document.getElementById("eventDate");
        this.start = document.getElementById("eventStart");
        this.end = document.getElementById("eventEnd");
        this.submitButton = this.formModal.querySelector(".submitButton");
        this.deleteButton = this.formModal.querySelector(".deleteButton");
        this.cancelButton = this.formModal.querySelector(".cancelButton");
        this.flipCard = this.formModal.querySelector(".flip-card-inner");
        this.flipCardText = this.formModal.querySelector(".flipCardText");
    }

    hideSubmitButton() {
        this.submitButton.style.display = "none";
    }

    hideDeleteButton() {
        this.deleteButton.style.display = "none";
    }

    showSubmitButton(value) {
        this.submitButton.style.display = "";
        this.submitButton.value = value;
    }

    showDeleteButton() {
        this.deleteButton.style.display = "";
    }

    showOptions(main, user) {
        let options = `<option id="${main.id}" value="${main.name}">${main.name}</option>`;
        if(user.id != main.id) {
            options += `<option id="${user.id}" value="${user.name}">${user.name}</option>`
        }
        this.editors.forEach((editor) => {
            if(editor.id != main.id && editor.id != user.id) {
                options += `<option id="${editor.id}" value="${editor.name}">${editor.name}</option>`
            }
        });
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

    hideErrors() {
        document.getElementById("errors").querySelector("p").innerHTML = "";    
        document.getElementById("errors").classList.remove("show-message");
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
            console.log("selectedItem deleted");
        } 
        selectedItem = document.createElement("DIV");
        selectedItem.setAttribute("class", "select-selected");
        selectedItem.innerHTML = select.options[select.selectedIndex].innerHTML;
        selectedItem.id = select.options[select.selectedIndex].id;
        customSelect.appendChild(selectedItem);
        
        let selectItems = document.querySelector(".select-items");
        if(selectItems) {
            selectItems.remove();
            console.log("selectItems deleted");
        } 
        selectItems = document.createElement("DIV");
        selectItems.setAttribute("class", "select-items select-hide");
        const h = document.querySelector(".shortInput").clientHeight;
        selectItems.style.top = h - 1 + "px";

        for (let i = 0; i < l; i++) {
            const option = document.createElement("DIV");
            option.innerHTML = select.options[i].innerHTML;
            option.id = select.options[i].id;
            if (option.id == selectedItem.id) {
                option.setAttribute("class", "same-as-selected");
            };

            option.addEventListener("click", function(e) {
            const prevOption = selectedItem;
                for (let j = 0; j < l; j++) {
                if (select.options[i].id == this.id) {
                    select.selectedIndex = i;
                    prevOption.innerHTML = this.innerHTML;
                    prevOption.id = this.id;
                    const sameAsSelected = this.parentNode.querySelectorAll(".same-as-selected");
                    const sl = sameAsSelected.length;
                    for (let k = 0; k < sl; k++) {
                    sameAsSelected[k].removeAttribute("class");

                    }
                    this.setAttribute("class", "same-as-selected");
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
