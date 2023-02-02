export default class User{
    constructor(id, firstName, lastName) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
    }

    get name() {
        return `${this.firstName} ${this.lastName}`
    }
}