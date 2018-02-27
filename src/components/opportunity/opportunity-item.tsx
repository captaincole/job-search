import {Component, Element, Prop, State} from '@stencil/core';
import firebase from 'firebase';

@Component({
  tag: 'opportunity-item',
  styleUrl: 'opportunity-item.scss'
})
export class OpportunityItem {

  @Element() el: HTMLElement;

  @Prop() job: any;
  @State() update: any;
  @Prop() rank: number;
  @State() totalComments: number = 22;
  @State() vote: any;
  @State() points: number;
  @State() votesRef: any;
  @Prop() user: any;

  componentDidLoad() {
      // Look for votes
      this.updateWatchers();
      // Listen to firebase users...
  }

  updateWatchers() {
    this.votesRef = firebase.database().ref('votes').orderByChild('voteOn').equalTo(this.job.id);
    this.votesRef.on('value', (snapshot) => {
        // Listen For New Votes, Update Vote Count And Current Vote
        console.log('Vote count changed', this.job.company);
        let voteCount = 0;
        snapshot.forEach( (vote): any => {
            let voteValue = vote.val();
            voteCount += voteValue.points;
            if (voteValue.user === this.user.email) {
                // is current users vote
                console.log('Found Vote', voteValue);
                this.vote = { id: vote.key , ...voteValue};
            }
        });
        console.log('voteCount' , voteCount);

        this.job.points = voteCount;
        this.points = voteCount;
        // Update job
        firebase.database().ref('jobs/' + this.job.id).update({
            points: this.points
        });
        this.update = !this.update;
     });
  }

  async submitVote(val) {
    if (!this.user) {
        alert('Sign in to be able to vote!');
        return;
    }
    if (this.vote) {
        // Has vote
        if (this.vote.points === val) {
            // Remove Vote
           console.log('Removing Vote', this.job.company);
           await firebase.database().ref('votes/' + this.vote.id).remove();
           this.vote = undefined;
           // Trigger ui update...
           this.update = !this.update;
           
        } else if (this.vote.points !== val) {
            // Remove Negative Vote, Add Positive Vote
            console.log('Updating Vote');
            await firebase.database().ref('votes/' + this.vote.id).update({
                points: val
            });
        }
    } else {
        // Add new vote
        console.log('Adding new vote');
        await firebase.database().ref('votes').push({
            points: val,
            user: this.user.email,
            voteOn: this.job.id,
            voteType: 'jobs'
        });
    }
  }

  render() {
    return (
      <div class="opportunity-item">
          <div class="rank">{this.rank}.</div>
          <div class="voting">
              <button onClick={() => this.submitVote(-1)}
                  class={ 'vote' +  (this.vote && this.vote.points === -1 ? ' active' : ' inactive') }>
                   <i class="fas fa-sort-up fa-2x"></i>
              </button>
              <button onClick={() => this.submitVote(1)}
                  class={ 'vote' +  (this.vote && this.vote.points === 1 ? ' active' : ' inactive') }>                  
                  <i class="fas fa-sort-down fa-2x"></i>
              </button>
          </div>
          <div class="content">
              <a class="job-title">
                  <span> {this.job.company} </span>
                  <span> {this.job.title} </span>
              </a>
              <div class="sub-content">
                  <span> {this.job.points * -1} points </span> |
                  <a> source: { this.job.source} </a> |
                  <a> {this.totalComments} comments </a>
              </div>
          </div>
      </div>
    );
  }
}
