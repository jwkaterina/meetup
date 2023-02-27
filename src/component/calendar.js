import { Context } from "../ctx";
import { getDayIndex, addDays } from "../helper";
import EventCalendar from "../event-calendar";
import "./calendar.css";

export default class Calendar {
    constructor() {
        this.ctx = Context.getInstance();
        this.eventCalendar = new EventCalendar();
        this.weekOffset = 0;
        this.calendar = document.getElementById("calendar");
        this.mainWeek = document.getElementById("main-week");
        this.prevWeek = document.getElementById("prev-week");
        this.nextWeek = document.getElementById("next-week");
        this.month = document.getElementById("currentMonth");
        this.days = document.querySelectorAll(".day");
        this.nextWeekBtn = document.getElementById("nextWeekBtn");
        this.prevWeekBtn = document.getElementById("prevWeekBtn");
        this.addButton = document.getElementById("addButton");
        this.todayButton = document.getElementById("todayButton");
        this.loadButton = document.getElementById("loadButton");
    }

    setup() {
        this.setupTimes();
        this.calculateCurrentWeek();
        this.setupDays();
        this.setupDates();
        this.setupControls();
        this.addSwipe();
    }

    setupControls() {  
        this.nextWeekBtn.addEventListener("click", () => {
            this.showNextWeek();
        });
        this.prevWeekBtn.addEventListener("click", () => {
            this.showPrevWeek();
        });
        this.addButton.addEventListener("click", () => {
            if(this.ctx.principal) {
                this.ctx.principal.createNewEvent()
            }
        });
        this.todayButton.addEventListener("click", () => {
            this.showCurrentWeek()
        });
        this.loadButton.addEventListener("click", () => {
            window.location.reload();
        });
        window.addEventListener("load", () => {
            scrollTo(0, 375);
        });
        let lastWidth = window.innerWidth;
        window.addEventListener("resize", () => {
            if(window.innerWidth!=lastWidth) {
                window.location.reload();
                lastWidth = window.innerWidth;
            }
        });
    }

    addSwipe() {
        let touchstartX = 0;
        let touchendX = 0;
        let that = this;

        function checkDirection() {
        if (touchstartX - touchendX > 80) {that.nextWeek()};
        if (touchendX -touchstartX > 80) {that.prevWeek()};
        }

        this.calendar.addEventListener('touchstart', e => {
        touchstartX = e.changedTouches[0].screenX;
        });

        this.calendar.addEventListener('touchend', e => {
        touchendX = e.changedTouches[0].screenX;
        checkDirection()
        });
    }

    setupTimes() {
        const timeColumns = document.querySelectorAll(".dayTime");
        timeColumns.forEach((timeColumn) => {
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
            timeColumn.appendChild(header);
            timeColumn.appendChild(slots);
            timeColumn.querySelector(`.time[data-hour="0"]`).style.visibility = "hidden";
        })
    }

    setupDays() {
        const media = window.matchMedia("(max-width: 800px)");
        const cal = this;

        this.days.forEach((day) => {
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
                    if(cal.ctx.principal) {
                        cal.ctx.principal.clickSlot(hour, dayIndex);
                    }
                })
            }
            day.appendChild(slots);
        });
    }

    setupDates() {
        this.month.innerHTML = this.ctx.weekStart.toLocaleDateString('fr-FR', {month: "long"});
        this.setupMainWeek();
        this.setupPrevWeek();
        this.setupNextWeek();

        if (this.weekOffset == 0) {
            this.showCurrentDay();
        } else {
            this.hideCurrentDay();
        }
    }

    calculateCurrentWeek() {
        const now = new Date();
        this.ctx.weekStart = addDays(now, -getDayIndex(now));
        this.ctx.weekEnd = addDays(this.ctx.weekStart, 6);

        this.ctx.prevWeekStart = addDays(this.ctx.weekStart, -7);
        this.ctx.nextWeekStart = addDays(this.ctx.weekStart, 7);
    }

    showCurrentWeek() {
        this.hideCurrentDay();
        this.weekOffset = 0;
        this.calculateCurrentWeek();
        this.setupDates();
        this.eventCalendar.loadEvents();
    }

    setupMainWeek() {
        for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
            const date = addDays(this.ctx.weekStart, dayIndex);
            const display = date.toLocaleDateString('fr-FR', {day: "numeric"});
            this.mainWeek.querySelector(`.day[data-dayIndex="${dayIndex}"] .dayDisplay`).innerHTML = display;
        }
    }
    setupPrevWeek() {
        for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
            const date = addDays(this.ctx.prevWeekStart, dayIndex);
            const display = date.toLocaleDateString('fr-FR', {day: "numeric"});
            this.prevWeek.querySelector(`.day[data-dayIndex="${dayIndex}"] .dayDisplay`).innerHTML = display;
        }
    }
    setupNextWeek() {
        for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
            const date = addDays(this.ctx.nextWeekStart, dayIndex);
            const display = date.toLocaleDateString('fr-FR', {day: "numeric"});
            this.nextWeek.querySelector(`.day[data-dayIndex="${dayIndex}"] .dayDisplay`).innerHTML = display;
        }
    }

    showCurrentDay() {
        const now = new Date();
        const dayIndex = getDayIndex(now);
        this.mainWeek.querySelector(`.day[data-dayIndex="${dayIndex}"]`).classList.add("currentDay");
    }

    hideCurrentDay() {
        this.days.forEach((day) => {
            day.classList.remove("currentDay");
        });
    }

    showNextWeek() {
        this.nextWeek.style.display = "flex";
        this.calendar.classList.add("move-left");
        setTimeout(() => {
            this.calendar.classList.remove("move-left");
            this.weekOffset += 1;
            this.ctx.weekStart = this.ctx.nextWeekStart;
            this.ctx.weekEnd = addDays(this.ctx.weekEnd, 7);
            this.ctx.prevWeekStart = addDays(this.ctx.weekStart, -7);
            this.ctx.nextWeekStart = addDays(this.ctx.weekStart, 7);
            this.nextWeek.style.display = "";
            this.setupDates();
            this.eventCalendar.loadEvents();
        },500);
    }

    showPrevWeek() {
        this.prevWeek.style.display = "flex";
        this.calendar.classList.add("move-right");
        setTimeout(() => {
            this.calendar.classList.remove("move-right");
            this.weekOffset += -1;
            this.ctx.weekStart = this.ctx.prevWeekStart;
            this.ctx.weekEnd = addDays(this.ctx.weekEnd, -7);
            this.ctx.prevWeekStart = addDays(this.ctx.weekStart, -7);
            this.ctx.nextWeekStart = addDays(this.ctx.weekStart, 7);
            this.prevWeek.style.display = "";
            this.setupDates();
            this.eventCalendar.loadEvents();
        },500);
    }
}