import { Component, Listen, Prop, State } from '@stencil/core';
import { MatchResults } from '@stencil/router';
import { ToastController } from '@ionic/core';
import { Job } from '../../model/model';
import { urlB64ToUint8Array } from '../../helpers/utils';
import firebase from 'firebase';

@Component({
  tag: 'job-profile',
  styleUrl: 'job-profile.scss'
})
export class JobProfile {

  @Prop() match: MatchResults;
  @Prop({ connect: 'ion-toast-controller' }) toastCtrl: ToastController;
  @State() job: Job;
  @State() notify: boolean;
  @State() swSupport: boolean;

  // demo key from https://web-push-codelab.glitch.me/
  // replace with your key in production
  publicServerKey = urlB64ToUint8Array('BBsb4au59pTKF4IKi-aJkEAGPXxtzs-lbtL58QxolsT2T-3dVQIXTUCCE1TSY8hyUvXLhJFEUmH7b5SJfSTcT-E');

  componentDidLoad() {
    console.log(this.match.params.id);
    this.setListeners();
  }

  setListeners() {
    firebase.database().ref('jobs/' + this.match.params.id).on('value' , (snapshot) => {
        // Should Be Only One Value...
        this.job = { id: snapshot.key, ...snapshot.val()};
    });
  }

  @Listen('ionChange')
  subscribeToNotify($event) {
    console.log($event.detail.checked);

    if ($event.detail.checked === true) {
      this.handleSub();
    }
  }

  handleSub() {
    // get our service worker registration
    navigator.serviceWorker.getRegistration().then((reg: ServiceWorkerRegistration) => {

      // get push subscription
      reg.pushManager.getSubscription().then((sub: PushSubscription) => {

        // if there is no subscription that means
        // the user has not subscribed before
        if (sub === null) {
          // user is not subscribed
          reg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: this.publicServerKey
          })
            .then((sub: PushSubscription) => {
              // our user is now subscribed
              // lets reflect this in our UI
              console.log('web push subscription: ', sub);

              this.notify = true;
            })
        }
      })
    })
  }

  render() {
      return (
        <ion-page>
          <ion-header>
            <ion-toolbar color='primary'>
              <ion-title>Ionic PWA Toolkit</ion-title>
            </ion-toolbar>
          </ion-header>

          <ion-content>
            <p>
              {this.job ? this.job.title : null}
            </p>
          </ion-content>
        </ion-page>
      );
  }
}
