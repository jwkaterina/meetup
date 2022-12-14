import { dateString, getDayIndex, addDays } from "./helper";
import { Context } from "./ctx";
import Event from "./component/event";
import "./calendar.css";

export default class Calendar {
    constructor() {
        this.events = {};
        this.weekOffset = 0;
        this.readyToTrash = false;
        this.eventsLoaded = false;
        this.ctx = Context.getInstance();
    }

    setup() {
        this.setupTimes();
        this.calculateCurrentWeek();
        this.setupDays();
        this.showWeek();
        this.setupControls();
        this.addSwipe();
    }

    setupControls() {
        //See: https://pancy.medium.com/context-smuggle-with-injection-6f38e0ae478e#19e5
        //     
        document.getElementById("nextWeekBtn").addEventListener("click", () => {
            this.changeWeek(1)
        });
        document.getElementById("prevWeekBtn").addEventListener("click", () => {
            this.changeWeek(-1)
        });
        document.getElementById("addButton").addEventListener("click", () => {
            this.ctx.principal.createNewEvent()
        });
        document.getElementById("todayButton").addEventListener("click", () => {
            this.showCurrentWeek()
        });
        document.getElementById("trashButton").addEventListener("click", () => {
            this.trash()
        });
        window.addEventListener("load", () => {
            scrollTo(0, 375);
        });
    }

    addSwipe() {
        let touchstartX = 0;
        let touchendX = 0;
        let that = this;

        function checkDirection() {
        if (touchstartX - touchendX > 80) {that.changeWeek(1)};
        if (touchendX -touchstartX > 80) {that.changeWeek(-1)};
        }

        document.getElementById("calendar").addEventListener('touchstart', e => {
        touchstartX = e.changedTouches[0].screenX;
        });

        document.getElementById("calendar").addEventListener('touchend', e => {
        touchendX = e.changedTouches[0].screenX;
        checkDirection()
        });
    }

    setupTimes() {
        const header = document.createElement("div");
        header.className = "columnHeader";
        const slots = document.createElement("div");
        slots.className = "slots";
        for (let hour = 0; hour < 24; hour++) {
            const timeSlot = document.createElement("div");
            timeSlot.setAttribute("data-hour", hour);
            timeSlot.className = "time";
            timeSlot.innerHTML = `${hour}:00`;
            slots.appendChild(timeSlot);
        }
        document.querySelector(".dayTime").appendChild(header);
        document.querySelector(".dayTime").appendChild(slots);
        document.querySelector(`.time[data-hour="0"]`).style.visibility = "hidden";
    }


    setupDays() {
        const media = window.matchMedia("(max-width: 800px)");
        const cal = this;

            const days = document.querySelectorAll(".day");
            days.forEach((day) => {
            const shortName = day.getAttribute("data-shortName");
            const fullName = day.getAttribute("data-name");
            const header = document.createElement("div");
            header.className = "columnHeader";
            if (media.matches) {
                header.innerHTML = `${shortName}`;
            } else {
                header.innerHTML = `${fullName}`;
            }
            const dayDisplay = document.createElement("div")
            dayDisplay.className = "dayDisplay";
            header.appendChild(dayDisplay);
            day.appendChild(header);

            const dayIndex = parseInt(day.getAttribute("data-dayIndex"));
            const slots = document.createElement("div");
            slots.className = "slots";
            for (let hour = 0; hour < 24; hour++) {
                const slot = document.createElement("div");
                slot.setAttribute("data-hour", hour);
                slot.className = "slot";
                slots.appendChild(slot);
                slot.addEventListener("click", () => {
                    cal.ctx.principal.clickSlot(hour, dayIndex);
                })
            }
            day.appendChild(slots);
        });
    }

    calculateCurrentWeek() {
        const now = new Date();
        this.ctx.weekStart = addDays(now, -getDayIndex(now));
        this.ctx.weekEnd = addDays(this.ctx.weekStart, 6);
    }

    changeWeek(number) {
        this.weekOffset += number;
        this.ctx.weekStart = addDays(this.ctx.weekStart, 7 * number);
        this.ctx.weekEnd = addDays(this.ctx.weekEnd, 7 * number);
        this.showWeek();
        this.loadEvents();
    }

