import { dateString, getDayIndex, generateId } from "./helper";
import { PrincipalCommon } from "./principal";
import { Settings } from "./settings";
import { Context } from "./ctx";

export class Event {
    constructor(data) {
        this.id = data.id || generateId();
        this.place = data.place;
        this.names = data.names;
        this.start = data.start;
        this.end = data.end;
        this.date = data.date;
        this.prevDate = this.date;
        this.color = data.color;
        this.settings = Settings.getInstance();
        this.common = new PrincipalCommon();
    }

    get dayIndex() {
        return getDayIndex(new Date(this.date));
    }

    get duration() {
        return (
            (new Date(`${this.date}T${this.end}`).getTime() -
                new Date(`${this.date}T${this.start}`).getTime()) /
            (1000 * 60)
        );
    }

    get startHour() {
        return parseInt(this.start.substring(0, 2));
    }

    get startMinutes() {
        return parseInt(this.start.substring(3, 5));
    }

    get endHour() {
        return parseInt(this.end.substring(0, 2));
    }

    get endMinutes() {
        return parseInt(this.end.substring(3, 5));
    }

    show() {
        const ctx = Context.getInstance();
        if (
            this.date < dateString(ctx.weekStart) ||
            this.date > dateString(ctx.weekEnd)
        ) {
            $(`#${this.id}`).remove();
            return;
        }
        let eventSlot;
        if ($(`#${this.id}`).length) {
            eventSlot = $(`#${this.id}`);
        } else {
            eventSlot = $("<div></div>")
                .addClass("event")
                .attr("id", this.id)
                .click(() => ctx.principal.openEventModal(this));
        }
        const h = this.settings.slotHeight;

        if(!this.common.nameFound(this, ctx.userName)) {
            this.color = "var(--green)";
        } else {
            this.color = "var(--blue)";
        } 

        let lis = "";
        this.names.forEach(addToList)
        function addToList(value, index) {
            lis += `<li class="member" member=${index + 1}>${value}</li>`
        };

        let txt = "";
        txt = `<a class="place" target="_blank">${this.place}</a>
            <ol class="list">${lis}</ol>`

        eventSlot
            .html(txt)
            .css("top", (this.startHour + this.startMinutes / 60 - this.settings.dayStarts) * h -+ 1 + "px")
            .css("bottom", (this.settings.dayEnds - this.endHour + this.endMinutes / 60) * h + 5 + "px")
            .css("backgroundColor", this.color)
            .appendTo(`.day[data-dayIndex=${this.dayIndex}] .slots`);
     

        // const duration = event.duration;
        // if (duration < 45) {
        //     eventSlot.removeClass("shortEvent").addClass("veryShortEvent");
        // } else if (duration < 59) {
        //     eventSlot.removeClass("veryShortEvent").addClass("shortEvent");
        // } else {
        //     eventSlot.removeClass("shortEvent").removeClass("veryShortEvent");
        // }

        const media = window.matchMedia("(max-width: 800px)");
        if (media.matches) {
            if(this.names.length == 0) {
                return
            } else {
                eventSlot.text(this.names.length);
            }
        }
    }
}