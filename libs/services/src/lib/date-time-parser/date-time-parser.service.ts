import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class DateTimeParserService {

  constructor() {}

  private setLocale(locale) {
    moment.locale(locale || 'es');
  }

  public timeFromNow(dateToFormat) : string {
    this.setLocale(null);
    return moment(dateToFormat).startOf('second').fromNow();
  }

  public dateTime(dateToFormat) : string {
    this.setLocale(null);
    return moment(dateToFormat).format('DD/MM/YYYY HH:mm')
  }

}
