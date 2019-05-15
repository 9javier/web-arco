import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class DateTimeParserService {

  constructor() {}

  private init() {
    moment.locale('es');
  }

  public timeFromNow(dateToFormat) : string {
    return moment(dateToFormat).startOf('hour').fromNow();
  }

  public dateTime(dateToFormat) : string {
    return moment(dateToFormat).format('DD/MM/YYYY HH:mm')
  }

}
