import DataModal from "./component/data-modal";
import { Context } from "./ctx";
import "./user-data.css";

export default class UserData {
    constructor(webpush) {
        this.webpush = webpush;
        this.ctx = Context.getInstance();
        this.dataModal = new DataModal();
        this.logMobile = document.getElementById("loggedButton-circle");
        this.logPC = document.getElementById("loggedButton-name")
        this.loadingAnime = document.getElementById("loading-data");

        this.loadEventListeners();
    }
    
    loadEventListeners() {
        this.logPC.addEventListener("click", () => {
            this.showMenu()
        });
        this.logMobile.addEventListener("click", () => {
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
        document.getElementById("log-data").addEventListener("click", () => {
            this.openDataModal();
        });
        this.dataModal.submitButton.addEventListener("click", async () => {
            this.updateData();
        });
        this.dataModal.cancelButton.addEventListener("click", (e) => {
            this.dataModal.close();
        });

        if(this.webpush) {
            this.dataModal.onNotifyMe(this.webpush);
        }
    }

    showMenu() {
        const dropdown = document.getElementById("dropdown");
        dropdown.classList.toggle("show-menu");
    }

    openDataModal() {
        const user = this.ctx.principal.user;

        this.dataModal.open();
        this.dataModal.firstName.value = user.firstName;
        this.dataModal.lastName.value = user.lastName;
    }

    updateData() {
        const user = this.ctx.principal.user;
    
        if(this.dataModal.formIsValid()) {
            this.dataModal.disableButtons();
            this.loadingAnime.style.display = "block";
    
            user.firstName = this.dataModal.firstName.value;
            user.firstName = this.dataModal.firstName.value;
            user.lastName = this.dataModal.lastName.value;
    
            setTimeout(() => {
                this.loadingAnime.style.display = "none";
                this.dataModal.animateFlip();            
                setTimeout(() => {
                    this.dataModal.close();
                },1500);
            }, 500);
    
            console.log(user);
            return user;
        } else {
            return
        }
    }

    displayName(firstName, lastName) {
        document.getElementById("loginButton").style.display = "none";

        const initials = firstName.substring(0, 1).toUpperCase() + lastName.substring(0, 1).toUpperCase();

        const media = window.matchMedia("(max-width: 800px)");
        if (media.matches) {
            this.logMobile.style.display = "inline-block";
            this.logMobile.innerHTML = initials;
        } else {
            this.logPC.style.display = "flex";
            this.logPC.querySelector(".log-text").innerHTML = `Salut, ${firstName}` ;
        }
    }
}