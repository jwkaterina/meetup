import { Context } from "./ctx";
import { Calendar } from "./calendar";
import { PrincipalCommon } from "./principal";

export class App {
    constructor() {
        this.ctx = Context.getInstance();
        this.calendar = new Calendar();
        this.principalCommon = new PrincipalCommon(this.calendar, "Kateryna Logoshko");
    }

    setup() {
        this.calendar.setup();
        this.ctx.switchToUserMode(this.calendar, this.principalCommon);
        this.setupControls();
    }

    setupControls() {
        document.getElementById("checkBox").addEventListener("click", () => this.modeChange());
        const radios = document.querySelectorAll(".radio-container");
        radios.forEach((radio) => {
            radio.addEventListener("change", () => this.ctx.userChange(this.calendar, this.principalCommon));
        });
    }

    modeChange() {
        const checkBox = document.getElementById("checkBox");
    
        if (checkBox.checked){
            this.ctx.switchToAdminMode(this.calendar, this.principalCommon);
        } else {
            this.ctx.switchToUserMode(this.calendar, this.principalCommon);
        }
    }
}