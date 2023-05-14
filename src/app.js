import Calendar from "./component/calendar";
import { Amplify } from 'aws-amplify';
import awsconfig from './aws-exports';
import Auth from "./auth";
import UserData from "./user-data";
import ServiceWorkerConfigService from './service/service-worker-config';
import WebPushService from './service/webpush';
import PathJumper from "./service/path-jumper";

export default class App {
    constructor() {
        new PathJumper();
        const link = PathJumper.generateLink('2023-05-08', '123');
        console.log(link);
        this.configureAmplify();
        Amplify.configure(awsconfig);
        this.calendar = new Calendar();

        this.calendar.setup();

        if(process.env.WEBPACK_ENV === 'production') {
            this.webpush = new WebPushService();
            this.serviceWorkerConfig = new ServiceWorkerConfigService();
            this.serviceWorkerConfig.register(this.webpush);
            this.userData = new UserData(this.webpush);
        } else {
            this.userData = new UserData(null);
        }
        this.auth = new Auth(this.calendar, this.userData);
        this.auth.checkUser();
    }

    configureAmplify() {
        awsconfig.oauth.redirectSignIn = `${window.location.origin}/`;
        awsconfig.oauth.redirectSignOut = `${window.location.origin}/`;
        Amplify.configure(awsconfig);
    }
}