import {Component, Element, Prop, State} from '@stencil/core';

@Component({
  tag: 'opportunity-item',
  styleUrl: 'opportunity-item.scss'
})
export class OpportunityItem {

  @Element() el: HTMLElement;

  @Prop() src: string;
  @Prop() rank: number = 1;
  @Prop() alt: string;
  @Prop() company: string = 'Google';
  @Prop() title: string = 'Senior Web Developer';
  @Prop() points: number = 12;
  @Prop() source: string = 'Organic';
  @State() totalComments: number = 22; 

  render() {
    return (
      <div class="opportunity-item">
          <div class="rank">{this.rank}.</div>
          <div class="voting">
              <button class="vote"> <i class="fas fa-sort-up fa-2x"></i> </button>
              <button class="vote"> <i class="fas fa-sort-down fa-2x"></i> </button>
          </div>
          <div class="content">
              <a class="job-title">
                  <span> {this.company} </span>
                  <span> {this.title} </span>
              </a>
              <div class="sub-content">
                  <span> {this.points} points </span> |
                  <a> source: { this.source} </a> |
                  <a> {this.totalComments} comments </a>
              </div>
          </div>
      </div>
    );
  }
}
