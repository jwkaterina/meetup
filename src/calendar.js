import { dateString, getDayIndex, addDays } from "./helper.js";
import { Event } from "./event.js";
import { Ctx, MODE } from "./ctx.js";
import './style.css';

export class Calendar {
    constructor() {
        this.events = {};
        this.weekOffset = 0;
        this.readyToTrash = false;
        this.slotHeight = 50;
        this.dayStarts = 6;
        this.dayEnds = 21;
        this.weekStart = null;
        this.weekEnd = null;
        this.eventsLoaded = false;
        this.ctx = null;
    }

    setup() {
        this.setupTimes();
        this.calculateCurrentWeek();
        this.setupDays();
        this.showWeek();
        this.setupContext();
        this.loadEvents();
        this.setupControls();
    }

    setupControls() {
        $("#nextWeekBtn").click(() => this.changeWeek(1));
        $("#prevWeekBtn").click(() => this.changeWeek(-1));
        $("#addButton").click(() => this.addNewEvent());
        $("#todayButton").click(() => this.showCurrentWeek());
        $("#trashButton").click(() => this.trash());
        $("#checkBox").click(() => this.userChange());
        $("#cancelButton").click((e) => {
            e.preventDefault();
            this.closeFormModal();
        })
    }

    setupContext() {
        this.ctx = new Ctx();
        this.ctx.switchToUserMode(this.weekStart);
    }

    setupTimes() {
        const header = $("<div></div>").addClass("columnHeader");
        const slots = $("<div></div>").addClass("slots");
        for (let hour = this.dayStarts; hour < this.dayEnds; hour++) {
            $("<div></div>")
                .attr("data-hour", hour)
                .addClass("time")
                .text(`${hour}:00`)
                .appendTo(slots);
        }
        $(".dayTime").append(header).append(slots);
        $(`.time[data-hour=${this.dayStarts}]`).css("visibility", "hidden");
    }


    setupDays() {
        const media = window.matchMedia("(max-width: 800px)");
        const cal = this;

        if (media.matches) {
            $(".day").each(function () {
            const shortName = $(this).attr("data-shortName");
            const header = $("<div></div>").addClass("columnHeader").text(shortName);
            $("<div></div>").addClass("dayDisplay").appendTo(header);
            $(this).append(header)
        });
        } else {
            $(".day").each(function () {
                const fullName = $(this).attr("data-Name");
                const header = $("<div></div>").addClass("columnHeader").text(fullName);
                $("<div></div>").addClass("dayDisplay").appendTo(header);
                $(this).append(header)
            });
        }

        $(".day").each(function () {
        const dayIndex = parseInt($(this).attr("data-dayIndex"));
        const slots = $("<div></div>").addClass("slots");
        for (let hour = cal.dayStarts; hour < cal.dayEnds; hour++) {
            $("<div></div>")
                .attr("data-hour", hour)
                .appendTo(slots)
                .addClass("slot")
                .click(() => cal.clickSlot(hour, dayIndex))
                .hover(
                    () => cal.hoverOver(hour),
                    () => cal.hoverOut()
                );
        }
        $(this).append(slots);
    });
    }

    calculateCurrentWeek() {
        const now = new Date();
        this.weekStart = addDays(now, -getDayIndex(now));
        this.weekEnd = addDays(this.weekStart, 6);
    }

    changeWeek(number) {
        this.weekOffset += number;
        this.weekStart = addDays(this.weekStart, 7 * number);
        this.weekEnd = addDays(this.weekEnd, 7 * number);
        this.showWeek();
        this.loadEvents();
    }

    showWeek() {
        const options = {
            month: "long",
        };

        $("#currentMonth").text(
            this.weekStart.toLocaleDateString('fr-FR', options)
        );

        for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
            const date = addDays(this.weekStart, dayIndex);
            const display = date.toLocaleDateString('fr-FR', {
                day: "numeric",
            });
            $(`.day[data-dayIndex=${dayIndex}] .dayDisplay`).text(display);
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
        $(`.day[data-dayIndex=${dayIndex}]`).addClass("currentDay");
    }

