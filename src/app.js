import { Context } from "./ctx";
// import { Settings } from "./settings";
import { Calendar } from "./calendar";
import { PrincipalCommon } from "./principal";
import './calendar.css';
import { radio } from "aws-amplify";

export class App {
    constructor() {
        // const dayStarts = 1;
        // const dayEnds = 24;
        // const slotHeight = 50;
        // const slotHeightMobile = 50;
        // Settings.initInstance(dayStarts, dayEnds, slotHeight, slotHeightMobile);
        this.ctx = Context.getInstance();
        this.calendar = new Calendar();
        this.principalCommon = new PrincipalCommon(this.calendar);
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
            radio.addEventListener("change", () => this.ctx.userChange(this.calendar));
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