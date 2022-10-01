import { User } from "./user.js";
import { Admin } from "./admin.js";

export const MODE = {
    VIEW: 1,
    UPDATE: 2,
    CREATE: 3,
};

export class Ctx {
    constructor() {
        this.mode = MODE.VIEW;
        this.principal = null;
        this.userName = "Kateryna Logoshko";
    }

    switchToUserMode(weekStart) {
        this.principal = new User(weekStart, this, this.userName);
        $("#addButton").hide();            
        console.log("User Mode");
    }

    switchToAdminMode(weekStart) {
        this.principal = new Admin(weekStart, this, this.userName);
        $("#addButton").show();            
        console.log("Admin Mode");
    }
}