    hideCurrentDay() {
        $(".day").removeClass("currentDay");
    }

    hoverOver(hour) {
        $(`.time[data-hour=${hour}]`).addClass("currentTime");
    }

    hoverOut() {
        $(".time").removeClass("currentTime");
    }

    clickSlot(hour, dayIndex) {
        if (this.ctx.mode != MODE.VIEW) return;
        this.ctx.mode = MODE.CREATE;
        const start = hour.toString().padStart(2, "0") + ":00";
        const end =
            hour < 23
                ? (hour + 1).toString().padStart(2, "0") + ":00"
                : hour.toString().padStart(2, "0") + ":59";

        const date = dateString(addDays(this.weekStart, dayIndex));
        const event = new Event({
            place: "",
            start,
            end,
            date,
            name: [],
            color: "var(--green)"
        });
        this.openFormModal(event);
    }

    openFormModal(event) {
        const addOnclickListener = this.ctx.principal.openFormModal(this, event);
        document.querySelector('body').style.overflow = 'hidden';
        if(addOnclickListener) {
            $("#submitButton")
            .off("submit")
            .click((e) => {
                e.preventDefault();
                this.submitModal(event);
            });
        }
    }

    submitModal(event) {
        if (this.ctx.principal.validateEvent && !this.isEventValid(event)) {
            return;
        }
        this.updateEvent(event);
        this.ctx.principal.submitModal();
        let that = this;
        setTimeout(function(){
            that.closeFormModal();
        },1000);
    }

    closeFormModal() {
        this.ctx.principal.closeFormModal();
        document.querySelector('body').style.overflow = 'auto';
        $("#submitButton").unbind("click");
    }

    addNewEvent() {
        const event = this.ctx.principal.createNewEvent();
        if(event) {
            this.openFormModal(event);
        }
    }

    clickIn(event) {
        if (this.ctx.mode != MODE.VIEW) return;
        this.ctx.mode = MODE.UPDATE;
        this.openEventModal(event);
    }

    openEventModal(event) {
        $("#eventModal").fadeIn(200);
        $("#calendar").addClass("opaque");
        document.querySelector('body').style.overflow = 'hidden';
        $("#editButton")
            .val("Éditer")
            .show()
            .off("click")
            .click(() => {
                this.closeEventModal(event);
                this.openFormModal(event);
            });

        let lis = "";
        event.name.forEach(addToList)
        function addToList(value, index) {
            lis += `<li class="member" member=${index + 1}>${value}</li>`
        };

        let txt = "";
        txt = `<a class="place" href="http://maps.google.com/?q=${event.place}" target="_blank">
            <i id="mapIcon" class="fas fa-map"></i>
            ${event.place}
            </a>
            <ol class="list">${lis}</ol>`
        $("#eventContent").html(txt);

        
        if(event.name.length <= 1) {
            $("#eventModal").css("backgroundColor", "var(--green");
        } else {
            $("#eventModal").css("backgroundColor", "var(--blue");
        }
    }

