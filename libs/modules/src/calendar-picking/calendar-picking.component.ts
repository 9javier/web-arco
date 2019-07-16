import { Component, OnInit,ViewChild } from '@angular/core';
import { DatePickerComponent } from 'ng2-date-picker';

@Component({
  selector: 'suite-calendar-picking',
  templateUrl: './calendar-picking.component.html',
  styleUrls: ['./calendar-picking.component.scss']
})
export class CalendarPickingComponent implements OnInit {

  @ViewChild(DatePickerComponent) datePicker:DatePickerComponent;
  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.datePicker.api.open();
  }

}
