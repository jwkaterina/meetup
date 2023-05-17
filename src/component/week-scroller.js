export default class WeekScroller {

    /**
     * Contains items that must be deleted after invoking
     */
    #forwardSingleCallBacks = [];
    /**
     * Contains items that must be deleted after invoking
     */
    #backSingleCallBacks = [];

    #forwardCallBacks = [];
    #backCallBacks = [];

    constructor(slotsContainer, headingsContainer) {
        this.slotsContainer = slotsContainer;
        this.headingsContainer = headingsContainer;

        this.NextWeekCreationInProgress = false;
    }

    checkScrollDirection() {
        
        this.slotsContainer.addEventListener('scroll', () => {
            const { scrollLeft, clientWidth } = this.slotsContainer;
            this.headingsContainer.scrollLeft = scrollLeft;

            if(!this.NextWeekCreationInProgress && (scrollLeft + 5 > 2 * clientWidth)) {
                this.NextWeekCreationInProgress = true;
                setTimeout(() => {
                    this.#forwardCallBacks.forEach(cb => cb());
                    this.NextWeekCreationInProgress = false;
                    this.#forwardSingleCallBacks.forEach((cb, index, arr) => {
                        cb();
                        arr.splice(index, 1);
                    });
                }, 500)            
            }
            if(!this.NextWeekCreationInProgress && scrollLeft < 5) {

                this.NextWeekCreationInProgress = true;
                setTimeout(() => {
                    this.#backCallBacks.forEach(cb => cb());
                    this.NextWeekCreationInProgress = false;
                    this.#backSingleCallBacks.forEach((cb, index, arr) => {
                        cb();
                        arr.splice(index, 1);
                    });
                }, 500)            
            }
        });
    }

    /**
     * Removes the callBack after invoking
     * @param {string} direction 
     * @param {func} callBack 
     */
    addSingleEventListener(direction, callBack) {
        if(direction !== 'forward' && direction !== 'back') {
            throw Error(`Invalid Argument: ${direction}`);
        }
        if(direction === 'forward') {
            this.#forwardSingleCallBacks.push(callBack);
        } else {
            this.#backSingleCallBacks.push(callBack);
        }
    }

    addEventListener(direction, callBack) {
        if(direction !== 'forward' && direction !== 'back') {
            throw Error(`Invalid Argument: ${direction}`);
        }
        if(direction === 'forward') {
            this.#forwardCallBacks.push(callBack);
        } else {
            this.#backCallBacks.push(callBack);
        }
    }

    scrollToStart() {
        window.addEventListener("load", () => {
            const media = window.matchMedia("(max-width: 720px)");
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
}