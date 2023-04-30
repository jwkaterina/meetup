import { API, Auth } from "aws-amplify";
import { encode } from "universal-base64url";
import "../component/snackbar";

export default class WebPushService {
  constructor() {
    this.snackbar = document.querySelector("snack-bar");
    this.swRegistration = null;
  }

  set registration(value) {
    this.swRegistration = value;
  }

  onRegistrationUpdate(registration) {
    this.registration = registration;
  }

  onRegistrationSuccess(registration) {
    this.registration = registration;
  }

  async subscribe() {
    if (!("Notification" in window)) {
      console.log("This browser does not support desktop notification");
    } else if (Notification.permission === "granted") {
      // Check whether notification permissions have already been granted;
      console.log('Notification granted previously');
      await this.subscribeUser();
    } else if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();

      if (permission === "granted") {
        console.log('Notification granted just now');
        await this.subscribeUser();
      }
    }
  }

  async unsubscribe() {
    if(!this.swRegistration) {
      return;
    }
    let subscription = await this.getSubscribtion();
    if (!subscription) {
      console.log('No WebPush Subscription Found');
      return
    }
    console.log('Trying to delete WebPush Subscription:', subscription);
    await this.deleteUserSubscription(subscription);

    try {
      await subscription.unsubscribe();
      console.log('Successfully unsubscribed from subscription');
    } catch (err) {
      console.log('Cannot unsubscribed from subscription: ', err);
    }
  }

  async subscribeUser() {
    if(!this.swRegistration) {
      return;
    }
    let subscription = await this.getSubscribtion();
    if (subscription) {
      const fetchedSubscription = await this.fetchUserSubscription(subscription);
      if (fetchedSubscription) {
        return;
      }
      console.log("Existing Subscription is not present on the backend. Resubscribing...");
      this.unsubscribe();
    }
    const key = await this.getWebPushKey();
    if(!key) {
      console.log('WebPush Public Key Not defined');
      return;
    }
    const keyBytes = this.urlB64ToUint8Array(key);

    subscription = await this.subscribeUserToWebPush(keyBytes)

    if(!subscription) {
      this.snackbar.show("Oups! Pas disponible sur votre appareil");
      return;
    }

    await this.saveUserSubscription(subscription);
      
  }

  async getSubscribtion() {
    /*
    * Safari might not have pushManager in ServiceRegistration
    * See: https://developer.apple.com/forums/thread/712627?login=true&page=1&r_s_legacy=true#743663022
    */
    if(!this.swRegistration || !this.swRegistration.pushManager) {
      return null;
    }
    try {
      return await this.swRegistration.pushManager.getSubscription();
    } catch (err) {
      console.log("Cannot get subscription:", err);
      return null;
    }
  }

  async getWebPushKey() {
    const myInit = {
      headers: {
        'Content-Type' : 'application/json',
        Authorization: `${(await Auth.currentSession()).getAccessToken().getJwtToken()}`,
      }
    };

    try{
      const res = await API.get('meetup', `/webpush/keys`, myInit);
      return res.data
    } catch (err) {
      console.log('Key Response Error:', err.response.data);
      return null;
    }
  }

  urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');
  
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
  
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  async subscribeUserToWebPush(applicationServerKey) {
    if(!this.swRegistration) {
      return null;
    }
    console.log("ServiceWorker Registration:", this.swRegistration);
    console.log("ServiceWorker Registration PushManager:", this.swRegistration.pushManager);

    if(!this.swRegistration.pushManager) {
      return null;
    }

    try {
      return await this.swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey
      })
    } catch (err) {
      console.log("Cannot register user to WebPush:", err);
      return null;
    }
  }

  async saveUserSubscription(subscription) {
    const user = await this.getUser();
    if(!user) {
      console.log("User not defined");
      return;
    }
    const myInit = {
      headers: {
        'Content-Type' : 'application/json',
        Authorization: `${(await Auth.currentSession()).getAccessToken().getJwtToken()}`,
      },
      body: subscription
    };

    try{
      const res = await API.put('meetup', `/webpush/subscriptions/${user.username}`, myInit);
      console.log('Put Subscription Response:', res)
    } catch (err) {
      console.log('Put Subscription Response Error:', err.response.data);
    }
  }

  async deleteUserSubscription(subscription) {
    const uri = await this.createSubscriptionUri(subscription);
    if (!uri) {
      return null;
    }
    const myInit = {
      headers: {
        Authorization: `${(await Auth.currentSession()).getAccessToken().getJwtToken()}`,
      }
    };

    try{
      const res = await API.del('meetup', uri, myInit);
      console.log('Delete Subscription Response:', res)
    } catch (err) {
      console.log('Delete Subscription Response Error:', err);
    }
  }

  async fetchUserSubscription(subscription) {
    const uri = await this.createSubscriptionUri(subscription);
    if (!uri) {
      return null;
    }
    const myInit = {
      headers: {
        'Content-Type' : 'application/json',
        Authorization: `${(await Auth.currentSession()).getAccessToken().getJwtToken()}`,
      }
    };

    try{
      const res = await API.get('meetup', uri, myInit);
      if(!res.success) {
        return null;
      }
      return res.data;
    } catch (err) {
      console.log('Cannot fetch subscription:', err);
      return null;
    }
  }

  async createSubscriptionUri(subscription) {
    if(!subscription.endpoint) {
      console.log('No endpoint in subscription', subscription)
      return null;
    }

    const subscriptionId = subscription.endpoint.split("/").pop();

    const user = await this.getUser();
    if(!user) {
      console.log("User not defined");
      return null;
    }

    const id = encode(subscriptionId);
    return `/webpush/subscriptions/${user.username}/${id}`
  }

  async getUser() {
    return await Auth.currentAuthenticatedUser();
  }
}