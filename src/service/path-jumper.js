// import { Context } from "../ctx";

export default class PathJumper {

    static parsePath() {
        const pathname = window.location.pathname;
        // console.log(pathname);
        const pathArr = pathname.split("/");
        const weekStart = new Date(pathArr[pathArr.length - 2]);
        const eventId = pathArr[pathArr.length - 1];
        // console.log(weekStart, eventId);
        this.weekStart = weekStart;
    }

    get weekStart() {
        this.weekStart;
    }

    static generateLink(weekStart, id) {
        const origin = window.origin;
        const link = `${origin}/${weekStart}/${id}`
        return link;
    }
}