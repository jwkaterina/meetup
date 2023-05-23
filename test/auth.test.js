import { Hub } from "aws-amplify";
import { Context } from "../src/ctx";
import Auth from "../src/auth";
import Calendar  from "../src/component/calendar";
import PrincipalCommon from "../src/principal"
import user from "./utils/user.json";
import editor from "./utils/editor.json";
import admin from "./utils/admin.json";
import uninvited from "./utils/uninvited.json";
import UserData from "../src/user-data";
import IntroModal from "../src/component/intro-modal";

jest.mock("../src/ctx");
jest.mock("../src/component/calendar");
jest.mock("../src/principal");
jest.mock("../src/user-data");
jest.mock("../src/component/intro-modal");
 
describe('Auth', () => {

    window.matchMedia = jest.fn(() => {
        return {
         matches: true
        }
    });

    const mockedLoadCalendarEvents = jest
    .spyOn(Calendar.prototype, 'loadEvents')
    .mockImplementation(() => {});

    const mockeddisplayName = jest
    .spyOn(UserData.prototype, 'displayName')
    .mockImplementation(() => {});

    const mockedPrincipalConstructor = jest.fn();
    PrincipalCommon.mockImplementation(mockedPrincipalConstructor);

    beforeEach(() => {
        document.body.innerHTML = `
        <div class="generalControls">
            <i id="todayButton" class="fa-solid fa-calendar-day i-btn"></i>
            <i id="addButton" class="fa-solid fa-plus fa-lg i-btn"></i>        
            <div id="loginButton" class="log">
                <i class="fa-solid fa-arrow-right-to-bracket"></i>
                <p class="log-text">Se connecter</p>
            </div>
            <div id="loggedButton-name" class="log">
                <i class="fa-solid fa-user logged"></i>
                <p class="log-text logged"></p>
            </div>
            <div id="loggedButton-circle" class="log logged"></div>
        </div>
        <div id="dropdown">
            <div id="logoutButton" class="log">
                <i class="fa-solid fa-arrow-right-from-bracket"></i>
                <p class="log-text">Se déconnecter</p>
            </div>
            <div id="log-data" class="log">
                <p class="log-text">Mes données</p>
            </div>
        </div>
        `;
    });

    it('should register auth listener', () => {
        //init
        const mockedHubListen = jest
        .spyOn(Hub, 'listen')
        .mockImplementation(() => {});

        //invoke
        new Auth(new Calendar(), new UserData());

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
        const mockedSwitchToEditorMode = jest.fn();
        const mockedFetchUsers = jest.fn(() => Promise.resolve({}));
        Context.getInstance.mockImplementation(() => {
            return {
                switchToUserMode: mockedSwitchToUserMode,
                switchToEditorMode: mockedSwitchToEditorMode,
                fetchUsers: mockedFetchUsers
            }
        });

        //invoke
        const auth = new Auth(new Calendar(), new UserData());
        await auth.checkUser();

        //check
        expect(mockedGetUser).toBeCalled();
        expect(PrincipalCommon).toBeCalledWith(expect.anything(), expect.objectContaining({
            id : 'google_105045525067602259238',
            firstName: 'John',
            lastName: 'Doe',
            name: 'John Doe'
        }));
        expect(mockedFetchUsers).toBeCalledTimes(1);
        expect(mockedSwitchToUserMode).toBeCalledTimes(1);
        expect(mockedSwitchToEditorMode).toBeCalledTimes(0);
        expect(mockedLoadCalendarEvents).toBeCalledTimes(1);
        expect(mockeddisplayName).toBeCalledTimes(1);

        //clean up
        auth.listenerCancelToken();
    });

    it('should register editor', async () => {
        //init
        const mockedGetUser = jest
        .spyOn(Auth.prototype, 'getUser')
        .mockResolvedValue(editor);

        const mockedSwitchToUserMode = jest.fn();
        const mockedSwitchToEditorMode = jest.fn();
        const mockedFetchUsers = jest.fn(() => Promise.resolve({}));
        Context.getInstance.mockImplementation(() => {
            return {
                switchToUserMode: mockedSwitchToUserMode,
                switchToEditorMode: mockedSwitchToEditorMode,
                fetchUsers: mockedFetchUsers
            }
        });

        //invoke
        const auth = new Auth(new Calendar(), new UserData());
        await auth.checkUser();

        //check
        expect(mockedGetUser).toBeCalled();
        expect(PrincipalCommon).toBeCalledWith(expect.anything(), expect.objectContaining({
            id : 'google_105045525067602259238',
            firstName: 'John',
            lastName: 'Doe',
            name: 'John Doe'
        }));
        expect(mockedFetchUsers).toBeCalledTimes(1);
        expect(mockedSwitchToUserMode).toBeCalledTimes(0);
        expect(mockedSwitchToEditorMode).toBeCalledTimes(1);
        expect(mockedLoadCalendarEvents).toBeCalledTimes(1);
        expect(mockeddisplayName).toBeCalledTimes(1);

        //clean up
        auth.listenerCancelToken();
    });

    it('should register admin', async () => {
        //init
        const mockedGetUser = jest
        .spyOn(Auth.prototype, 'getUser')
        .mockResolvedValue(admin);

        const mockedSwitchToUserMode = jest.fn();
        const mockedSwitchToEditorMode = jest.fn();
        const mockedFetchUsers = jest.fn(() => Promise.resolve({}));
        Context.getInstance.mockImplementation(() => {
            return {
                switchToUserMode: mockedSwitchToUserMode,
                switchToEditorMode: mockedSwitchToEditorMode,
                fetchUsers: mockedFetchUsers
            }
        });

        //invoke
        const auth = new Auth(new Calendar(), new UserData());
        await auth.checkUser();

        //check
        expect(mockedGetUser).toBeCalled();
        expect(PrincipalCommon).toBeCalledWith(expect.anything(), expect.objectContaining({
            id : 'google_105045525067602259238',
            firstName: 'John',
            lastName: 'Doe',
            name: 'John Doe'
        }));
        expect(mockedFetchUsers).toBeCalledTimes(1);
        expect(mockedSwitchToUserMode).toBeCalledTimes(0);
        expect(mockedSwitchToEditorMode).toBeCalledTimes(1);
        expect(mockedLoadCalendarEvents).toBeCalledTimes(1);
        expect(mockeddisplayName).toBeCalledTimes(1);

        //clean up
        auth.listenerCancelToken();
    });

    it('should ignore uninvited user', () => {
        //init
        const mockedSwitchToUserMode = jest.fn();
        const mockedSwitchToEditorMode = jest.fn();
        const mockedFetchUsers = jest.fn();
        Context.getInstance.mockImplementation(() => {
            return {
                switchToUserMode: mockedSwitchToUserMode,
                switchToEditorMode: mockedSwitchToEditorMode,
                fetchUsers: mockedFetchUsers
            }
        });
        const mockedIntroModalShow = jest.fn();
        IntroModal.build = jest.fn().mockImplementation(() => {
            return {
                show: mockedIntroModalShow
            }
        });

        //invoke
        const auth = new Auth(new Calendar(), new UserData());
        auth.processUser(uninvited); //not using auth.checkUser() cause it catches Errors

        //check
        expect(mockedIntroModalShow).toBeCalledTimes(1);
        expect(PrincipalCommon).toBeCalledTimes(0);
        expect(mockedFetchUsers).toBeCalledTimes(0);
        expect(mockedSwitchToUserMode).toBeCalledTimes(0);
        expect(mockedSwitchToEditorMode).toBeCalledTimes(0);
        expect(mockedLoadCalendarEvents).toBeCalledTimes(0);
        expect(mockeddisplayName).toBeCalledTimes(0);

        //clean up
        auth.listenerCancelToken();
    });
});