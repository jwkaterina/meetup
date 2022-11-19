import { Context } from "./ctx";
import { Event } from "./components/event";

export class PrincipalCommon {

    nameFound(event, name) {
        if (event.names.find((user) => {return user == name;})) {
            return true;
        } else {
            return false;
        }
    }

    addEventContent(event) {
        let lis = "";
        event.names.forEach(addToList);
        function addToList(value, index) {
            lis += `<li class="member" member=${index + 1}>${value}</li>`;
        };

        let txt = "";
        txt = `<a class="place" href="http://maps.google.com/?q=${event.place}" target="_blank">
            <i id="mapIcon" class="fas fa-map"></i>
            ${event.place}
            </a>
            <ol class="list">${lis}</ol>`;
        $("#eventContent").html(txt);
        $("#eventModal").find(".flip-card-front").css("background-color", event.color);
        $("#eventModal").find(".flip-card-back").css("background-color", event.color);
    }

    addName(event, calendar, eventModal) {
        eventModal.writeOnFlip("Bon predication!");
        eventModal.animateFlip();       
        setTimeout(function(){
            eventModal.close();
        },1000);
        event.names.push(Context.getInstance().userName);
        calendar.saveEvent(event);
        event.show();
    }

    deleteName(event, calendar, eventModal) {
        eventModal.writeOnFlip("Ta participation est annulé.");
        eventModal.animateFlip();     
        setTimeout(function(){
            eventModal.close();
        },1000);
        const index = event.names.indexOf(Context.getInstance().userName);
        event.names.splice(index, 1);
        calendar.saveEvent(event);
        event.show();
    }
}