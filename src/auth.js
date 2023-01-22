import { Hub, Auth as AmplifyAuth } from "aws-amplify";
import { Context } from "./ctx";
import PrincipalCommon from "./principal";
import DataModal from "./component/data-modal";
import User from "./user";

export default class Auth {
    constructor(calendar) {
        this.calendar = calendar;
        this.principal = null;
        this.ctx = Context.getInstance();
        this.dataModal = new DataModal();

        this.listenerCancelToken = this.setupAuthListener();

        this.loginButton = document.getElementById("loginButton");
        this.logoutButton = document.getElementById("logoutButton");
    
        this.setupControls();
    }

    setupAuthListener() {
        const listener = async (data) => {
            if(data.payload.event == 'signOut') {
                console.log('user signed out');
                //TODO: Clean the app
            }
        };

        return Hub.listen('auth', listener);
    }

    async checkUser() {
        try {
            const user = await this.getUser();
            if (user) {
                this.processUser(user);
            }
        } catch (err) {
            console.log("Cannot check for current user:", err);
        }
    }

    async getUser() {
        return await AmplifyAuth.currentAuthenticatedUser();
    }

    processUser(user) {
        const groups = this.parseUserGroups(user);
        if (!this.hasApproved(groups)) {
            console.log('uninvited user signed in');
            return;
        }

        const parsedUser = this.parseUser(user);
        this.principal = new PrincipalCommon(this.calendar, parsedUser);
        
        this.ctx.fetchUsers().then(() => this.calendar.loadEvents());
        
        if (groups.includes('admin') || groups.includes('editor')) {
            this.ctx.switchToEditorMode(this.calendar, this.principal);
        } else {
            this.ctx.switchToUserMode(this.calendar, this.principal);
        }
        this.displayName(parsedUser.firstName, parsedUser.lastName);
        
        console.log(`user ${parsedUser.name} with id: ${parsedUser.id}  signed in`);
    }

    displayName(firstName, lastName) {
        const logMobile = document.getElementById("loggedButton-circle");
        const logPC = document.getElementById("loggedButton-name")

        this.loginButton.style.display = "none";

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

    openDataModal() {
        this.dataModal.open();
    }

    parseUserGroups(user) {
        return user.signInUserSession.accessToken.payload["cognito:groups"];
    }

    hasApproved(groups) {
        return !groups ? false : 
        groups.includes('admin') || groups.includes('editor') || groups.includes('user');
    }

    parseUser(user) {
        const givenName = user.attributes.given_name;
        const familyName = user.attributes.family_name;
        return new User(user.username, givenName, familyName);
    }

    setupControls() {
        this.loginButton.addEventListener("click", () => AmplifyAuth.federatedSignIn());
        this.logoutButton.addEventListener("click", () => {
             // Create function
            console.log("logout");
        }
       
        );
     
        document.getElementById("log-data").addEventListener("click", () => {
            this.openDataModal()
        });
        this.dataModal.submitButton.addEventListener("click", async () => {
            // Create function
            console.log("submit");
            this.dataModal.close();
        });
        this.dataModal.cancelButton.addEventListener("click", (e) => {
            e.preventDefault();
            this.dataModal.close();
        });
    }
}