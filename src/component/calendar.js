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
        this.calendar = document.getElementById("calendar-grid");
        this.slotsContainer = document.getElementById("week-slots");
        this.headingsContainer = document.getElementById("week-headings");
        this.nextWeekBtn = document.getElementById("nextWeekBtn");
        this.prevWeekBtn = document.getElementById("prevWeekBtn");
        this.addButton = document.getElementById("addButton");
        this.todayButton = document.getElementById("todayButton");
        this.loadButton = document.getElementById("loadButton");

        this.NextWeekCreationInProgress = false;
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
            this.scrollToRight();      
        });
        this.prevWeekBtn.addEventListener("click", () => {
            this.scrollToLeft();      
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
        this.checkScrollDirection();        
    }

    scrollToStart() {
        window.addEventListener("load", () => {
            const media = window.matchMedia("(max-width: 850px)");
            if (media.matches) {
                scrollTo(0, 260);
            } else {
                scrollTo(0, 375);
            }
            this.slotsContainer.scrollBy({
                top: 0,
                left: this.slotsContainer.clientWidth,
                behavior: "auto",
            });       
        });
    }

    scrollToLeft() {
        this.slotsContainer.scrollBy({
            top: 0,
            left: - this.slotsContainer.clientWidth,
            behavior: "smooth",
        });
    }

    scrollToRight() {
        this.slotsContainer.scrollBy({
            top: 0,
            left: this.slotsContainer.clientWidth,
            behavior: "smooth",
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
        
        this.slotsContainer.addEventListener('scroll', () => {
            const { scrollLeft, clientWidth, scrollWidth } = this.slotsContainer;
            console.log("scrollLeft: ", scrollLeft, "clientWidth: ", clientWidth, "scrollWidth: ", scrollWidth);
            this.headingsContainer.scrollLeft = scrollLeft;

            if(!this.NextWeekCreationInProgress && (scrollLeft + 5 > 2 * clientWidth)) {
                this.NextWeekCreationInProgress = true;
                setTimeout(async () => {
                    this.createNextWeek();
                    this.NextWeekCreationInProgress = false;
                }, 500)            
            }
            if(!this.NextWeekCreationInProgress && scrollLeft < 5) {

                this.NextWeekCreationInProgress = true;
                setTimeout(() => {
                    this.createPrevWeek();
                    this.NextWeekCreationInProgress = false;

                }, 500)            
            }
        });
    }
   
    // addSwipe() {
    //     let touchstartX = 0;
    //     let touchendX = 0;
    //     let that = this;

    //     function checkDirection() {
    //         if (touchstartX - touchendX > 80) {that.createNextWeek()};
    //         if (touchendX -touchstartX > 80) {that.createPrevWeek()};
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

    calculateCurrentWeek() {
        const now = new Date();
        this.ctx.weekStart = addDays(now, -getDayIndex(now));
        this.ctx.weekEnd = addDays(this.ctx.weekStart, 6);
    }

    showCurrentWeek() {
        if (this.weekOffset === 0) {
            return
        } else if (this.weekOffset === 1) {
            this.scrollToLeft();
        } else if (this.weekOffset === -1) {
            this.scrollToRight();   
        } else if(this.weekOffset > 1) {
            this.backToCurrentWeek();
        } else if(this.weekOffset < 1) {
            this.forwardToCurrentWeek();
        }
    }

    backToCurrentWeek() {
        this.calculateCurrentWeek();
        this.replacePrevWeek(this.ctx.weekStart, 0);
        this.weekOffset = 1;
        this.ctx.weekStart = this.ctx.nextWeekStart;
        this.scrollToLeft();
        setTimeout(() => {
            this.replaceNextWeek(this.ctx.nextWeekStart, this.weekOffset + 1)
        }, 1000)       
    }

    forwardToCurrentWeek() {
        this.calculateCurrentWeek();
        this.replaceNextWeek(this.ctx.weekStart, 0);
        this.weekOffset = -1;
        this.ctx.weekStart = this.ctx.prevWeekStart;
        this.scrollToRight();
        setTimeout(() => {
            this.replacePrevWeek(this.ctx.prevWeekStart, this.weekOffset - 1)
        }, 1000)   
    }

    replacePrevWeek(weekStart, weekOffset) {
        this.weeks.prevWeek.removeFromDom();
        this.weeks.prevWeek = new Week(weekStart, weekOffset, "prev-week");
        this.weeks.mainWeek.insertBefore(this.weeks.prevWeek);
        this.weeks.prevWeek.loadEvents();

    }

    replaceNextWeek(weekStart, weekOffset) {
        this.weeks.nextWeek.removeFromDom();
        this.weeks.nextWeek = new Week(weekStart, weekOffset, "next-week");
        this.weeks.mainWeek.insertAfter(this.weeks.nextWeek);
        this.weeks.nextWeek.loadEvents();

    }

    assignWeeks() {
        this.weeks = {};
        this.weeks.prevWeek = new Week(this.ctx.prevWeekStart, this.weekOffset - 1, "prev-week");
        this.weeks.mainWeek = new Week(this.ctx.weekStart, this.weekOffset, "main-week");
        this.weeks.nextWeek = new Week(this.ctx.nextWeekStart, this.weekOffset + 1, "next-week");
        this.weeks.mainWeek.appendToParent(this.headingsContainer, this.slotsContainer);
        this.weeks.mainWeek.insertBefore(this.weeks.prevWeek);
        this.weeks.mainWeek.insertAfter(this.weeks.nextWeek);
    }

    createNextWeek() {
        this.weekOffset += 1;
        this.ctx.weekStart = this.ctx.nextWeekStart;
        this.ctx.weekEnd = addDays(this.ctx.weekEnd, 7);
        this.setupMonth();
        this.weeks.prevWeek.removeFromDom();
        this.weeks.prevWeek = this.weeks.mainWeek;
        this.weeks.prevWeek.className = "prev-week";
        this.weeks.mainWeek = this.weeks.nextWeek;
        this.weeks.mainWeek.className = "main-week";

        this.weeks.nextWeek = new Week(this.ctx.nextWeekStart, this.weekOffset + 1, "next-week");
        this.weeks.mainWeek.insertAfter(this.weeks.nextWeek);
        this.headingsContainer.scrollLeft = this.headingsContainer.clientWidth;
        this.slotsContainer.scrollLeft = this.slotsContainer.clientWidth;
        this.weeks.nextWeek.loadEvents();
    }

    createPrevWeek() {
        this.weekOffset += -1;
        this.ctx.weekStart = this.ctx.prevWeekStart;
        this.ctx.weekEnd = addDays(this.ctx.weekEnd, -7);
        this.setupMonth();
        this.weeks.nextWeek.removeFromDom();
        this.weeks.nextWeek = this.weeks.mainWeek;
        this.weeks.nextWeek.className = "next-week";
        this.weeks.mainWeek = this.weeks.prevWeek;
        this.weeks.mainWeek.className = "main-week";

        this.weeks.prevWeek = new Week(this.ctx.prevWeekStart, this.weekOffset - 1, "prev-week");
        this.weeks.mainWeek.insertBefore(this.weeks.prevWeek);
        this.headingsContainer.scrollLeft = this.headingsContainer.clientWidth;
        this.slotsContainer.scrollLeft = this.slotsContainer.clientWidth;

        this.weeks.prevWeek.loadEvents();
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