import { User } from "./user.js";
import { Admin } from "./admin.js";


export class Ctx {
    constructor() {
        this.principal = null;
        this.userName = "Kateryna Logoshko";
    }

    switchToUserMode(calendar) {
        this.principal = new User(calendar, this);
        $("#addButton").hide();            
        console.log("User Mode");
    }

    switchToAdminMode(calendar) {
        this.principal = new Admin(calendar, this);
        $("#addButton").show();            
        console.log("Admin Mode");
    }
}