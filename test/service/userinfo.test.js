import UserInfoService from "../../src/service/userinfo";
import { API } from "aws-amplify";
import apiResult1 from "../utils/list-users-result1.json";
import apiResult2 from "../utils/list-users-result2.json";


describe('UserInfo', () => {

    const mockedGetAuthHeader = jest
    .spyOn(UserInfoService.prototype, 'getAuthHeader')
    .mockResolvedValue("Auth header");

    it("should fetch the user", async () => {
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
            id : '369e16e1-edc1-4418-ba6c-a872059541b2',
            firstName: 'Regina',
            lastName: 'Phalange'
        });
    });

    it("should load multiple pages", async () => {
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
            id : '369e16e1-edc1-4418-ba6c-a872059540b1',
            firstName: 'John',
            lastName: 'Doe'
        });

        expect(res[1]).toMatchObject({
            id : '0beb33f3-f560-4242-b4ff-a6e61123e0db',
            firstName: 'Jason',
            lastName: 'Born'
        });

        expect(res[2]).toMatchObject({
            id : '369e16e1-edc1-4418-ba6c-a872059541b2',
            firstName: 'Regina',
            lastName: 'Phalange'
        });
    });
});