    showWeek() {
         document.getElementById("currentMonth").innerHTML = this.ctx.weekStart.toLocaleDateString('fr-FR', {month: "long"});

        for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
            const date = addDays(this.ctx.weekStart, dayIndex);
            const display = date.toLocaleDateString('fr-FR', {day: "numeric"});
            document.querySelector(`.day[data-dayIndex="${dayIndex}"] .dayDisplay`).innerHTML = display;
        }
        if (this.weekOffset == 0) {
            this.showCurrentDay();
        } else {
            this.hideCurrentDay();
        }
    }

    showCurrentWeek() {
        this.hideCurrentDay();
        this.weekOffset = 0;
        this.calculateCurrentWeek();
        this.showWeek();
        this.loadEvents();

    }

    showCurrentDay() {
        const now = new Date();
        const dayIndex = getDayIndex(now);
        document.querySelector(`.day[data-dayIndex="${dayIndex}"]`).classList.add("currentDay");
    }

    hideCurrentDay() {
        const days = document.querySelectorAll(".day");
        days.forEach((day) => {
            day.classList.remove("currentDay");
        });
    }

    saveEvent(event) {
        if (event.prevDate && event.date != event.prevDate) {
            delete this.events[event.prevDate][event.id];
            if (Object.values(this.events[event.prevDate]).length == 0) {
                delete this.events[event.prevDate];
            }
        }
        if (!this.events[event.date]) {
            this.events[event.date] = {};
        }
        this.events[event.date][event.id] = event;
        this.saveEvents();
    }

    saveEvents() {
        localStorage.setItem("events", JSON.stringify(this.events));
    }


    loadEvents() {
        const events = document.querySelectorAll(".event");
        events.forEach((event) => {
            event.remove();
        });
        if (!this.eventsLoaded) {
            this.events = JSON.parse(localStorage.getItem("events"));
            if (this.events) {
                for (const date of Object.keys(this.events)) {
                    for (const id of Object.keys(this.events[date])) {
                        const event = new Event(this.events[date][id]);
                        this.events[date][id] = event;
                    }
                }
            }
            this.eventsLoaded = true;
        }
        if (this.events) {
            for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
                const date = dateString(addDays(this.ctx.weekStart, dayIndex));
                if (this.events[date]) {
                    for (const event of Object.values(this.events[date])) {
                        event.show();
                    }
                }
            }
        } else {
            this.events = {};
        }
    }

    isEventValid(event) {
        const newStart = document.getElementById("eventStart").value;
        const newEnd = document.getElementById("eventEnd").value;
        const newDate = document.getElementById("eventDate").value;
        if (this.events[newDate]) {
            const e = Object.values(this.events[newDate]).find(
                (evt) =>
                    evt.id != event.id && evt.end > newStart && evt.start < newEnd
            );
            if (e) {
                document.getElementById("errors").classList.add("show-message");
                document.getElementById("errors").querySelector("p").innerHTML = `Cela se heurte ?? l'??quipe (${e.start} - ${e.end}).`;
                return false;
            }
        }

        const duration =
            (new Date(`${newDate}T${newEnd}`).getTime() -
                new Date(`${newDate}T${newStart}`).getTime()) /
            (1000 * 60);
        if (duration < 0) {
            document.getElementById("errors").classList.add("show-message");
            document.getElementById("errors").querySelector("p").innerHTML = "Le d??but ne peut pas ??tre apr??s la fin.";
            return false;
        }
        return true;
    }

    trash() {
        if (this.readyToTrash) {
            this.readyToTrash = false;
            this.events = {};
            this.saveEvents();
            const events = document.querySelectorAll(".event");
            events.forEach((event) => {
                event.remove();
            });
        } else {
            this.readyToTrash = true;
            window.alert(
                "Cela supprimera tous les ??quipes de votre calendrier. " +
                    "??a ne peut pas ??tre annul??. Si vous ??tes s??r, cliquez" + 
                    "?? nouveau sur la corbeille dans la minute suivante."
            );
            setTimeout(() => {
                this.readyToTrash = false;
            }, 60 * 1000);
        }
    }
}

