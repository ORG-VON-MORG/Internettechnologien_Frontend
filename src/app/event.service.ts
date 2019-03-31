import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ObjectUnsubscribedError } from 'rxjs';

import * as moment from 'moment';

import { Event, EventPriority } from './entities/event.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private readonly serverUrl = 'http://localhost:1701/appointments/';

  constructor(
    private http: HttpClient
  ) {

  }

  public getByUserId(userId: number): Observable<Event[]> {
    return new Observable((observer) => {
      observer.next([
        {
          id: 1,
          title: 'Test Event 1',
          userId: 1,
          dateBegin: moment(),
          dateEnd: moment().add('minutes', 30),
          priority: EventPriority.LOW,
          color: '#4D007A'
        },
        {
          id: 2,
          title: 'Test Event 2',
          userId: 1,
          dateBegin: moment().add('minutes', 30),
          dateEnd: moment().add('hours', 1),
          priority: EventPriority.MEDIUM,
          color: '#60B515'
        },
        {
          id: 3,
          title: 'Test Event 3',
          userId: 1,
          dateBegin: moment().add('minutes', 60),
          dateEnd: moment().add('hours', 2),
          priority: EventPriority.URGENT,
          color: '#FF8400'
        }
      ]);
      observer.complete();
    });
    // return this.http.get(`${this.serverUrl}${userId}`);
  }

  public create(event: Event): Observable<Event> {
    return new Observable((observer) => {
      event.id = Math.round(Math.random() * 100000);
      observer.next(event);
      observer.complete();
    });
    // return this.http.post(`${this.serverUrl}${event.id}`, event);
  }

  public update(event: Event): Observable<Event> {
    return new Observable((observer) => {
      observer.next(event);
      observer.complete();
    });
    // return this.http.post(`${this.serverUrl}${event.id}`, event);
  }

  public delete(event: Event): Observable<Event> {
    return new Observable((observer) => {
      observer.next(event);
      observer.complete();
    });
    // return this.http.delete(`${this.serverUrl}${event.id}`);
  }

}
