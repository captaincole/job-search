import {Component, Prop, Event, EventEmitter} from '@stencil/core';
import { Vote } from '../../model/model';

@Component({
  tag: 'opportunity-item',
  styleUrl: 'opportunity-item.scss'
})
export class OpportunityItem {

  @Prop() vote: Vote;
  @Prop() id: string;
  @Prop() title: string;
  @Prop() company: string;
  @Prop() points: number;
  @Prop() source: string;
  @Prop() rank: number;
  @Prop() status: string;
  @Prop() user: any;
  @Prop() jobReqUrl: any;
  @Event() opportunityVote: EventEmitter;

  componentDidLoad() {

  }

  submitVote(val) {
    if (!this.user) {
        alert('Sign in to be able to vote!');
        return;
    }

    if (this.vote && this.vote.points === val) {
        this.opportunityVote.emit({ job: this.id, vote: this.vote, value: 0});
    } else {
        this.opportunityVote.emit({ job: this.id, vote: this.vote, value: val});
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
                <a href={this.jobReqUrl} class="job-title">
                    <span> {this.company} </span>
                    <span> {this.title} </span>
                </a>
                <div class="sub-content">
                    <span> {this.points * -1} points </span> |
                    <a> source: { this.source} </a> |
                    <button class={`status ${this.status}`}>{this.status.toUpperCase()}</button>
                </div>
          </div>
      </div>
    );
  }
}
