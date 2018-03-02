import { Component, State, Listen } from '@stencil/core';
import { Job } from '../../model/model';
import firebase from 'firebase';

@Component({
  tag: 'app-home',
  styleUrl: 'app-home.scss'
})
export class AppHome {

  @State() jobList: Array<Job> = [];
  @State() user: any;
  @State() showLogin: boolean = false;
  @State() userVotes: any = {};

  componentDidLoad() {
    // Load Data!
    this.setDataListners();
    this.getUser();
    // add job...
    // this.addJob();
  }

  addJob() {
    jobs.forEach(job => {
        firebase.database().ref('jobs').push(job);
    });
  }

  setDataListners() {
    // Setup Firebase Listeners To Push Data...
    let jobsRef = firebase.database().ref('jobs').orderByChild('points').limitToLast(25);
    jobsRef.once('value', (snapshot) => {
      snapshot.forEach((childSnapshot): any => {
        this.setVoteListener(childSnapshot.key);
      });
    });

    jobsRef.on('value', (snapshot) => {
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

  setVoteListener(jobId: string, ) {
    // Update Jobs Points Based On New Points...
    let tmpListener = firebase.database().ref('votes').orderByChild('voteOn').equalTo(jobId);
    tmpListener.on('value' , (snapshot) => {
      let newPoints = 0;
      snapshot.forEach( (voteRef: any): any => {
        newPoints += voteRef.val().points;
        this.userVotes[jobId] = { id: voteRef.key, ...voteRef.val()};
      });
      // Update Job
      firebase.database().ref('jobs/' + jobId).update({
        points: newPoints
      });
    });
  }

  findUserVotesOnce() {
    if (this.user) {
      let userVoteRef = firebase.database().ref('votes').orderByChild('user').equalTo(this.user.email);
      userVoteRef.once('value', (snapshot) => {
        snapshot.forEach( (voteRef): any => {
          let vote = voteRef.val();
          this.userVotes[vote.voteOn] = { id: voteRef.key, ...vote };
        });
      });
    }
  }

  getUser() {
    this.user = firebase.auth().currentUser;
    console.log('Found User' , this.user);
    // Watch for user updates!
    firebase.auth().onAuthStateChanged( (user) => {
      if (user) {
        this.user = user;
        this.findUserVotesOnce()
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

  @Listen('opportunityVote')
  handleVote($event) {
    let job = $event.detail.job;
    let vote = $event.detail.vote;
    let value = $event.detail.value;
    console.log('job' , job, 'vote' , vote);
    // Update or create
    if (vote) {
      let tmpVoteRef = firebase.database().ref('votes/' + vote.id);
      tmpVoteRef.update({
        points: value
      });
      tmpVoteRef.off();
    } else {
      // Create Vote
      firebase.database().ref('votes').push({
        user: this.user.email,
        voteOn: job,
        points: value,
        voteType: 'jobs'
      });
    }
  }

  render() {
    return (
      <ion-page>
        <ion-header>
          <ion-toolbar color='primary'>
            <ion-title>Job Search</ion-title>
            <ion-buttons slot="mode-end">
              { this.user ? <ion-button color="white" fill="clear" slot="end" class="tool-button" onClick={() => this.logout() }>Logout</ion-button> : <ion-button color="white" fill="clear" slot="end" class="tool-button" onClick={() => this.login()}>Login</ion-button> }
              <ion-button fill="clear" color="white" slot="end" class="tool-button" onClick={() => this.refreshPage()}>Sync</ion-button>
              { this.user ? <ion-button color="white" fill="clear" slot="end">{this.user.displayName}</ion-button>: null }
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        { this.showLogin ? <login-form></login-form> : null }
        <ion-content>
          <div id="firebaseui-auth-container"></div>
          <table class="job-list">
            {this.jobList.map( (job: Job, index) => 
              <opportunity-item jobId={job.id} title={job.title}
               rank={index + 1} user={this.user} company={job.company}
               source={job.source} vote={this.userVotes[job.id]} points={job.points}
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

let jobs = [{
  title: 'Front End Engineer',
  company: 'loggly',
  points: 0,
  source: 'Quest Groups, Darren',
  status: 'Interested'
},{
  title: 'Disributed Engineer',
  company: 'Protocol Labs',
  points: 0,
  source: 'organic',
  status: 'applied'
},
{
  title: 'Lead Engineer',
  company: 'SyncThink',
  points: 0,
  source: 'Quest, Cheyenne',
  status: 'interested'
},
{
  title: 'Front End Engineer',
  company: 'Percipient',
  points: 0,
  source: 'Quest, Cheyenne',
  location: 'Sunnyvale, CA',
  status: 'interested'
},{
  title: 'Front End Engineer',
  company: 'Oden',
  points: 0,
  source: 'Quest, Matt',
  location: 'NYC',
  status: 'interested'
},{
  title: 'Front End Engineer',
  company: 'CrowdTap',
  points: 0,
  source: 'Quest, Chelsey',
  location: 'NYC',
  status: 'intereseted'
}
]
