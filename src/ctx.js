import { User } from "./user.js";
import { Admin } from "./admin.js";


class Ctx {
    constructor() {
        this.principal = null;
        this.currentEvent = null;
        this.weekStart = null;
        this.weekEnd = null;
    }

    switchToUserMode(calendar, principalCommon) {
        this.principal = new User(calendar, principalCommon);
        document.getElementById("addButton").style.display = "none";            
        console.log("User Mode");
    }

    switchToAdminMode(calendar, principalCommon) {
        this.principal = new Admin(calendar, principalCommon);
        document.getElementById("addButton").style.display = "";            
        console.log("Admin Mode");
    }

    userChange(calendar, principalCommon) {
        const radioA = document.getElementById("userA");
        const radioB = document.getElementById("userB");
        const radioC = document.getElementById("userC");

        if(radioA.checked) {
          principalCommon.newName("Kateryna Logoshko");
        } else if(radioB.checked) {
          principalCommon.newName("Andrii Logoshko");
        } else if(radioC.checked) {
          principalCommon.newName("Liubov Zasadna");
        } 
        console.log(principalCommon.userName)
        calendar.loadEvents();
    }
}

export const Context = (() => {
    let instance;
  
    function createInstance() {
      const object = new Ctx();
      return object;
    }
  
    return {
      getInstance: function() {
        if(!instance){
          instance = createInstance();
        }
        return instance;
      }
    }
  })();