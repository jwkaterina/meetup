import { dateString, getDayIndex, addDays } from "./helper.js";
import { Event } from "./event.js";
import './style.css';

export class Calendar {
    constructor(ctx) {
        this.events = {};
        this.weekOffset = 0;
        this.readyToTrash = false;
        this.slotHeight = 50;
        this.dayStarts = 6;
        this.dayEnds = 21;
        this.weekStart = null;
        this.weekEnd = null;
        this.eventsLoaded = false;
        this.ctx = ctx;
    }

    setup() {
        this.setupTimes();
        this.calculateCurrentWeek();
        this.setupDays();
        this.showWeek();
        this.loadEvents();
        this.setupControls();
    }

    setupControls() {
        $("#nextWeekBtn").click(() => this.changeWeek(1));
        $("#prevWeekBtn").click(() => this.changeWeek(-1));
        $("#addButton").click(() => this.ctx.principal.createNewEvent());
        $("#todayButton").click(() => this.showCurrentWeek());
        $("#trashButton").click(() => this.trash());
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
                .click(() => cal.ctx.principal.clickSlot(hour, dayIndex))
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
                .click(() => this.ctx.principal.openEventModal(event));
        }
        const h = this.slotHeight;

        let lis = "";
        event.names.forEach(addToList)
        function addToList(value, index) {
            lis += `<li class="member" member=${index + 1}>${value}</li>`
        };

        let txt = "";
        txt = `<a class="place" target="_blank">${event.place}</a>
            <ol class="list">${lis}</ol>`

        eventSlot
            .html(txt)
            .css("top", (event.startHour + event.startMinutes / 60 - this.dayStarts) * h -+ 1 + "px")
            .css("bottom", (this.dayEnds - event.endHour + event.endMinutes / 60) * h + 5 + "px")
            .appendTo(`.day[data-dayIndex=${event.dayIndex}] .slots`);

        // if(event.names.length <= 1) {
        //     eventSlot.css("backgroundColor", "var(--green");
        // } else {
        //     eventSlot.css("backgroundColor", "var(--blue");
        // }

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
            if(event.names.length == 0) {
                return
            } else {
                eventSlot.text(event.names.length);
            }
        }


    }

    // openEventModal(event) {
    //     $("#eventModal").fadeIn(200);
    //     $("#calendar").addClass("opaque");
    //     document.querySelector('body').style.overflow = 'hidden';
    //     $(".editButton")
    //         .off("click")
    //         .click(() => {
    //             this.closeEventModal(event);
    //             this.ctx.principal.openChangeFormModal(event);
    //         });
    //     $(".cancelButton")
    //         .off("click")
    //         .click((e) => {
    //             e.preventDefault();
    //             this.closeEventModal(event);
    //         });

    //     let lis = "";
    //     event.names.forEach(addToList)
    //     function addToList(value, index) {
    //         lis += `<li class="member" member=${index + 1}>${value}</li>`
    //     };

    //     let txt = "";
    //     txt = `<a class="place" href="http://maps.google.com/?q=${event.place}" target="_blank">
    //         <i id="mapIcon" class="fas fa-map"></i>
    //         ${event.place}
    //         </a>
    //         <ol class="list">${lis}</ol>`
    //     $("#eventContent").html(txt);

        
    //     if(event.names.length <= 1) {
    //         $("#eventModal").css("backgroundColor", "var(--green");
    //     } else {
    //         $("#eventModal").css("backgroundColor", "var(--blue");
    //     }
    // }

    // closeEventModal() {
    //     $("#eventModal").fadeOut(200);
    //     $("#errors").text("");
    //     $("#calendar").removeClass("opaque");
    //     document.querySelector('body').style.overflow = 'auto';
    // }

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
        const newStart = $("#eventStart").val();
        const newEnd = $("#eventEnd").val();
        const newDate = $("#eventDate").val();
        if (this.events[newDate]) {
            const e = Object.values(this.events[newDate]).find(
                (evt) =>
                    evt.id != event.id && evt.end > newStart && evt.start < newEnd
            );
            if (e) {
                $("#errors").text(
                    `This collides with the event '${e.name}'
                (${e.start} - ${e.end}).`
                );
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
}

