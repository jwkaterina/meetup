import PrincipalUser from "./principal-user.js";
import PrincipalEditor from "./principal-editor.js";


class Ctx {
    constructor() {
        this.principal = null;
        this.currentEvent = null;
        this.weekStart = null;
        this.weekEnd = null;
    }

    switchToUserMode(calendar, principalCommon) {
        this.principal = new PrincipalUser(calendar, principalCommon);
        document.getElementById("addButton").style.display = "none";            
        console.log("User Mode");
    }

    switchToEditorMode(calendar, principalCommon) {
        this.principal = new PrincipalEditor(calendar, principalCommon);
        document.getElementById("addButton").style.display = "";            
        console.log("Editor Mode");
    }

    //TODO: remove before production
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
        console.log(principalCommon.use.name)
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