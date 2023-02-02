import { Hub, Auth as AmplifyAuth } from "aws-amplify";
import { Context } from "./ctx";
import PrincipalCommon from "./principal";
import User from "./user";

export default class Auth {
    constructor(calendar, userData) {
        this.calendar = calendar;
        this.principal = null;
        this.userData = userData;
        this.ctx = Context.getInstance();

        this.listenerCancelToken = this.setupAuthListener();

        this.loginButton = document.getElementById("loginButton");
        this.logoutButton = document.getElementById("logoutButton");
    
        this.setupControls();
    }

    setupAuthListener() {
        const listener = async (data) => {
            if(data.payload.event == 'signOut') {
                console.log('user signed out');
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

        const parsedUser = User.parseUser(user);
        this.principal = new PrincipalCommon(this.calendar, parsedUser);
        
        this.ctx.fetchUsers().then(() => this.calendar.loadEvents());
        
        if (groups.includes('admin') || groups.includes('editor')) {
            this.ctx.switchToEditorMode(this.calendar, this.principal);
        } else {
            this.ctx.switchToUserMode(this.calendar, this.principal);
        }
        this.userData.displayName(parsedUser.firstName, parsedUser.lastName);
        
        console.log(`user ${parsedUser.name} with id: ${parsedUser.id}  signed in`);
    }

    parseUserGroups(user) {
        return user.signInUserSession.accessToken.payload["cognito:groups"];
    }

    hasApproved(groups) {
        return !groups ? false : 
        groups.includes('admin') || groups.includes('editor') || groups.includes('user');
    }

    setupControls() {
        this.loginButton.addEventListener("click", () => AmplifyAuth.federatedSignIn());
        this.logoutButton.addEventListener("click", async () => {
            try {
                await AmplifyAuth.signOut();
            } catch (err) {
                console.log('error signing out: ', err);
            }
        });
    }
}