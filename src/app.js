import { Ctx } from "./ctx.js";
import { Calendar } from "./calendar";

export class App {
    constructor() {
        this.ctx = new Ctx();
        this.calendar = new Calendar(this.ctx);
    }

    setup() {
        this.calendar.setup();
        this.ctx.switchToUserMode(this.calendar);
        this.setupControls();
    }

    setupControls() {
        $("#checkBox").click(() => this.modeChange());
        $(".radio-container").change(() => this.ctx.userChange());
    }

    modeChange() {
        const checkBox = document.getElementById("checkBox");
    
        if (checkBox.checked){
            this.ctx.switchToAdminMode(this.calendar);
        } else {
            this.ctx.switchToUserMode(this.calendar);
        }
    }
}