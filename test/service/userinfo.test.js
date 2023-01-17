import UserInfoService from "../../src/service/userinfo";
import { API } from "aws-amplify";
import apiResult1 from "../utils/list-users-result1.json";
import apiResult2 from "../utils/list-users-result2.json";


describe('UserInfo', () => {

    const mockedGetAuthHeader = jest
    .spyOn(UserInfoService.prototype, 'getAuthHeader')
    .mockResolvedValue("Auth header");

    it("should fetch users", async () => {
        //init
        const mockedApiGet = jest
        .spyOn(API, 'get')
        .mockResolvedValue(apiResult2);

        const userInfo = new UserInfoService();

        //invoke
        const res = await userInfo.listUsers();

        //check
        expect(mockedGetAuthHeader).toBeCalledTimes(1);
        expect(mockedApiGet).toBeCalledTimes(1);

        expect(res[0]).toMatchObject({
            id : 'google_111420613982552900205',
            firstName: 'Regina',
            lastName: 'Phalange'
        });
    });

    it("should load multiple pages while fetching users", async () => {
        //init
        const mockedApiGet = jest
        .spyOn(API, 'get')
        .mockResolvedValueOnce(apiResult1)
        .mockResolvedValueOnce(apiResult2);

        const userInfo = new UserInfoService();

        //invoke
        const res = await userInfo.listUsers();

        //check
        expect(mockedGetAuthHeader).toBeCalledTimes(2);
        expect(mockedApiGet).toBeCalledTimes(2);

        expect(res[0]).toMatchObject({
            id : 'google_111420613982552900201',
            firstName: 'John',
            lastName: 'Doe'
        });

        expect(res[1]).toMatchObject({
            id : '0beb33f3-f560-4242-b4ff-a6e61123e0db',
            firstName: 'Jason',
            lastName: 'Born'
        });

        expect(res[2]).toMatchObject({
            id : 'google_111420613982552900205',
            firstName: 'Regina',
            lastName: 'Phalange'
        });
    });

    it("should fetch editors", async () => {
        //init
        const mockedApiGet = jest
        .spyOn(API, 'get')
        .mockResolvedValue(apiResult2);

        const userInfo = new UserInfoService();

        //invoke
        const res = await userInfo.listEditors();

        //check
        expect(mockedGetAuthHeader).toBeCalledTimes(1);
        expect(mockedApiGet).toBeCalledTimes(1);

        expect(res[0]).toMatchObject({
            id : 'google_111420613982552900205',
            firstName: 'Regina',
            lastName: 'Phalange'
        });
    });

    it("should load multiple pages while fetching editors", async () => {
        //init
        const mockedApiGet = jest
        .spyOn(API, 'get')
        .mockResolvedValueOnce(apiResult1)
        .mockResolvedValueOnce(apiResult2);

        const userInfo = new UserInfoService();

        //invoke
        const res = await userInfo.listEditors();

        //check
        expect(mockedGetAuthHeader).toBeCalledTimes(2);
        expect(mockedApiGet).toBeCalledTimes(2);

        expect(res[0]).toMatchObject({
            id : 'google_111420613982552900201',
            firstName: 'John',
            lastName: 'Doe'
        });

        expect(res[1]).toMatchObject({
            id : '0beb33f3-f560-4242-b4ff-a6e61123e0db',
            firstName: 'Jason',
            lastName: 'Born'
        });

        expect(res[2]).toMatchObject({
            id : 'google_111420613982552900205',
            firstName: 'Regina',
            lastName: 'Phalange'
        });
    });
});