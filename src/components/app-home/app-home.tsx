import { Component, State, Listen } from '@stencil/core';
import firebase from 'firebase';

@Component({
  tag: 'app-home',
  styleUrl: 'app-home.scss'
})
export class AppHome {

  @State() jobList: Array<any> = [];
  @State() user: any;
  @State() showLogin: boolean = false;

  componentDidLoad() {
    // Load Data!
    this.setDataListners();
    this.getUser();
    // add job...
    // this.addJob();
  }

  addJob() {
    firebase.database().ref('jobs').push({
      title: 'Senior Frontend Engineer',
      company: 'Peloton',
      points: 0,
      source: 'Quest Groups, Matt'
    });
  }

  setDataListners() {
    // Setup Firebase Listeners To Push Data...
    let jobsRef = firebase.database().ref('jobs').orderByChild('points').limitToLast(25);
    jobsRef.once('value', (snapshot) => {
      console.log('got snapshot change');
      let tmpJobList = [];
      snapshot.forEach( (childSnapshot): any => {
        tmpJobList.push({ id: childSnapshot.key , ...childSnapshot.val() });
      });
      this.jobList = tmpJobList;
    }, (err) => {
      console.warn('Error Getting Data', err);
    });
  }

  getUser() {
    this.user = firebase.auth().currentUser;
    console.log('Found User' , this.user);
    // Watch for user updates!
    firebase.auth().onAuthStateChanged( (user) => {
      if (user) {
        this.user = user;
        // this.showLogin = false;
        console.log('Found User State Change' , this.user);
      } else {
        // Nothing Really...
        this.user = undefined;
      }
    });
  }

  login() {
    // Logging in
    console.log('Show Login');
    this.showLogin = true;
  }

  async logout() {
    await firebase.auth().signOut();
  }

  refreshPage() {
    location.reload();
  }

  @Listen('closeMenu')
  closeLoginForm() {
    this.showLogin = false;
  }

  render() {
    return (
      <ion-page>
        <ion-header>
          <ion-toolbar color='primary'>
            <ion-title>Job Search</ion-title>
            <ion-buttons slot="end">
              { this.user ? <div><button onClick={() => this.logout() }>Logout</button><div>{this.user.displayName}</div></div> : <button ion-button onClick={() => this.login()}>Login</button> }
              <button onClick={() => this.refreshPage()}>Refresh</button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        { this.showLogin ? <login-form></login-form> : null }
        <ion-content>
          <div id="firebaseui-auth-container"></div>
          <table>
            {this.jobList.map( (job, index) => 
              <opportunity-item job={job} rank={index + 1} user={this.user}
              ></opportunity-item>
            )}
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
