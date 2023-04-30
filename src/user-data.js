import UserInfoService from "./service/userinfo";
import DataModal from "./component/data-modal";
import "./component/snackbar";

import { Context } from "./ctx";
import "./user-data.css";

export default class UserData {
    constructor(webpush) {
        this.userInfo = new UserInfoService();
        this.webpush = webpush;
        this.ctx = Context.getInstance();
        this.dataModal = new DataModal();
        this.snackbar = document.querySelector("snack-bar");
        this.logMobile = document.getElementById("loggedButton-circle");
        this.logPC = document.getElementById("loggedButton-name");
        this.loadingAnime = document.getElementById("loading-data");
        this.dropdown = document.getElementById("dropdown");
        this.logData = document.getElementById("log-data");
        this.logBtn = document.getElementById("loginButton");

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
                  if (this.dropdown.classList.contains('show-menu')) {
                    this.dropdown.classList.remove('show-menu');
                  }
                }
            });
        this.logData.addEventListener("click", () => {
            this.openDataModal();
        });
        this.dataModal.onSubmit(async () => {
            await this.updateData();
        });

        if(this.webpush) {
            this.dataModal.onNotifyMe(this.webpush);
        }
    }

    showMenu() {
        this.dropdown.classList.toggle("show-menu");
    }

    openDataModal() {
        this.dataModal.open();
        
        const user = this.ctx.principal.user;
        if(this.userInfo.canUpdatePrincipalAttributes()) {
            this.dataModal.firstName.value = user.firstName;
            this.dataModal.lastName.value = user.lastName;
        } else {
            this.dataModal.inputs.forEach((input) => {
                input.style.display ="none";
            });
            this.dataModal.labels.forEach((label) => {
                label.style.display = "block";
            })
            this.dataModal.firstNameLabel.innerHTML = `Prénom: ${user.firstName}`;
            this.dataModal.lastNameLabel.innerHTML = `Nom: ${user.lastName}`;
        }
    }

    async updateData() {
        const user = this.ctx.principal.user;

        if(!this.userInfo.canUpdatePrincipalAttributes()) {
            this.dataModal.disableButtons();            
            this.loadingAnime.style.display = "block";
            setTimeout(() => {
                this.loadingAnime.style.display = "none";
                this.dataModal.animateFlip();            
                setTimeout(() => {
                    this.dataModal.close();
                    window.location.reload();
                },1500);
            }, 500);
            return
        }
    
        if(this.dataModal.formIsValid()) {
            this.dataModal.disableButtons();
            this.loadingAnime.style.display = "block";
    
            user.firstName = this.dataModal.firstName.value;
            user.firstName = this.dataModal.firstName.value;
            user.lastName = this.dataModal.lastName.value;
    
            try{
                await this.userInfo.updatePrincipal(user);

                setTimeout(() => {
                    this.loadingAnime.style.display = "none";
                    this.dataModal.animateFlip();            
                    setTimeout(() => {
                        this.dataModal.close();
                        window.location.reload();
                    },1500);
                }, 500);
            } catch (error) {
                this.loadingAnime.style.display = "none";
                this.snackbar.show("Oups! Impossible de modifier...");
                setTimeout(() => {
                    this.dataModal.close();
                },1000);
                console.log("Cannot Update Principal:", error);
            }
            return user;
        } else {
            return
        }
    }

    displayName(firstName, lastName) {
        this.logBtn.style.display = "none";

        const initials = firstName.substring(0, 1).toUpperCase() + lastName.substring(0, 1).toUpperCase();

        const media = window.matchMedia("(max-width: 720px)");
        if (media.matches) {
            this.logMobile.style.display = "inline-block";
            this.logMobile.innerHTML = initials;
        } else {
            this.logPC.style.display = "flex";
            this.logPC.querySelector(".log-text").innerHTML = `Salut, ${firstName}` ;
        }
    }
}