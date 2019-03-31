import { Component, Input, OnChanges, OnInit, SimpleChange } from '@angular/core';

import * as moment from 'moment';

import { Event, EventPriority } from '../entities/event.model';

@Component({
  selector: 'app-date-cell',
  templateUrl: './date-cell.component.html',
  styleUrls: ['./date-cell.component.scss']
})
export class DateCellComponent implements OnChanges, OnInit {

  @Input() public date: moment.Moment;
  @Input() public events: Event[] = [];

  public currentDate: moment.Moment = moment();
  public highestPriorityIterable: number[];

  constructor() { }

  ngOnInit() {
    this.getHighestPriority();
  }

  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
    if ((changes['date']) || (changes['events'])) {
      this.getHighestPriority();
    }
  }

  /**
   * Gets the highest priority of the dates events.
   */
  private getHighestPriority(): void {
    let highestPriority: EventPriority = EventPriority.LOW;
    for (const event of this.events) {
      if (event.priority > EventPriority.LOW) {
        highestPriority = event.priority;
      }
    }
    this.highestPriorityIterable = [];
    for (let i = 0; i < highestPriority; i++) {
      this.highestPriorityIterable.push(i);
    }
  }

}
