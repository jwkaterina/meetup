import Calendar from "./calendar";
import { Amplify } from 'aws-amplify';
import awsconfig from './aws-exports';
import Auth from "./auth";

export default class App {
    constructor() {
        this.configureAmplify();
        Amplify.configure(awsconfig);
        this.calendar = new Calendar();
        this.calendar.setup();
        this.auth = new Auth(this.calendar);
        this.auth.checkUser();
    }

    configureAmplify() {
        awsconfig.oauth.redirectSignIn = `${window.location.origin}/`;
        awsconfig.oauth.redirectSignOut = `${window.location.origin}/`;
        Amplify.configure(awsconfig);
    }
}