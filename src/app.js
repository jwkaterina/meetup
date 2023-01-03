import Calendar from "./calendar";
import { Amplify } from 'aws-amplify';
import awsconfig from './aws-exports';
import Auth from "./auth";

export default class App {
    constructor() {
        Amplify.configure(awsconfig);
        this.calendar = new Calendar();
        this.auth = new Auth(this.calendar);
        this.auth.checkUser();
    }
}