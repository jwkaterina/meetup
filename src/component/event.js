import './event.css';
import { dateString, getDayIndex, addDays } from "../helper";
import { Context } from "../ctx";

export default class Event {
    constructor(data) {
        this.id = data.id;
        this.weekStart = data.weekStart;
        this.place = data.place;
        this.memberIds = data.memberIds;
        this.start = data.start;
        this.end = data.end;
        this.date = data.date;
        this.color = data.color;
        this.type = data.type;
        this.slotHeight = 50;
        this.slotHeightMobile = 35;
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
        const media = window.matchMedia("(max-width: 800px)");

        const weekContainer = this.findWeekContainer();

        if (!weekContainer) {
            //TODO: Check if we really need to delete the event as weeks are immutable
            // document.getElementById(`${this.id}`).remove();
            return;
        }

        let eventSlot;
        let numberCircle;
        if (weekContainer.querySelector(`[id='${this.id}']`)) {
            eventSlot = weekContainer.querySelector(`[id='${this.id}']`);
            numberCircle = eventSlot.querySelector(".circle");
        } else {
            eventSlot = document.createElement("div");
            eventSlot.className ="event";
            eventSlot.setAttribute("id", this.id);
            eventSlot.addEventListener("click", () => {
                ctx.principal.openEventModal(this)
            });

            numberCircle = document.createElement("div");
            numberCircle.className = "circle";
            numberCircle.style.display = "none";
            eventSlot.appendChild(numberCircle);
            
        }

        if (media.matches) {
            const h = this.slotHeightMobile;
            eventSlot.style.top = (this.startHour + this.startMinutes / 60 ) * h + 1 + "px";
            eventSlot.style.bottom = 24 * h - (this.endHour + this.endMinutes / 60) * h + 3 + "px";

            if(this.memberIds.length > 0) {
                numberCircle.style.display = "inline-block";
                numberCircle.innerHTML = this.memberIds.length;
            }
        } else {
            const h = this.slotHeight;
            eventSlot.style.top = (this.startHour + this.startMinutes / 60 ) * h + 1 + "px";
            eventSlot.style.bottom = 24 * h - (this.endHour + this.endMinutes / 60) * h + 5 + "px";

            const mainId = this.memberIds[0];
            let mainName = "???";
            if(ctx.users[mainId]) {
                mainName = ctx.users[mainId].name;
            }
    
            let lis = "";
            lis = `<li class="member" data-user-id="${mainId}">${mainName}</li>`;
            if(this.memberIds.includes(ctx.principal.user.id) && ctx.principal.user.id != mainId) {
                lis += `<li class="member" data-user-id="${ctx.principal.user.id}">${ctx.principal.user.name}</li>`;
            }
            this.memberIds.forEach((id) => {
                if(id != mainId && id != ctx.principal.user.id) {
                    let memberName = "???"
                    if(ctx.users[id]) {
                        memberName = ctx.users[id].name;
                    }
                    lis += `<li class="member" data-user-id="${id}">${memberName}</li>`;
                }
            });         

            let txt = "";
            txt = `<a class="place" target="_blank">
            <i class="fa-sharp fa-solid fa-location-dot"></i>
            ${this.place}</a>
                <ul class="list">${lis}</ul>`
            eventSlot.innerHTML = txt;
        }

        if(this.memberIds.includes(ctx.principal.user.id)) {
            eventSlot.classList.add("mark");
        } else {
            eventSlot.classList.remove("mark");

        }

        if(this.type == "présentoir mobile") {
            this.color = "var(--green)";
        } else {
            this.color = "var(--blue)"
        }
        
        eventSlot.style.background = this.color;

        const day = weekContainer.querySelector(`.day-slots[data-dayIndex="${this.dayIndex}"]`);
        day.appendChild(eventSlot);
    }

    findWeekContainer() {
        const weeksContainer = document.getElementById("week-slots");
        for (const child of weeksContainer.children) {
            if(child.dataset.weekStart && child.dataset.weekStart === this.weekStart) {
                return child;
            }
        }
        return null;
    }
}