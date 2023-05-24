import Calendar from "./component/calendar";
import { Amplify } from 'aws-amplify';
import awsconfig from './aws-exports';
import Auth from "./auth";
import UserData from "./user-data";
import ServiceWorkerConfigService from './service/service-worker-config';
import WebPushService from './service/webpush';
import PathJumper from "./service/path-jumper";

export default class App {
    static configure() {
        PathJumper.parsePath();
        App.configureAmplify();
        const calendar = new Calendar();
        calendar.setup();
        let userData;
        if(process.env.WEBPACK_ENV === 'production') {
            const webpush = new WebPushService();
            const serviceWorkerConfig = new ServiceWorkerConfigService();
            serviceWorkerConfig.register(webpush);
            userData = new UserData(webpush);
        } else {
            userData = new UserData(null);
        }
        const auth = new Auth(calendar, userData);
        auth.checkUser()
        .catch(err => console.log('Cnanot check user:', err));
    }

    static configureAmplify() {
        awsconfig.oauth.redirectSignIn = `${window.location.origin}/`;
        awsconfig.oauth.redirectSignOut = `${window.location.origin}/`;
        Amplify.configure(awsconfig);
    }
}