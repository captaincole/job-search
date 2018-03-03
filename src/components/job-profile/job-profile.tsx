import { Component, Prop, State } from '@stencil/core';
import { MatchResults } from '@stencil/router';
import { Job } from '../../model/model';
import { RouterHistory } from '@stencil/router';
import firebase from 'firebase';

@Component({
  tag: 'job-profile',
  styleUrl: 'job-profile.scss'
})
export class JobProfile {

  @Prop() match: MatchResults;
  @Prop() history: RouterHistory;
  @State() job: Job;

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
  
  goBack() {
    this.history.goBack();
  }

  render() {
      return (
        <ion-page>
          <ion-header>
            <ion-toolbar color='primary'>
                <ion-buttons slot="start">
                    <button class="toolbar-but" onClick={ () => { this.goBack() }}><i class="fas fa-chevron-left fa-2x"></i></button>
                </ion-buttons>
              <ion-title>Ionic PWA Toolkit</ion-title>
            </ion-toolbar>
          </ion-header>

          <ion-content>
            { this.job ? <div class="profile">
                <div class="job-title">
                     <a href={this.job.companyUrl}>{this.job.company} - {this.job.title}</a>
                </div>
                <div class="location">
                    {this.job.location}
                </div>
                <div class="section">
                    <div class="header">Company Description</div>
                    <p>{this.job.companyDescription}</p>
                </div>
                <div class="section">
                    <div class="header">Company Details</div>                    
                    <p>{this.job.companyDetails}</p>
                </div>
                <div class="section">
                    <div class="header">The Job</div>                    
                    <p>{this.job.jobSummary}</p>
                </div>
            </div> : null }
          </ion-content>
        </ion-page>
      );
  }
}
