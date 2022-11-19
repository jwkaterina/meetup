import { Context } from "./ctx";
import { Settings } from "./settings";
import { Calendar } from "./calendar";
import './calendar.css';

export class App {
    constructor() {
        const dayStarts = 6;
        const dayEnds = 21;
        const slotHeight = 50;
        Settings.initInstance(dayStarts, dayEnds, slotHeight);
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
        $(".radio-container").change(() => this.ctx.userChange(this.calendar));
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