export default class Snackbar {
    constructor() {
        this.container = document.getElementById("snackbar");
    }

    show(text) {
        this.container.className = "show";
        this.container.innerHTML = text;

        setTimeout(function() { 
            this.container.className = this.container.className.replace("show", ""); 
        }, 3000);
    }
}