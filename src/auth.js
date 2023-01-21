import { Hub, Auth as AmplifyAuth } from "aws-amplify";
import { Context } from "./ctx";
import PrincipalCommon from "./principal";
import User from "./user";

export default class Auth {
    constructor(calendar) {
        this.calendar = calendar;
        this.principal = null;
        this.ctx = Context.getInstance();

        this.listenerCancelToken = this.setupAuthListener();

        this.loginButton = document.getElementById("loginButton");
    
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
        this.loginButton.style.display = "none";

        const initials = firstName.substring(0, 1).toUpperCase() + lastName.substring(0, 1).toUpperCase();

        const media = window.matchMedia("(max-width: 800px)");

        if (media.matches) {
            document.getElementById("loggedButton-circle").style.display = "inline-block";
            document.getElementById("loggedButton-circle").innerHTML = initials;
        } else {
            document.getElementById("loggedButton-name").style.display = "flex";
            document.getElementById("loggedButton-name").querySelector(".log-text").innerHTML = `Salut, ${firstName}` ;
        }
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
    }
}