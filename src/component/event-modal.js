import './event-modal.css';
import './modals-common.css';

export default class EventModal {
    constructor() {
        this.container = document.getElementById("eventModal");
        this.editButton = this.container.querySelector(".editButton");
        this.joinButton = this.container.querySelector(".joinButton");
        this.deleteButton = this.container.querySelector(".deleteButton");
        this.cancelButton = this.container.querySelector(".cancelButton");
        this.shareButton = this.container.querySelector(".shareButton");
        this.flipCard = this.container.querySelector(".flip-card-inner");
        this.flipCardText = this.container.querySelector(".flipCardText");
        this.flipCardBack = this.container.querySelector(".flip-card-back");
        this.flipCardFront = this.container.querySelector(".flip-card-front");
        this.members = this.container.querySelector(".members");
        this.place = this.container.querySelector(".place");
        this.time = this.container.querySelector(".time");
        this.comment = this.container.querySelector(".comment");
    }

    hideEditButton() {
        this.editButton.style.display = "none";
    }

    hideJoinButton() {
        this.joinButton.style.display = "none";
    }

    hideDeleteButton() {
        this.deleteButton.style.display = "none";
    }
    showEditButton() {
        this.editButton.style.display = "";
    }

    showJoinButton() {
        this.joinButton.style.display = "";
    }

    showDeleteButton() {
        this.deleteButton.style.display = "";
    }

    enableButtons() {
        this.joinButton.disabled = false;
        this.deleteButton.disabled = false;
        this.cancelButton.disabled = false;
        this.editButton.disabled = false;
    }

    disableButtons() {
        this.joinButton.disabled = true;
        this.deleteButton.disabled = true;
        this.cancelButton.disabled = true;
        this.editButton.disabled = true;
    }

    showModal() {
        this.container.classList.add("show-modal");
    }

    hideModal() {
        this.container.classList.add("hide-modal");
        this.enableButtons();
        setTimeout(() => {
            this.container.classList.remove("show-modal");
            this.container.classList.remove("hide-modal");
        }, 200);
    }

    showCalendar() {
        document.body.classList.add("transparent");
        setTimeout(() => {
            document.body.classList.remove("transparent");
            document.body.classList.remove("opaque");
            document.body.style.overflow = 'auto'; 
        }, 200);
        
    }

    hideCalendar() {
        document.body.classList.add("opaque");
        document.body.style.overflow = 'hidden';
    }

    open() {
        this.showModal();
        this.members.scroll(0, 0);
        this.hideCalendar();
    }

    close() {
        this.hideModal();
        this.showCalendar();
    }

    animateFlip(){
        this.flipCardBack.style.display = "flex";
        this.flipCard.classList.add("flip");
        setTimeout(() => {
            this.flipCard.classList.remove("flip");
            this.flipCardBack.style.display = "none";
        },2000); 
    }

    writeOnFlip(text) {
        this.flipCardText.textContent = text;
    }
    
    setCardColor(color = "var(--green)") {
        this.flipCardBack.style.background = color;
        this.flipCardFront.style.background = color;
    }

    setMembers(txt) {
        this.members.innerHTML = txt;
        const list = document.querySelector(".list");
        if(list.firstChild.innerHTML === "UNDEFINED UNDEFINED") {
            list.firstChild.style.display = "none";
            list.setAttribute("start", 2);
        } 
    }

    setTime(date, start, end) {
        const newDate = new Date(date);
        const newDateFormated = newDate.toLocaleDateString('fr-FR', {day: "numeric", month: "long"})
        const startHour = start.slice(0, 2);
        let startMin = start.slice(3);
        if(startMin === "00") {
            startMin = "";
        }
        const endHour = end.slice(0, 2);
        let endMin = end.slice(3);
        if(endMin === "00") {
            endMin = "";
        }
        this.time.innerHTML = `${newDateFormated} ${startHour}h${startMin} - ${endHour}h${endMin}`;
    }

    setPlace(place, type = "pm") {
        let imgSrc;
        if(type == "tr") {
            imgSrc = "../icons/tr-b.png";
        } else {
            imgSrc = "../icons/pm-b.png";
        }
        this.place.innerHTML = `<a class="place" href="http://maps.google.com/?q=${place}" target="_blank">
        ${place}</a>
        <img src="${imgSrc}" alt="">
        `
    }

    setComment(text = "") {
        if(text === "") {
            this.comment.style.display = "";
            this.flipCardFront.style.gridTemplateRows = "2fr 1fr 1fr 9fr 2fr";
        } else {
            this.comment.innerHTML = text;
            this.comment.style.display = "block";
            this.flipCardFront.style.gridTemplateRows = "2fr 1fr 1fr 1fr 8fr 2fr";
        }
    }
}