    closeEventModal() {
        $("#eventModal").fadeOut(200);
        $("#errors").text("");
        $("#calendar").removeClass("opaque");
        document.querySelector('body').style.overflow = 'auto';

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

    updateEvent(event) {
        this.ctx.principal.updateEvent(event);
        this.saveEvent(event);
        this.showEvent(event);
    }

    deleteEvent(event) {
        this.closeFormModal();
        $(`#${event.id}`).remove();
        delete this.events[event.date][event.id];
        if (Object.values(this.events[event.date]).length == 0) {
            delete this.events[event.date];
        }
        this.saveEvents();
    }

    deleteName(event) {
        this.closeFormModal();
        event.name.pop(event);
        this.saveEvent(event);
        this.showEvent(event);    }

    showEvent(event) {
        if (
            event.date < dateString(this.weekStart) ||
            event.date > dateString(this.weekEnd)
        ) {
            $(`#${event.id}`).remove();
            return;
        }
        let eventSlot;
        if ($(`#${event.id}`).length) {
            eventSlot = $(`#${event.id}`);
        } else {
            eventSlot = $("<div></div>")
                .addClass("event")
                .attr("id", event.id)
                .click(() => this.clickIn(event));
        }
        const h = this.slotHeight;

        // let txt = "";
        // event.name.forEach(myFunction);            
        // function myFunction(value, index) {
        // txt += 1 + index + "." + value + "<br>"; 
        // }

        let lis = "";
        event.name.forEach(addToList)
        function addToList(value, index) {
            lis += `<li class="member" member=${index + 1}>${value}</li>`
        };

        let txt = "";
        txt = `<a class="place" target="_blank">${event.place}</a>
            <ol class="list">${lis}</ol>`

        eventSlot
            .html(txt)
            // .css("top", (event.startHour + event.startMinutes / 60) * h + 1 + "px")
            // .css("bottom", 24 * h - (event.endHour + event.endMinutes / 60) * h + 5 + "px")
            .css("top", (event.startHour + event.startMinutes / 60 - this.dayStarts) * h -+ 1 + "px")
            .css("bottom", (this.dayEnds - event.endHour + event.endMinutes / 60) * h + 5 + "px")
            .appendTo(`.day[data-dayIndex=${event.dayIndex}] .slots`);

        if(event.name.length <= 1) {
            eventSlot.css("backgroundColor", "var(--green");
        } else {
            eventSlot.css("backgroundColor", "var(--blue");
        }

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
            if(event.name.length == 0) {
                return
            } else {
                eventSlot.text(event.name.length);
            }
        }


    }

    loadEvents() {
        $(".event").remove();
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
                const date = dateString(addDays(this.weekStart, dayIndex));
                if (this.events[date]) {
                    for (const event of Object.values(this.events[date])) {
                        this.showEvent(event);
                    }
                }
            }
        } else {
            this.events = {};
        }
    }

    isEventValid(event) {
        console.log("validation");
        const newStart = $("#eventStart").val();
        const newEnd = $("#eventEnd").val();
        const newDate = $("#eventDate").val();
        if (this.events[newDate]) {
            console.log(this.events[newDate]);
            console.log(Object.values(this.events[newDate]));
            const e = Object.values(this.events[newDate]).find(
                (evt) =>
                    evt.id != event.id && evt.end > newStart && evt.start < newEnd
            );
            if (e) {
                $("#errors").text(
                    `This collides with the event '${e.name}'
                (${e.start} - ${e.end}).`
                );
                console.log(e);
                console.log(event);
                return false;
            }
        }
        const duration =
            (new Date(`${newDate}T${newEnd}`).getTime() -
                new Date(`${newDate}T${newStart}`).getTime()) /
            (1000 * 60);
        if (duration < 0) {
            $("#errors").text("The start cannot be after the end.");
            return false;
        } else if (duration < 30) {
            $("#errors").text("Events should be at least 30 minutes.");
            return false;
        }
        return true;
    }

    trash() {
        if (this.ctx.mode != MODE.VIEW) return;
        if (this.readyToTrash) {
            this.readyToTrash = false;
            this.events = {};
            this.saveEvents();
            $(".event").remove();
        } else {
            this.readyToTrash = true;
            window.alert(
                "This will delete all the events in your calendar. " +
                    "This cannot be undone. If you are sure, click " +
                    "the trash can again in the next minute."
            );
            setTimeout(() => {
                this.readyToTrash = false;
            }, 60 * 1000);
        }
    }

    userChange() {
        const checkBox = document.getElementById("checkBox");
    
        if (checkBox.checked == true){
            this.ctx.switchToAdminMode(this.weekStart);
        } else {
            this.ctx.switchToUserMode(this.weekStart);
        }
    }
}

