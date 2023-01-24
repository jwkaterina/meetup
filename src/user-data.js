import DataModal from "./component/data-modal";
import { Context } from "./ctx";



export default class UserData {
    constructor() {
        this.ctx = Context.getInstance();
        this.dataModal = new DataModal();

        this.loadEventListeners();
    }
    
    loadEventListeners() {
        document.getElementById("log-data").addEventListener("click", () => {
            this.openDataModal();
        });
        this.dataModal.submitButton.addEventListener("click", async () => {
            this.updateData();
        });
        this.dataModal.cancelButton.addEventListener("click", (e) => {
            e.preventDefault();
            this.dataModal.close();
        });
    }

    openDataModal() {
        const user = this.ctx.principal.user;
        // console.log(user);

        this.dataModal.open();
        this.dataModal.firstName.value = user.firstName;
        this.dataModal.lastName.value = user.lastName;
        this.dataModal.phoneNumber.value = user.phoneNumber;
    }

    updateData() {
        const user = this.ctx.principal.user;

        if(this.dataModal.formIsValid()) {

            // Check for empty fields
            user.firstName = this.dataModal.firstName.value;
            user.firstName = this.dataModal.firstName.value;
            user.lastName = this.dataModal.lastName.value;
            user.phoneNumber = this.dataModal.phoneNumber.value;

            this.dataModal.animateFlip();       
            setTimeout(() => {
                this.dataModal.close();
            },2000);

            // console.log(user);
            return user;
        } else {
            return
        }
    }

    displayName(firstName, lastName) {
        const loginButton = document.getElementById("loginButton");
        const logMobile = document.getElementById("loggedButton-circle");
        const logPC = document.getElementById("loggedButton-name")

        loginButton.style.display = "none";

        const initials = firstName.substring(0, 1).toUpperCase() + lastName.substring(0, 1).toUpperCase();

        const media = window.matchMedia("(max-width: 800px)");
        if (media.matches) {
            logMobile.style.display = "inline-block";
            logMobile.innerHTML = initials;
        } else {
            logPC.style.display = "flex";
            logPC.querySelector(".log-text").innerHTML = `Salut, ${firstName}` ;
        }

        logPC.addEventListener("click", () => {
            this.showMenu()
        });
        logMobile.addEventListener("click", () => {
            this.showMenu()
        });
        document.addEventListener("click", (e) => {
            if (!e.target.matches('.logged')) {
                const dropdown = document.getElementById("dropdown");
                  if (dropdown.classList.contains('show-menu')) {
                    dropdown.classList.remove('show-menu');
                  }
                }
            });
    }

    showMenu() {
        const dropdown = document.getElementById("dropdown");
        dropdown.classList.toggle("show-menu");

        const media = window.matchMedia("(max-width: 800px)");
        if (media.matches) {
            dropdown.style.width = 50 + "vw";
        } else {
            const loggedButton = document.getElementById("loggedButton-name");
            const h = loggedButton.clientWidth;
            dropdown.style.width = h + 50 + "px";
        }
    }
}