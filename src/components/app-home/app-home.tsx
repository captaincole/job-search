import { Component, State, Listen } from '@stencil/core';
import { Job } from '../../model/model';
import firebase from 'firebase';
import sampleData from '../../sample-data';

@Component({
  tag: 'app-home',
  styleUrl: 'app-home.scss'
})
export class AppHome {

  @State() jobList: Array<Job> = [];
  @State() user: any;
  @State() showLogin: boolean = false;
  @State() userVotes: any = {};
  @State() personalPhotoUrl: string = 'assets/images/cropped-headshot.jpg';
  @State() linkedIn: string = 'https://www.linkedin.com/in/andrew-cole-03594427';
  @State() githubUrl: string = 'https://github.com/thielCole/job-search';

  componentDidLoad() {
    // Load Data!
    console.log('component did load app-home');
    this.setDataListners();
    this.getUser();
    // add job...
    // this.addJob();
  }

  addJob() {
    sampleData.forEach(job => {
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
        if (this.user && voteRef.val().user === this.user.email) {
          this.userVotes[jobId] = { id: voteRef.key, ...voteRef.val()};
        }
      });
      // Update Job If Logged In...
      if (this.user && this.user.email) {
        firebase.database().ref('jobs/' + jobId).update({
          points: newPoints
        });
      }
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
        this.findUserVotesOnce();
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

  hireMe() {
    window.open(this.linkedIn);
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

  github() {
    window.open(this.githubUrl);
  }

  render() {
    return (
      <ion-page>
        <ion-header>
          <ion-toolbar color='primary'>
            <ion-title>Job Search</ion-title>
            <ion-buttons slot="mode-end">
              { this.user ? <button class="tool-button" onClick={() => this.logout() }>LOGOUT</button> : <button class="tool-button" onClick={() => this.login()}>LOGIN</button> }
              { this.user ? <button class="tool-button">{this.user.displayName.toUpperCase()}</button>: null }
              <button class="tool-button" onClick={() => this.refreshPage()}><i class="fas fa-sync fa-2x"></i></button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        { this.showLogin ? <login-form></login-form> : null }
        <ion-content>
          <div class="profile">
            <img src={this.personalPhotoUrl}></img>
            <div class="name">Andrew Cole</div>
            <div class="links">
              <button class="social" onClick={() => this.github()}>
                <i class="fab fa-github fa-2x"></i>
              </button>
              <button class="social" onClick={() => this.hireMe()}>
                <i class="fab fa-linkedin fa-2x"></i>
              </button>
            </div>
            <div class="description">Welcome to my interview leaderboard! I decided to let my friends (and now the internet) vote on the companies that I am interviewing with to help me decide what to do with my next career jump. Login and vote below!</div>
            { false ? <push-subscription></push-subscription> : null }
          </div>
          <table class="job-list">
            {this.jobList.map( (job: Job, index) => 
              <opportunity-item {...job}
               rank={index + 1} user={this.user} vote={this.userVotes[job.id]} 
              ></opportunity-item>
            )}
          </table>
          <div class="footer">
            <div class="description">Want to add your company to the list? Think this leaderboard is pretty cool? I am available, and looking for new opportunities.</div>
            <ion-button onClick={() => this.hireMe()}>Hire Me</ion-button>
          </div>
        </ion-content>
      </ion-page>
    );
  }
}
