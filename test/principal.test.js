import Event from "../src/component/event";
import { Context } from "../src/ctx";
import Calendar from "../src/component/calendar";
import PrincipalCommon from "../src/principal";
import User from "../src/user";

jest.mock("../src/component/calendar");

describe('PrincipalCommon', function () {

    document.querySelector = jest.fn(() => {
        return {
            offsetHeight: 50
        }
    });

    const mockedCreateEvent = jest.fn(() => Promise.resolve());
    const mockedUpdateEvent = jest.fn(() => Promise.resolve());
    Calendar.mockImplementation(() => {
        const actualModule = jest.requireActual("../src/component/calendar");
        return {
            ...actualModule,
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            createEvent: mockedCreateEvent,
            updateEvent: mockedUpdateEvent,
        };
    });

    const mockedShowEvent = jest
    .spyOn(Event.prototype, 'show')
    .mockImplementation(() => {});

    const user = new User('6807bee0-d200-4c53-8e00-4cf0a1742387', 'Regina', 'Phalange');

    let event = null;

    beforeEach(() => {
        event = new Event({
            weekStart: "2023-01-16",
            place: "",
            start: "12:00",
            end: "13:00",
            date: "2023-01-17",
            memberIds: ["1", "2"],
            color: "green",
            type: "pm", 
        });

        document.body.innerHTML = `
        <div id="eventModal" class="modal">
            <div class="flip-card">
                <div class="flip-card-inner">
                    <div class="flip-card-front">
                        <button type="button" class="cancelButton">
                            <div class="cross"></div>
                        </button>
                        <div class="time"></div>
                        <div class="place"></div>
                        <div class="members"></div>          
                        <div class="eventControls">
                            <input type="button" value="S'inscrire" class="button joinButton">
                            <input type="button" value="Annuler" class="button deleteButton">
                            <input type="button" value="Éditer" class="button editButton">
                        </div>   
                    </div>
                    <div class="flip-card-back">
                        <h2 class="flipCardText">Bonne prédication!</h2> 
                    </div>
                </div>
            </div>
        </div>
        <div class="loading">
            <img id="loading-event" src="icons/loading-event.gif" alt="">
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
        
        
        const memberIds = [];
        for (const name of names) {
            memberIds.push(name.dataset.userId);
        }
        const intresection = event.memberIds.filter(value => memberIds.includes(value));
        expect(intresection.length).toBe(2);
    });

    it('should add name to current event', async () => {
        //init
        const principal = new PrincipalCommon(new Calendar(), user);
        const ctx = Context.getInstance();
        ctx.currentEvent = event;

        //invoke
        await principal.addName();

        //check
        expect(event.memberIds).toEqual(["1", "2", user.id]);
        expect(mockedUpdateEvent).toHaveBeenCalledTimes(1);
        expect(mockedCreateEvent).toHaveBeenCalledTimes(0);
        expect(mockedShowEvent).toHaveBeenCalledTimes(1);
    });

    it('should delete name from current event', async () => {
        //init
        const principal = new PrincipalCommon(new Calendar(), user);
        const event = new Event({
            weekStart: "2023-01-16",
            place: "",
            start: "12:00",
            end: "13:00",
            date: "2023-01-18",
            memberIds: ["1", user.id],
            color: "green",
            type: "pm",
        });
        const ctx = Context.getInstance();
        ctx.currentEvent = event;

        //invoke
        await principal.deleteName();

        //check
        expect(event.memberIds).toEqual(["1"]);
        expect(mockedUpdateEvent).toHaveBeenCalledTimes(1);
        expect(mockedCreateEvent).toHaveBeenCalledTimes(0);
        expect(mockedShowEvent).toHaveBeenCalledTimes(1);
    });

    it('should delete only current user name from current event', async () => {
        //init
        const ctx = Context.getInstance();
        ctx.currentEvent = event;

        const principal = new PrincipalCommon(new Calendar(), user);

        //invoke
        await principal.deleteName();

        //check
        expect(event.memberIds).toEqual(["1", "2"])
        expect(mockedUpdateEvent).toHaveBeenCalledTimes(0);
        expect(mockedCreateEvent).toHaveBeenCalledTimes(0);
        expect(mockedShowEvent).toHaveBeenCalledTimes(0);
    });
});