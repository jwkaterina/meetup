import PrincipalUser from "./principal-user.js";
import PrincipalEditor from "./principal-editor.js";
import UserInfoService from "./service/userinfo";


class Ctx {
  constructor() {
    this.principal = null;
    this.users = {};
    this.editors = {};
    this.usersLoadedPromise = null;
    this.currentEvent = null;
    this.weekStart = null;
    this.weekEnd = null;
    this.prevWeekStart = null;
    this.nextWeekStart = null;
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
    .then(users => {
      this.users = users.reduce((acc, currentUser) => {
        acc[currentUser.id] = currentUser
        return acc;
      }, {});
    })
    .catch(error => console.log('Cannot fetch users:', error));

    const editorsPromise = userInfo.listEditors()
    .then(editors => {
      this.editors = editors.reduce((acc, currentEditor) => {
        acc[currentEditor.id] = currentEditor
        return acc;
      }, {});
    })
    .catch(error => console.log('Cannot fetch editors:', error));

    this.usersLoadedPromise = Promise.all([usersPromise, editorsPromise]);

    return this.usersLoadedPromise;
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