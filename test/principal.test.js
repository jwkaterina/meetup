import Event from "../src/components/event";
import { Context } from "../src/ctx";
import Calendar  from "../src/calendar";
import PrincipalCommon from "../src/principal";

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

    const user = {
        id: '6807bee0-d200-4c53-8e00-4cf0a1742387',
        firsName: 'Regina',
        lastName: 'Phalange',
        userName: 'Regina Phalange'
    };

    let event = null;

    beforeEach(() => {
        event = new Event({
            place: "",
            start: "12:00",
            end: "13:00",
            date: "2022-01-01",
            names: ["John Doe", "Jason Born"],
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
        const members = document.querySelectorAll(".member")
        expect(members.length).toBe(2);
        
        
        const names = [];
        for (const member of members) {
            names.push(member.innerHTML);
        }
        const intresection = event.names.filter(value => names.includes(value));
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
        expect(event.names).toEqual(["John Doe", "Jason Born", user.userName]);
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
            names: ["John Doe", user.userName],
            color: "green",
        });
        const ctx = Context.getInstance();
        ctx.currentEvent = event;

        //invoke
        principal.deleteName();

        //check
        expect(event.names).toEqual(["John Doe"]);
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
        expect(event.names).toEqual(["John Doe", "Jason Born"])
        expect(mockedSaveEvent).toHaveBeenCalledTimes(0);
        expect(mockedShowEvent).toHaveBeenCalledTimes(0);
    });
});