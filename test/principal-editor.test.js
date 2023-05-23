import PrincipalEditor from "../src/principal-editor";
import Calendar from "../src/component/calendar";
import PrincipalCommon from "../src/principal";
import { Context } from "../src/ctx";
import FormModal from "../src/component/form-modal";

jest.mock("../src/component/calendar");
jest.mock("../src/principal");
jest.mock("../src/ctx");
jest.mock("../src/component/confirm-modal");
jest.mock("../src/component/form-modal-select-custom");

describe('PrincipalEditor', function () {
    const mockedOpenCreateFormModal = jest
    .spyOn(PrincipalEditor.prototype, 'openCreateFormModal')
    .mockImplementation(() => {});

    const mockedLoadEventListeners = jest
    .spyOn(PrincipalEditor.prototype, 'loadEventListeners')
    .mockImplementation(() => {});

    document.body.innerHTML = `
    <div id="week-slots">
        <div class="main-week-slots" data-week-start="2023-04-17">
            <div data-dayindex="0" class="day-slots">           
                <div data-hour="0" class="slot"></div>
            </div>
        </div>
    </div>
    <snack-bar text="Quelque chose s'est mal passé..."></snack-bar>
    `;

    Context.getInstance.mockImplementation(() => {
        return {
            usersLoadedPromise: Promise.resolve(),
            weekStart: new Date('2023-04-17')
        }
    });

    it('clickSlot should create event with end hour less than 23', async () => {
        //init
        const hour = 15;
        const dayIndex = 4;
        const principalEditor = new PrincipalEditor(new Calendar(), new PrincipalCommon());

        //invoke
        principalEditor.clickSlot(hour, dayIndex);
    

        //check
        expect(mockedOpenCreateFormModal).toHaveBeenCalledWith(
            expect.objectContaining({
                date: "2023-04-21",
                end: "16:30",
                memberIds: [],
                start: "15:00",
                weekStart: "2023-04-17"
            })
        );
    });

    it('clickSlot should create event with end hour equal to 23', () => {
        //init
        const hour = 23;
        const dayIndex = 4;
        const principalEditor = new PrincipalEditor(new Calendar(), new PrincipalCommon());

        //invoke
        principalEditor.clickSlot(hour, dayIndex);
    

        //check
        expect(mockedOpenCreateFormModal).toHaveBeenCalledWith(
            expect.objectContaining({
                date: "2023-04-21",
                end: "23:59",
                memberIds: [],
                start: "23:00",
                weekStart: "2023-04-17"
            })
          )
    });

    it('validateEvent should return false if form is not valid', async () => {
        //init
        const mockedFormIsValid = jest
        .spyOn(FormModal.prototype, "formIsValid")
        .mockReturnValue(false);

        const principalEditor = new PrincipalEditor(new Calendar(), new PrincipalCommon());
        const event = new Event({
            weekStart: "2023-04-17",
            place: "",
            start: "15:00",
            end: "16:30",
            date: "2023-04-21",
            memberIds: [],
            color: "",
            type: ""
        });

        //invoke
        await Promise.resolve(); //hack to wait until Promise in PrincipalEditor constructor resolves
        const result = principalEditor.validateEvent(event);

        //check
        expect(result).toBe(false);
        expect(mockedLoadEventListeners).toHaveBeenCalled();
        expect(mockedFormIsValid).toHaveBeenCalled();
    });

    it('validateEvent should return true if form is valid and event checked', async () => {
        //init
        const mockedFormIsValid = jest
        .spyOn(FormModal.prototype, "formIsValid")
        .mockReturnValue(true);

        const mockedCheckEvent = jest
        .spyOn(Calendar.prototype, "checkEvent")
        .mockImplementation(() => {});

        const principalEditor = new PrincipalEditor(new Calendar(), new PrincipalCommon());
        const event = new Event({
            weekStart: "2023-04-17",
            place: "",
            start: "15:00",
            end: "16:30",
            date: "2023-04-21",
            memberIds: [],
            color: "",
            type: ""
        });

        //invoke
        await Promise.resolve(); //hack to wait until Promise in PrincipalEditor constructor resolves
        const result = principalEditor.validateEvent(event);

        //check
        expect(result).toBe(true);
        expect(mockedLoadEventListeners).toHaveBeenCalled();
        expect(mockedFormIsValid).toHaveBeenCalled();
        expect(mockedCheckEvent).toHaveBeenCalled();
    });

    it('validateEvent should return false if event check did not pass', async () => {
        //init
        jest
        .spyOn(FormModal.prototype, "formIsValid")
        .mockReturnValue(true);

        jest
        .spyOn(FormModal.prototype, "showError")
        .mockImplementation(() => {});

        const mockedPrincipalConstructor = jest.fn(() => {
            return {
                snackbar: {
                    show: jest.fn()
                }
            }
        });
        PrincipalCommon.mockImplementation(mockedPrincipalConstructor);

        jest
        .spyOn(Calendar.prototype, "checkEvent")
        .mockImplementation(() => {
            throw Error("error message");
        });

        const principalEditor = new PrincipalEditor(new Calendar(), new PrincipalCommon());
        const event = new Event({
            weekStart: "2023-04-17",
            place: "",
            start: "15:00",
            end: "16:30",
            date: "2023-04-21",
            memberIds: [],
            color: "",
            type: ""
        });

        //invoke
        await Promise.resolve(); //hack to wait until Promise in PrincipalEditor constructor resolves
        const result = principalEditor.validateEvent(event);

        //check
        expect(result).toBe(false);
        expect(mockedLoadEventListeners).toHaveBeenCalled();
    });
});