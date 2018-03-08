import {Component, State, Listen} from '@stencil/core';
import { appConfig, firebaseConfig } from '../../helpers/config';

declare var firebase: any;

@Component({
  tag: 'push-subscription',
  styleUrl: 'push-subscription.scss'
})
export class OpportunityItem                    {

  @State() swSupport: boolean;
  @State() notify: boolean;   
  @State() messaging: any;

  componentWillLoad() {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      this.swSupport = true;
      this.configureFirebase();
      this.messaging = firebase.messaging();
      this.messaging.usePublicVapidKey(appConfig.serverKey);
    } else {
      this.swSupport = false;
    }
    console.log('Supports Push' , this.swSupport);
  }

  configureFirebase() {
      firebase.initializeApp(firebaseConfig);
  }

  @Listen('ionChange')
  subscribeToNotify($event: CustomEvent) {
    console.log($event.detail.checked);

    if ($event.detail.checked === true) {
    this.messaging.requestPermission()
        .then(function() {
        console.log('Notification permission granted.');
        })
        .catch(function(err) {
        console.log('Unable to get permission to notify.', err);
        });
      // this.handleSub();
    }
  }

  render() {
    return (<div>
            { this.swSupport ? <ion-item>
              <ion-label>Notifications</ion-label>
              <ion-toggle checked={this.notify} disabled={this.notify}></ion-toggle>
            </ion-item> : null}
        </div>
    );
  }
}
