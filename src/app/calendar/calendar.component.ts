import { Component, OnInit } from '@angular/core';

import * as moment from 'moment';
import 'moment/locale/de';

import { EventService } from '../event.service';
import { Event, EventPriority } from '../entities/event.model';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {

  public currentMonthIterable: moment.Moment[][];
  public weekDays: moment.Moment[];
  public showEventsModal: boolean;
  public showEventDetailModal: boolean;
  public detailEvent: Event;
  public events: Event[];
  public headlineOutput: string;
  public today = moment();
  public currentDate = moment();
  public modalObject: moment.Moment;

  constructor(
    private eventService: EventService
  ) {
    this.initWeekdays();
  }

  ngOnInit() {
    this.loadEvents();
  }

  /**
   * Inits the first row of the calendar grid to show the weekdays from a moment object.
   * In this way the names of the weekdays are automatically translated by the locale.
   */
  private initWeekdays(): void {
    const copyDate = moment(this.currentDate);
    let walk = copyDate;
    while (walk.weekday() !== 0) {
      walk = walk.subtract('day', 1);
    }
    this.weekDays = [];
    for (let i = 0; i < 7; i++) {
      this.weekDays.push(moment(walk));
      walk = walk.add('day', 1);
    }
  }

  /**
   * Inits the current calendar view regarding the month. The algorithm takes the first day of the current
   * month and then decrements the day value until it finds a monday. That monday is the first cell in the
   * calendar grid.
   *
   * @param date The date of the current displayed month
   */
  private initMonthDays(date: moment.Moment): void {
    const copyDate = moment(date);
    const firstDayOfMonth: moment.Moment = copyDate.startOf('month');
    let walk = firstDayOfMonth;
    while (walk.weekday() !== 0) {
      walk = walk.subtract('day', 1);
    }
    this.currentMonthIterable = [];
    for (let i = 0; i < 6; i++) {
      this.currentMonthIterable.push([]);
      for (let j = 0; j < 7; j++) {
        const addDate: moment.Moment = moment(walk);
        this.currentMonthIterable[i].push(addDate.add('day', j + ( i * 7)));
        this.currentMonthIterable[i][j]['events'] = [];
        for (const event of this.events) {
          if (event.startDate.format('DD.MM.YYYY') === this.currentMonthIterable[i][j].format('DD.MM.YYYY')) {
            this.currentMonthIterable[i][j]['events'].push(event);
          }
        }
      }
    }
  }

  /**
   * Loads the events from the events service.
   */
  public loadEvents(): void {
    this.eventService.getByUserId(2).subscribe(
      (res: Event[]) => {
        console.log(res);
        this.events = res;
        this.initMonthDays(this.currentDate);
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  /**
   * Sets the calendar view to the next month.
   */
  public showNextMonth(): void {
    this.currentDate = this.currentDate.add('month', 1);
    this.initMonthDays(this.currentDate);
  }

  /**
   * (Re)sets the calendar view to the month of the current date.
   */
  public showCurrentMonth(): void {
    this.currentDate = moment();
    this.initMonthDays(this.currentDate);
  }

  /**
   * Sets the calendar view to the previous month.
   */
  public showPreviousMonth(): void {
    this.currentDate = this.currentDate.subtract('month', 1);
    this.initMonthDays(this.currentDate);
  }

  /**
   * Sets the events modal visible, to show the events of the clicked date cell in detail.
   *
   * @param modalObject The date of the cell which was clicked containing its events.
   */
  public callEventModal(modalObject: moment.Moment): void {
    this.showEventsModal = true;
    this.modalObject = modalObject;
  }

  /**
   * Sets the event detail modal visible, to show the details of a specific event or create
   * a new one.
   *
   * @param event The event that has to be updated or null/undefined to create a new one
   */
  public callEventDetailModal(event?: Event): void {
    this.detailEvent = Object.assign({}, event);
    if (this.detailEvent.startDate) {
      this.detailEvent['startDateBuffer'] = this.detailEvent.startDate.format('HH:mm');
    } else {
      this.detailEvent['startDateBuffer'] = moment().format('HH:mm');
    }
    if (this.detailEvent.endDate) {
      this.detailEvent['endDateBuffer'] = this.detailEvent.endDate.format('HH:mm');
    } else {
      this.detailEvent['endDateBuffer'] = moment().add('minutes', 30).format('HH:mm');
    }
    if (!this.detailEvent.id) {
      this.detailEvent.priority = EventPriority.LOW;
    }
    this.showEventsModal = false;
    this.showEventDetailModal = true;
  }

  /**
   * Creates/Updates an event using the event service.
   *
   * @param event The event that has to be created/updated
   */
  public saveEvent(): void {
    this.detailEvent.startDate = moment(this.modalObject);
    this.detailEvent.endDate = moment(this.modalObject);
    let split = this.detailEvent['startDateBuffer'].split(':');
    this.detailEvent.startDate.set('hours', +split[0]);
    this.detailEvent.startDate.set('minutes', +split[1]);
    delete this.detailEvent['startDateBuffer'];
    split = this.detailEvent['endDateBuffer'].split(':');
    this.detailEvent.endDate.set('hours', +split[0]);
    this.detailEvent.endDate.set('minutes', +split[1]);
    delete this.detailEvent['endDateBuffer'];
    if (this.detailEvent.id) {
      this.eventService.update(this.detailEvent).subscribe(
        (res: Event) => {
          for (let i = 0; i < this.events.length; i++) {
            if (this.events[i].id === res.id) {
              this.events[i] = res;
              break;
            }
          }
          for (let i = 0; i < this.modalObject['events'].length; i++) {
            if (this.modalObject['events'][i].id === res.id) {
              this.modalObject['events'][i] = res;
              break;
            }
          }
        },
        (err: any) => {
          console.log(err);
        }
      ).add(() => {
        this.showEventDetailModal = false;
        this.showEventsModal = true;
      });
    } else {
      this.eventService.create(this.detailEvent).subscribe(
        (res: Event) => {
          this.events.push(res);
          this.modalObject['events'].push(res);
          this.initMonthDays(this.currentDate);
        },
        (err: any) => {
          console.log(err);
        }
      ).add(() => {
        this.showEventDetailModal = false;
        this.showEventsModal = true;
      });
    }
  }

  /**
   * Deletes an event using the event service.
   *
   * @param event The event that has to be deleted
   */
  public deleteEvent(event: Event): void {
    this.eventService.delete(event).subscribe(
      (res: Event) => {
        for (let i = 0; i < this.modalObject['events'].length; i++) {
          if (this.modalObject['events'][i].id === event.id) {
            this.modalObject['events'].splice(i, 1);
            break;
          }
        }
        for (let i = 0; i < this.events.length; i++) {
          if (this.events[i].id === event.id) {
            this.events.splice(i, 1);
            break;
          }
        }
        this.initMonthDays(this.currentDate); // Needs to be called to call all bindings correctly
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

}
