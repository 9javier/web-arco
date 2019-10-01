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

  public date(dateToFormat) : string {
    this.setLocale(null);
    return moment(dateToFormat).format('DD/MM/YYYY')
  }

  public nowGlobalFormat() : string {
    this.setLocale(null);
    return moment().format('YYYY/MM/DD');
  }

  public globalFormat(dateToFormat) : string {
    this.setLocale(null);
    return moment(dateToFormat).format('YYYY/MM/DD');
  }

  public dateTimeNoFormat() : string {
    this.setLocale(null);
    return moment().format();
  }

  public dateMonthYear(dateToFormat) : string {
    this.setLocale('en');
    return moment(dateToFormat).format('l');
  }

  public hourMinute(timeToFormat) : string {
    this.setLocale(null);
    return moment(timeToFormat).format('LT');
  }

}
