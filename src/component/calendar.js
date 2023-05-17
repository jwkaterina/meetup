import { Context } from "../ctx";
import { getDayIndex, addDays } from "../helper";
import Week from "./week";
import EventService from "../service/event";
import WeekScroller from "./week-scroller";
import "./calendar.css";

export default class Calendar {
    afterForwardScrollCallBacks = [];
    afterBackScrollCallBacks = [];
    constructor() {
        this.ctx = Context.getInstance();
        this.eventService = new EventService();
        this.calendar = document.getElementById("calendar-grid");
        this.slotsContainer = document.getElementById("week-slots");
        this.headingsContainer = document.getElementById("week-headings");
        this.nextWeekBtn = document.getElementById("nextWeekBtn");
        this.prevWeekBtn = document.getElementById("prevWeekBtn");
        this.addButton = document.getElementById("addButton");
        this.todayButton = document.getElementById("todayButton");
        this.loadButton = document.getElementById("loadButton");

        this.scroller = new WeekScroller(this.slotsContainer, this.headingsContainer);
    }

    setup() {

        this.calculateGivenWeek();
        this.setupMonth();
        this.setupTimes();
        this.setupControls();
        this.assignWeeks();
        this.scroller.scrollToStart();
    }

    setupControls() {  
        this.nextWeekBtn.addEventListener("click", () => {
            this.scroller.scrollToRight();      
        });
        this.prevWeekBtn.addEventListener("click", () => {
            this.scroller.scrollToLeft();      
        });
        this.addButton.addEventListener("click", () => {
            if(this.ctx.principal) {
                this.ctx.principal.createNewEvent()
            }
        });
        this.todayButton.addEventListener("click", () => {
            this.showCurrentWeek();
        });
        this.loadButton.addEventListener("click", () => {
            window.location.reload();
        });
        this.checkResize();
        this.scroller.checkScrollDirection();
        
        this.scroller.addEventListener("forward", () => { this.createNextWeek()});
        this.scroller.addEventListener("back", () => { this.createPrevWeek() });
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

    setupMonth() {
        const month = document.getElementById("currentMonth");
        month.innerHTML = this.ctx.weekStart.toLocaleDateString('fr-FR', {month: "long"});
    }

    setupTimes() {
        const timeColumn = document.getElementById("time-slots");
        for (let hour = 0; hour < 24; hour++) {
            const timeSlot = document.createElement("div");
            timeSlot.setAttribute("data-hour", hour);
            timeSlot.className = "time-slot";
            timeSlot.innerHTML = `${hour}:00`;
            timeColumn.appendChild(timeSlot);
        }
        timeColumn.querySelector(`.time-slot[data-hour="0"]`).style.visibility = "hidden";
    }

    calculateGivenWeek() {
        if(!this.ctx.weekStart) {
            this.ctx.weekStart = this.ctx.currentWeekStart;
            this.ctx.weekOffset = 0;
        }
        this.ctx.weekEnd = addDays(this.ctx.weekStart, 6);
    }

    showCurrentWeek() {
        if (this.ctx.weekOffset === 0) {
            return
        } else if (this.ctx.weekOffset === 1) {
            this.scroller.scrollToLeft();
        } else if (this.ctx.weekOffset === -1) {
            this.scroller.scrollToRight();   
        } else if(this.ctx.weekOffset > 1) {
            this.backToCurrentWeek();
        } else if(this.ctx.weekOffset < 1) {
            this.forwardToCurrentWeek();
        }
    }

    backToCurrentWeek() {
        this.ctx.weekStart = this.ctx.currentWeekStart;
        this.ctx.weekEnd = this.ctx.currentWeekEnd;        
        this.replacePrevWeek(this.ctx.currentWeekStart, 0);
        this.ctx.weekOffset = 1;
        this.ctx.weekStart = this.ctx.nextWeekStart;
        this.scroller.scrollToLeft();
        this.scroller.addSingleEventListener("back", () => this.replaceNextWeek(this.ctx.nextWeekStart, 1));   
    }

    forwardToCurrentWeek() {
        this.ctx.weekStart = this.ctx.currentWeekStart;
        this.ctx.weekEnd = this.ctx.currentWeekEnd;
        this.replaceNextWeek(this.ctx.currentWeekStart, 0);
        this.ctx.weekOffset = -1;
        this.ctx.weekStart = this.ctx.prevWeekStart;
        this.scroller.scrollToRight();
        this.scroller.addSingleEventListener("forward", () => this.replacePrevWeek(this.ctx.prevWeekStart, -1));
    }

    replacePrevWeek(weekStart, weekOffset) {
        this.weeks.prevWeek.removeFromDom();
        this.weeks.prevWeek = new Week(weekStart, weekOffset, "prev-week");
        this.weeks.mainWeek.insertBefore(this.weeks.prevWeek);
        if(this.ctx.principal) {
            this.weeks.prevWeek.loadEvents();
        }
    }

    replaceNextWeek(weekStart, weekOffset) {
        this.weeks.nextWeek.removeFromDom();
        this.weeks.nextWeek = new Week(weekStart, weekOffset, "next-week");
        this.weeks.mainWeek.insertAfter(this.weeks.nextWeek);
        if(this.ctx.principal) {
            this.weeks.nextWeek.loadEvents();
        }
    }

    assignWeeks() {
        this.weeks = {};
        this.weeks.prevWeek = new Week(this.ctx.prevWeekStart, this.ctx.weekOffset - 1, "prev-week");
        this.weeks.mainWeek = new Week(this.ctx.weekStart, this.ctx.weekOffset, "main-week");
        this.weeks.nextWeek = new Week(this.ctx.nextWeekStart, this.ctx.weekOffset + 1, "next-week");
        this.weeks.mainWeek.appendToParent(this.headingsContainer, this.slotsContainer);
        this.weeks.mainWeek.insertBefore(this.weeks.prevWeek);
        this.weeks.mainWeek.insertAfter(this.weeks.nextWeek);
    }

    createNextWeek() {
        this.ctx.weekOffset += 1;
        this.ctx.weekStart = this.ctx.nextWeekStart;
        this.ctx.weekEnd = addDays(this.ctx.weekEnd, 7);
        this.setupMonth();
        this.weeks.prevWeek.removeFromDom();
        this.weeks.prevWeek = this.weeks.mainWeek;
        this.weeks.prevWeek.className = "prev-week";
        this.weeks.mainWeek = this.weeks.nextWeek;
        this.weeks.mainWeek.className = "main-week";

        this.weeks.nextWeek = new Week(this.ctx.nextWeekStart, this.ctx.weekOffset + 1, "next-week");
        this.weeks.mainWeek.insertAfter(this.weeks.nextWeek);
        this.headingsContainer.scrollLeft = this.headingsContainer.clientWidth;
        this.slotsContainer.scrollLeft = this.slotsContainer.clientWidth;
        if(this.ctx.principal) {
            this.weeks.nextWeek.loadEvents();
        }
    }

    createPrevWeek() {
        this.ctx.weekOffset += -1;
        this.ctx.weekStart = this.ctx.prevWeekStart;
        this.ctx.weekEnd = addDays(this.ctx.weekEnd, -7);
        this.setupMonth();
        this.weeks.nextWeek.removeFromDom();
        this.weeks.nextWeek = this.weeks.mainWeek;
        this.weeks.nextWeek.className = "next-week";
        this.weeks.mainWeek = this.weeks.prevWeek;
        this.weeks.mainWeek.className = "main-week";

        this.weeks.prevWeek = new Week(this.ctx.prevWeekStart, this.ctx.weekOffset - 1, "prev-week");
        this.weeks.mainWeek.insertBefore(this.weeks.prevWeek);
        this.headingsContainer.scrollLeft = this.headingsContainer.clientWidth;
        this.slotsContainer.scrollLeft = this.slotsContainer.clientWidth;

        if(this.ctx.principal) {
            this.weeks.prevWeek.loadEvents();
        }
    }

    loadEvents() {
        const showLoadingAnimation = true;
        this.weeks.prevWeek.loadEvents();
        this.weeks.mainWeek.loadEvents(showLoadingAnimation);
        this.weeks.nextWeek.loadEvents();
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
        .map(week => week.deleteEvent(id))
        .find(evt => evt != null);
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