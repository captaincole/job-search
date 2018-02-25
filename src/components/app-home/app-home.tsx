import { Component } from '@stencil/core';


@Component({
  tag: 'app-home',
  styleUrl: 'app-home.scss'
})
export class AppHome {

  render() {
    return (
      <ion-page>
        <ion-header>
          <ion-toolbar color='primary'>
            <ion-title>Job Search</ion-title>
          </ion-toolbar>
        </ion-header>

        <ion-content>
          <table>
            <opportunity-item></opportunity-item>
          </table>

          { /* <stencil-route-link url='/profile/stencil'>
            <ion-button>
              Profile page
            </ion-button>
          </stencil-route-link> */ }
        </ion-content>
      </ion-page>
    );
  }
}
