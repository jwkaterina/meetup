import '../component/event-slot';
import { Context } from '../ctx';

export default class PathJumper {

    static parsePath() {
        const ctx = Context.getInstance();
        const pathname = window.location.pathname;
        const pathArr = pathname.split("/");
        const parsedWeek = pathArr[pathArr.length - 2];
        const parsedEventId = pathArr[pathArr.length - 1];

        if(parsedWeek !== "") {
            ctx.weekStart = new Date(parsedWeek);
            ctx.calculateWeekOffset();
        }
    }

    get weekStart() {
        this.weekStart;
    }

    get eventID() {
        this.eventId
    }

    static generateLink(weekStart, id) {
        const origin = window.origin;
        const link = `${origin}/${weekStart}/${id}`
        return link;
    }
}