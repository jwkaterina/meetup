export default class User {
    constructor(id, firstName, lastName) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
    }

    get name() {
        return `${this.firstName} ${this.lastName}`
    }

    static parseUser(authUser) {
        const givenName = authUser.attributes.given_name;
        const familyName = authUser.attributes.family_name;
        return new User(authUser.username, givenName, familyName);
    }
}