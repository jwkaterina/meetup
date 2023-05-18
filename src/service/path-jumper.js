import { Context } from '../ctx';
import { dateString } from '../helper';

export default class PathJumper {

    static parsePath() {
        const ctx = Context.getInstance();
        const hash = window.location.hash;
        if (!hash) {
            return;
        }

        const pathname = hash.slice(1);

        const pathArr = pathname.split("/");
        const parsedWeek = pathArr[pathArr.length - 2];
        const parsedEventId = pathArr[pathArr.length - 1];
        if(parsedWeek !== "") {
            ctx.weekStart = new Date(parsedWeek);
            ctx.calculateWeekOffset();
        }
        if(parsedEventId !== "") {
            ctx.parsedEventId = parsedEventId;
        }
    }

    static generateLink() {
        const ctx = Context.getInstance();
        const weekStart = dateString(ctx.weekStart);
        const id = ctx.currentEvent.id;
        const origin = window.origin;
        const link = `${origin}/#${weekStart}/${id}`;
        navigator.clipboard.writeText(link);
        document.querySelector("snack-bar").show("Le lien est copié!");

        console.log(link);
        return link;
    }
}