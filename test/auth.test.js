import { Hub } from "aws-amplify";
import { Context } from "../src/ctx";
import Auth from "../src/auth";
import Calendar  from "../src/calendar";
import PrincipalCommon from "../src/principal"
import user from "./utils/user.json";
import editor from "./utils/editor.json";
import admin from "./utils/admin.json";
import uninvited from "./utils/uninvited.json";

jest.mock("../src/ctx");
jest.mock("../src/calendar");
jest.mock("../src/principal");
 
describe('Auth', () => {

    const mockedSetupCalendar = jest
    .spyOn(Calendar.prototype, 'setup')
    .mockImplementation(() => {});

    const mockedPrincipalConstructor = jest.fn();
    PrincipalCommon.mockImplementation(mockedPrincipalConstructor);

    beforeEach(() => {
        document.body.innerHTML = `
        <div class="generalControls">
            <label class="radio-container">A
                <input type="radio" id="userA" checked="checked" name="radio">
                <span class="checkmark"></span>
            </label>
            <label class="radio-container">B
                <input type="radio" id="userB" name="radio">
                <span class="checkmark"></span>
            </label>
            <label class="radio-container">C
                <input type="radio" id="userC" name="radio">
                <span class="checkmark"></span>
            </label>
            <i id="todayButton" class="fas fa-solid fa-calendar-day"></i>
            <i id="addButton" class="fas fa-solid fa-plus"></i>                
            <i id="trashButton" class="fas fa-trash-alt"></i>
            <i id="loginButton" class="fas fa-solid fa-arrow-right-to-bracket"></i>
            <div id="log-name"></div>
            <div id="log-circle"></div>
            <label id="toggleSwitch" class="switch">
                <input id="checkBox" type="checkbox">
                <span class="slider"></span>
            </label>
        </div>
        `;
    });

    it('should register auth listener', () => {
        //init
        const mockedHubListen = jest
        .spyOn(Hub, 'listen')
        .mockImplementation(() => {});

        //invoke
        new Auth(new Calendar());

        //check
        expect(mockedHubListen).toBeCalledWith("auth", expect.anything());

        //clean up
        mockedHubListen.mockRestore();
    });

    it('should register user', async () => {
        //init
        const mockedGetUser = jest
        .spyOn(Auth.prototype, 'getUser')
        .mockResolvedValue(user);

        const mockedSwitchToUserMode = jest.fn();
        const mockedSwitchToAdminMode = jest.fn();
        Context.getInstance.mockImplementation(() => {
            return {
                switchToUserMode: mockedSwitchToUserMode,
                switchToAdminMode: mockedSwitchToAdminMode
            }
        });

        //invoke
        const auth = new Auth(new Calendar());
        await auth.checkUser();

        //check
        expect(mockedGetUser).toBeCalled();
        expect(PrincipalCommon).toBeCalledWith(expect.anything(), "John Doe");
        expect(mockedSwitchToUserMode).toBeCalledTimes(1);
        expect(mockedSwitchToAdminMode).toBeCalledTimes(0);
        expect(mockedSetupCalendar).toBeCalledTimes(1);

        //clean up
        auth.listenerCancelToken();
    });

    it('should register editor', async () => {
        //init
        const mockedGetUser = jest
        .spyOn(Auth.prototype, 'getUser')
        .mockResolvedValue(editor);

        const mockedSwitchToUserMode = jest.fn();
        const mockedSwitchToAdminMode = jest.fn();
        Context.getInstance.mockImplementation(() => {
            return {
                switchToUserMode: mockedSwitchToUserMode,
                switchToAdminMode: mockedSwitchToAdminMode
            }
        });

        //invoke
        const auth = new Auth(new Calendar());
        await auth.checkUser();

        //check
        expect(mockedGetUser).toBeCalled();
        expect(PrincipalCommon).toBeCalledWith(expect.anything(), "John Doe");
        expect(mockedSwitchToUserMode).toBeCalledTimes(0);
        expect(mockedSwitchToAdminMode).toBeCalledTimes(1);
        expect(mockedSetupCalendar).toBeCalledTimes(1);

        //clean up
        auth.listenerCancelToken();
    });

    it('should register admin', async () => {
        //init
        const mockedGetUser = jest
        .spyOn(Auth.prototype, 'getUser')
        .mockResolvedValue(admin);

        const mockedSwitchToUserMode = jest.fn();
        const mockedSwitchToAdminMode = jest.fn();
        Context.getInstance.mockImplementation(() => {
            return {
                switchToUserMode: mockedSwitchToUserMode,
                switchToAdminMode: mockedSwitchToAdminMode
            }
        });

        //invoke
        const auth = new Auth(new Calendar());
        await auth.checkUser();

        //check
        expect(mockedGetUser).toBeCalled();
        expect(PrincipalCommon).toBeCalledWith(expect.anything(), "John Doe");
        expect(mockedSwitchToUserMode).toBeCalledTimes(0);
        expect(mockedSwitchToAdminMode).toBeCalledTimes(1);
        expect(mockedSetupCalendar).toBeCalledTimes(1);

        //clean up
        auth.listenerCancelToken();
    });

    it('should ignore uninvited user', () => {
        //init
        const mockedSwitchToUserMode = jest.fn();
        const mockedSwitchToAdminMode = jest.fn();
        Context.getInstance.mockImplementation(() => {
            return {
                switchToUserMode: mockedSwitchToUserMode,
                switchToAdminMode: mockedSwitchToAdminMode
            }
        });

        //invoke
        const auth = new Auth(new Calendar());
        auth.processUser(uninvited); //not using auth.checkUser() cause it catches Errors

        //check
        expect(PrincipalCommon).toBeCalledTimes(0);
        expect(mockedSwitchToUserMode).toBeCalledTimes(0);
        expect(mockedSwitchToAdminMode).toBeCalledTimes(0);
        expect(mockedSetupCalendar).toBeCalledTimes(0);

        //clean up
        auth.listenerCancelToken();
    });
});