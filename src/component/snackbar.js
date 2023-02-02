export default class Snackbar {
    constructor() {
        this.container = document.getElementById("snackbar");
    }

    show(text) {
        this.container.className = "show";
        this.container.innerHTML = text;

        setTimeout(() => { 
            this.container.className = this.container.className.replace("show", ""); 
        }, 3000);
    }
}