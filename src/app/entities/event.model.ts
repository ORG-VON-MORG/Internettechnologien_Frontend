import * as moment from 'moment';

export enum EventPriority {

  LOW = 0,
  MEDIUM = 1,
  HIGH = 2,
  URGENT = 3

}

export interface Event {

  id?: number;
  userId?: number;
  title?: string;
  startDate?: moment.Moment;
  endDate?: moment.Moment;
  priority?: EventPriority;
  color?: string;

}
