import User from "../src/user";

describe('User', () => {
    it('should construct userName', () => {
        //init
        const user = new User("12-sad-123", "John", "Doe");

        //check
        expect(user.name).toBe("John Doe");
    })
})