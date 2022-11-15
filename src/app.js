import { Context } from "./ctx";
import { Settings } from "./settings";
import { Calendar } from "./calendar";

export class App {
    constructor() {
        Settings.initInstance(6, 21, 50);
        this.ctx = Context.getInstance();
        this.calendar = new Calendar();
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