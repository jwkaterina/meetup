import Event from "../src/components/event";
import { Context } from "../src/ctx";
import Calendar  from "../src/calendar";
import PrincipalCommon from "../src/principal";
import User from "../src/user";

jest.mock("../src/calendar");

describe('PrincipalCommon', function () {

    const mockedSaveEvent = jest.fn();
    Calendar.mockImplementation(() => {
        const actualModule = jest.requireActual("../src/calendar");
        return {
            ...actualModule,
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            saveEvent: mockedSaveEvent,
        };
    });

    const mockedShowEvent = jest
    .spyOn(Event.prototype, 'show')
    .mockImplementation(() => {});

    const user = new User('6807bee0-d200-4c53-8e00-4cf0a1742387', 'Regina', 'Phalange');

    let event = null;

    beforeEach(() => {
        event = new Event({
            place: "",
            start: "12:00",
            end: "13:00",
            date: "2022-01-01",
            members: [{userName: "John Doe", id: "1"}, {userName: "Jason Born", id: "2"}],
            color: "green",
        });

        document.body.innerHTML = `
        <div id="eventModal" class="modal">
            <div class="flip-card">
                <div class="flip-card-inner">
                    <div class="flip-card-front">
                        <a href="" class="cancelButton">
                            <div class="cross"></div>
                        </a>
                        <div id="eventContent"></div>         
                        <div class="eventControls">
                            <input type="button" value="S'inscrire" class="button submitButton">
                            <input type="button" value="Annuler" class="button deleteButton">
                            <input type="button" value="Éditer" class="button editButton">
                        </div>   
                    </div>
                    <div class="flip-card-back">
                        <h2 class="flipCardText">Bon predication!</h2> 
                    </div>
                </div>
            </div>
        </div> 
        `;
    });

    it('should populate eventModal with content from event object', () => {
        //init
        const principal = new PrincipalCommon(new Calendar(), user);

        //invoke
        principal.addEventContent(event);

        //check
        const names = document.querySelectorAll(".member")
        expect(names.length).toBe(2);
        
        
        const members = [];
        for (const name of names) {
            members.push(name.innerHTML);
        }
        const intresection = event.members.map((member) => member.userName).filter(value => members.includes(value));
        expect(intresection.length).toBe(2);
    });

    it('should add name to current event', () => {
        //init
        const principal = new PrincipalCommon(new Calendar(), user);
        const ctx = Context.getInstance();
        ctx.currentEvent = event;

        //invoke
        principal.addName();

        //check
        expect(event.members).toEqual([{userName: "John Doe", id: "1"}, {userName: "Jason Born", id: "2"}, {userName: user.name, id: user.id}]);
        expect(mockedSaveEvent).toHaveBeenCalledTimes(1);
        expect(mockedShowEvent).toHaveBeenCalledTimes(1);
    });

    it('should delete name from current event', () => {
        //init
        const principal = new PrincipalCommon(new Calendar(), user);
        const event = new Event({
            place: "",
            start: "12:00",
            end: "13:00",
            date: "2022-01-01",
            members: [{userName: "John Doe", id: "1"}, {userName: user.name, id: user.id}],
            color: "green",
        });
        const ctx = Context.getInstance();
        ctx.currentEvent = event;

        //invoke
        principal.deleteName();

        //check
        expect(event.members).toEqual([{userName: "John Doe", id: "1"}]);
        expect(mockedSaveEvent).toHaveBeenCalledTimes(1);
        expect(mockedShowEvent).toHaveBeenCalledTimes(1);
    });

    it('should delete only current user name from current event', () => {
        //init
        const ctx = Context.getInstance();
        ctx.currentEvent = event;

        const principal = new PrincipalCommon(new Calendar(), user);

        //invoke
        principal.deleteName();

        //check
        expect(event.members).toEqual([{userName: "John Doe", id: "1"}, {userName: "Jason Born", id: "2"}])
        expect(mockedSaveEvent).toHaveBeenCalledTimes(0);
        expect(mockedShowEvent).toHaveBeenCalledTimes(0);
    });
});