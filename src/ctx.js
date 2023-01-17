import PrincipalUser from "./principal-user.js";
import PrincipalEditor from "./principal-editor.js";
import UserInfoService from "./service/userinfo";


class Ctx {
    constructor() {
        this.principal = null;
        this.users = [];
        this.editors = [];
        this.usersLoadedPromise = null;
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

    fetchUsers() {
      const userInfo = new UserInfoService();
      const usersPromise = userInfo.listUsers()
      .then(users => this.users.push(...users))
      .catch(error => console.log('Cannot fetch users:', error));

      const editorsPromise = userInfo.listEditors()
      .then(editors => this.editors.push(...editors))
      .catch(error => console.log('Cannot fetch editors:', error));

      this.usersLoadedPromise = Promise.all([usersPromise, editorsPromise]);
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