export default class PathJumper {
    constructor() {
        this._parsePath(window.location.pathname);
    }

    _parsePath(pathname) {
        console.log(pathname);
        /**
         * 1. Parse pathname
         * 2. Update Context
         * 
         */
        
    }

    static generateLink(weekStart, id) {
        const origin = window.origin;
        const link = `${origin}/${weekStart}/${id}`
        return link;
    }
}