import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'suite-screen-result',
  templateUrl: './screen-result.component.html',
  styleUrls: ['./screen-result.component.scss']
})
export class ScreenResultComponent implements OnInit {

  @Input('type') type: number
  @Output('screenExit') exit: EventEmitter<boolean> = new EventEmitter(false)
  constructor() { }

  ngOnInit() {
    console.log(this.type);
  }

  screenExit() {
    this.exit.emit(true)
  }

}
