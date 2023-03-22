import { Context } from "../ctx";
import { getDayIndex, addDays } from "../helper";
import Week from "./week";
import EventService from "../service/event";
import "./calendar.css";

export default class Calendar {
    constructor(eventCalendar) {
        this.ctx = Context.getInstance();
        this.eventCalendar = eventCalendar;
        this.eventService = new EventService();
        this.weekOffset = 0;
        this.calendar = document.getElementById("calendar");
        this.weeksContainer = document.getElementById("weeks");
        this.nextWeekBtn = document.getElementById("nextWeekBtn");
        this.prevWeekBtn = document.getElementById("prevWeekBtn");
        this.addButton = document.getElementById("addButton");
        this.todayButton = document.getElementById("todayButton");
        this.loadButton = document.getElementById("loadButton");
    }

    setup() {
        this.calculateCurrentWeek();
        this.setupMonth();
        this.setupTimes();
        this.setupControls();
        // this.addSwipe();
        this.assignWeeks();
        this.scrollToStart();
    }

    setupControls() {  
        this.nextWeekBtn.addEventListener("click", () => {
            this.weeksContainer.scrollBy({
                top: 0,
                left: this.weeksContainer.clientWidth,
                behavior: "smooth",
            });
            setTimeout(() => {
                this.showNextWeek();
            }, 700)
        });
        this.prevWeekBtn.addEventListener("click", () => {
            this.weeksContainer.scrollBy({
                top: 0,
                left: -50,
                behavior: "smooth",
            });
            setTimeout(() => {
                this.showPrevWeek();
            }, 700)
        });
        this.addButton.addEventListener("click", () => {
            if(this.ctx.principal) {
                this.ctx.principal.createNewEvent()
            }
        });
        // this.todayButton.addEventListener("click", () => {
        //     this.showCurrentWeek()
        // });
        this.loadButton.addEventListener("click", () => {
            window.location.reload();
        });
        this.checkResize();
        this.checkScrollDirection();        
    }

    scrollToStart() {
        window.addEventListener("load", () => {
            scrollTo(0, 375);
            this.weeksContainer.scrollBy({
                top: 0,
                left: this.weeksContainer.clientWidth,
                behavior: "auto",
            });        
        });
    }

    checkResize() {
        let lastWidth = window.innerWidth;
        window.addEventListener("resize", () => {
            if(window.innerWidth!=lastWidth) {
                window.location.reload();
                lastWidth = window.innerWidth;
            }
        });
    }

    checkScrollDirection() {
        this.weeksContainer.addEventListener('scroll', () => {
            const { scrollLeft, clientWidth } = this.weeksContainer;
            // console.log("clientWidth: ", clientWidth, "scrollLeft: ", scrollLeft);

            if(scrollLeft == 2 * clientWidth) {
                console.log("scroll right");
                setTimeout(() => {
                    this.showNextWeek();
                }, 200)            }
            if(scrollLeft == 0) {
                console.log("scroll left");
                setTimeout(() => {
                    this.showPrevWeek();
                }, 200)            }
          });
    }

    // addSwipe() {
    //     let touchstartX = 0;
    //     let touchendX = 0;
    //     let that = this;

    //     function checkDirection() {
    //         if (touchstartX - touchendX > 80) {that.showNextWeek()};
    //         if (touchendX -touchstartX > 80) {that.showPrevWeek()};
    //     }

    //     this.calendar.addEventListener('touchstart', e => {
    //         touchstartX = e.changedTouches[0].screenX;
    //     });

    //     this.calendar.addEventListener('touchend', e => {
    //         touchendX = e.changedTouches[0].screenX;
    //         checkDirection()
    //     });
    // }

    setupMonth() {
        const month = document.getElementById("currentMonth");
        month.innerHTML = this.ctx.weekStart.toLocaleDateString('fr-FR', {month: "long"});
    }

    setupTimes() {
        const timeColumn = document.getElementById("dayTime");
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
    }

    calculateCurrentWeek() {
        const now = new Date();
        this.ctx.weekStart = addDays(now, -getDayIndex(now));
        this.ctx.weekEnd = addDays(this.ctx.weekStart, 6);
    }

    // showCurrentWeek() {
    //     this.hideCurrentDay();
    //     this.weekOffset = 0;
    //     this.calculateCurrentWeek();
    //     this.setupDates();
    //     this.eventCalendar.loadEvents();
    // }

    assignWeeks() {
        this.weeks = {};
        this.weeks.prevWeek = new Week(this.ctx.prevWeekStart, this.weekOffset - 1, "prev-week");
        this.weeks.mainWeek = new Week(this.ctx.weekStart, this.weekOffset, "main-week");
        this.weeks.nextWeek = new Week(this.ctx.nextWeekStart, this.weekOffset + 1, "next-week");
        this.weeks.prevWeek.hide();
        this.weeks.nextWeek.hide();
        this.weeks.mainWeek.appendToParent(this.weeksContainer);
        this.weeks.mainWeek.insertBefore(this.weeks.prevWeek);
        this.weeks.mainWeek.insertAfter(this.weeks.nextWeek);
    }

    showNextWeek() {
        this.weekOffset += 1;
        this.ctx.weekStart = this.ctx.nextWeekStart;
        this.ctx.weekEnd = addDays(this.ctx.weekEnd, 7);
        this.setupMonth();
        
        this.weeks.prevWeek.removeFromDom();
        this.weeks.prevWeek = this.weeks.mainWeek;
        this.weeks.mainWeek = this.weeks.nextWeek;
        this.weeks.nextWeek = new Week(this.ctx.nextWeekStart, this.weekOffset + 1, "next-week");
        this.weeks.prevWeek.className = "prev-week";
        this.weeks.mainWeek.className = "main-week";
        this.weeks.mainWeek.insertAfter(this.weeks.nextWeek);        
        this.weeks.nextWeek.loadEvents();
    }

    showPrevWeek() {
        this.weekOffset += -1;
        this.ctx.weekStart = this.ctx.prevWeekStart;
        this.ctx.weekEnd = addDays(this.ctx.weekEnd, -7);
        this.setupMonth();

        this.weeks.nextWeek.removeFromDom();
        this.weeks.nextWeek = this.weeks.mainWeek;
        this.weeks.mainWeek = this.weeks.prevWeek;
        this.weeks.prevWeek = new Week(this.ctx.prevWeekStart, this.weekOffset - 1, "prev-week");
        this.weeks.nextWeek.className = "next-week";
        this.weeks.mainWeek.className = "main-week";
        this.weeks.mainWeek.insertBefore(this.weeks.prevWeek);           
        this.weeks.prevWeek.loadEvents();
    }

    loadEvents() {
        Object.values(this.weeks).forEach(week => week.loadEvents());
    }

    async createEvent(event) {
        const evt = await this.eventService.createEvent(event);
        Object.values(this.weeks).forEach(week => week.pushEvent(evt));
    }

    async updateEvent(event) {
        const evt = await this.eventService.updateEvent(event);
        Object.values(this.weeks).forEach(week => week.deleteEvent(evt.id));
        Object.values(this.weeks).forEach(week => week.pushEvent(evt));
    }

    async deleteEvent(id) {
        const removedEvent = Object.values(this.weeks)
        .find(week => week.deleteEvent(id) != null);
        if (removedEvent) {
            return await this.eventService.deleteEvent(removedEvent);
        } else {
            return Promise.reject(`No event with id ${id}`);
        }
    }

    checkEvent(event, newStart, newEnd, newDate) {
        Object.values(this.weeks).forEach(week => week.checkEvent(event, newStart, newEnd, newDate));
    }
}