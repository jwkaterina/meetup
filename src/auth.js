import { Hub, Auth as AmplifyAuth } from "aws-amplify";
import { Context } from "./ctx";
import PrincipalCommon from "./principal"

export default class Auth {
    constructor(calendar) {
        this.calendar = calendar;
        this.principal = null;
        this.ctx = Context.getInstance();

        this.listenerCancelToken = this.setupAuthListener();

        this.loginBtn = document.getElementById("loginButton");
        this.checkBox = document.getElementById("checkBox");
        this.radios = document.querySelectorAll(".radio-container");
        this.setupControls();
    }

    setupAuthListener() {
        const listener = async (data) => {
            switch (data.payload.event) {
                case 'signIn':
                    this.checkUser();
                    break;
                case 'signOut':
                    console.log('user signed out');
                    //TODO: Clean the app
                    break;
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

        const userName = this.parseUserName(user);
        this.principal = new PrincipalCommon(this.calendar, userName);
        
        if (groups.includes('admin') || groups.includes('editor')) {
            this.ctx.switchToAdminMode(this.calendar, this.principal);
            this.checkBox.checked = true;
        } else {
            this.ctx.switchToUserMode(this.calendar, this.principal);
            this.checkBox.checked = false;
        }
        this.calendar.setup();
        console.log(`user ${userName} signed in`);
    }

    parseUserGroups(user) {
        return user.signInUserSession.accessToken.payload["cognito:groups"];
    }

    hasApproved(groups) {
        return groups.includes('admin') || groups.includes('editor') || groups.includes('user');
    }

    parseUserName(user) {
        const givenName = user.attributes.given_name;
        const familyName = user.attributes.family_name;
        return `${givenName} ${familyName}`;
    }

    setupControls() {
        this.loginBtn.addEventListener("click", () => AmplifyAuth.federatedSignIn());

        //TODO: remove before production
        this.checkBox.addEventListener("click", () => this.modeChange());
        this.radios.forEach((radio) => {
            radio.addEventListener("change", () => this.ctx.userChange(this.calendar, this.principal));
        });
    }


    //TODO: remove before production
    modeChange() {
    
        if (this.checkBox.checked){
            this.ctx.switchToAdminMode(this.calendar, this.principal);
        } else {
            this.ctx.switchToUserMode(this.calendar, this.principal);
        }
    }
}