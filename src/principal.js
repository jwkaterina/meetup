import { Context } from "./ctx";
import { Event } from "./event";

export class PrincipalCommon {

    userFound(event) {
        const ctx = Context.getInstance();
        const userName = ctx.userName;
        if (event.names.find((user) => {return user == userName;})) {
            return true;
        } else {
            return false;
        }
    }
}